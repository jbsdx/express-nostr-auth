import assert from 'assert';
import { verifyEvent, Event } from 'nostr-tools';
import { unpackEventFromToken, validateEventKind, validateEventMethodTag, validateEventUrlTag, validateEventPayloadTag } from 'nostr-tools/nip98';
import { NostrAuthOptions, NostrRequestOptions } from './options';

export const validateRequest = async (
    authOptions: Pick<NostrAuthOptions, 'debug' | 'ttl'>,
    requestOptions: NostrRequestOptions
) => {
    const { token, requestUrl, body, method } = requestOptions;
    const { debug, ttl } = authOptions;

    const log = (message: string, metadata?: unknown) => {
        if (debug)
            console.log(`[Nostr Auth]: ${message}`, metadata);
    };

    log('Unpack nostr event from token', token);
    const nostrEvent: Event = await unpackEventFromToken(token);

    const eventKindValid = validateEventKind(nostrEvent);
    assert(eventKindValid === true, 'Invalid nostr kind');

    const verified = verifyEvent(nostrEvent);
    log('Verified nostr event', verified);
    assert(verified === true, 'Nostr event invalid signature');

    // calculate nostr event creation time in seconds
    const creationDiffTime = Math.floor(Date.now() / 1000) - nostrEvent.created_at;
    log('Event creation time', { creationDiffTime, ttl });
    assert(creationDiffTime < ttl, 'Nostr event expiration');

    const urlTagValid = validateEventUrlTag(nostrEvent, requestUrl);
    log('Url tag validation', { urlTagValid });
    assert(urlTagValid === true, 'Nostr event url tag invalid: ' + requestUrl);

    const methodTagValid = validateEventMethodTag(nostrEvent, method);
    log('Method tag validation', { methodTagValid });
    assert(methodTagValid === true, 'Nostr event method tag invalid');

    if (body) {
        const payloadTagValid = validateEventPayloadTag(nostrEvent, body);
        log('Payload tag validation', { payloadTagValid });
        assert(payloadTagValid === true, 'Nostr event payload tag invalid');
    }

    return nostrEvent;
};