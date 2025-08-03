import { Request, Response, NextFunction } from 'express';
import { verifyEvent, Event } from 'nostr-tools';
import { unpackEventFromToken, validateEventKind, validateEventMethodTag, validateEventUrlTag, validateEventPayloadTag } from 'nostr-tools/nip98';

import { NostrAuthOptions } from './options';

export const nostrAuthorization = (options?: Partial<NostrAuthOptions>) =>
    async (req: Request, res: Response, next: NextFunction) => {
        const auth = req.headers['authorization'];
        const requestUrl = `${req.protocol}://${req.host}${req.originalUrl}`;
        const ttl = options?.ttl ?? 60;

        const handleAuthError = (message: string) => {
            debug('Error', message);
            res.status(401);
            res.send({ error: message });
        };

        const debug = (message: string, metadata?: unknown) => {
            if (options?.debug)
                console.log(`[Nostr Auth]: ${message}`, metadata);
        };

        debug('Unpack nostr event from token', auth);

        let nostrEvent: Event;
        try {
            nostrEvent = await unpackEventFromToken(auth);
        } catch (error) {
            return handleAuthError(error.message);
        }

        if (!validateEventKind(nostrEvent))
            return handleAuthError('Invalid nostr kind');

        const verified = verifyEvent(nostrEvent);
        debug('Verified nostr event', verified);

        if (!verified)
            return handleAuthError('Nostr auth failed, invalid signature');

        // calculate nostr event creation time in seconds
        const creationDiffTime = Math.floor(Date.now() / 1000) - nostrEvent.created_at;
        debug('Event creation time', {
            creationDiffTime,
            ttl
        });

        if (creationDiffTime > ttl)
            return handleAuthError(`Nostr auth failed, creation time out of range (TTL: ${ttl} seconds)`);

        if (!validateEventUrlTag(nostrEvent, requestUrl))
            return handleAuthError('Nostr auth failed, url tag invalid: ' + requestUrl);

        if (!validateEventMethodTag(nostrEvent, req.method))
            return handleAuthError('Nostr auth failed, method tag invalid');

        if (req.body && !validateEventPayloadTag(nostrEvent, req.body))
            return handleAuthError('Nostr auth failed, payload tag invalid');

        if (options?.persistPubkey) {
            const userFieldName = options?.persistPubkeyFieldName ?? 'user';
            /**
             * Include pubkey to the express request object.
             * May be picked up by following middlewares, to resolve the 
             * nostr user metadata (kind=0) by its pubkey
             */
            req[userFieldName] = { pubkey: nostrEvent.pubkey };
            debug('Added nostr pubkey to request', { userFieldName });
        }

        next();
    };
