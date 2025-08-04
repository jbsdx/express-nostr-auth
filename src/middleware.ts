import { Request, Response, NextFunction } from 'express';
import { NostrEvent } from 'nostr-tools';

import { NostrAuthOptions } from './options';
import { validateRequest } from './validation';

export const nostrAuthorization = (options?: Partial<NostrAuthOptions>) =>
    async (req: Request, res: Response, next: NextFunction) => {
        const { protocol, body, host, method, originalUrl } = req;
        const { debug, ttl, persistPubkey, persistPubkeyFieldName } = options ?? {};

        const requestUrl = `${protocol}://${host}${originalUrl}`;
        const token = req.headers['authorization'];

        const handleAuthError = (message: string) => {
            res.status(401);
            res.send({ error: message });
        };

        let event: NostrEvent;
        try {
            event = await validateRequest({
                debug,
                ttl
            }, {
                requestUrl,
                method,
                token,
                body
            });
        } catch (error) {
            return handleAuthError(error.message);
        }

        if (persistPubkey) {
            const userFieldName = persistPubkeyFieldName || 'nostr';
            /**
             * Include pubkey to the express request object.
             * May be picked up by following middlewares, to resolve the 
             * nostr user metadata (kind=0) by its pubkey
             */
            req[userFieldName] = { pubkey: event.pubkey };
        }

        next();
    };
