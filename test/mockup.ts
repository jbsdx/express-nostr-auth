import express, { json } from 'express';
import { finalizeEvent, generateSecretKey, getPublicKey } from 'nostr-tools';
import { getToken } from 'nostr-tools/nip98';

import { nostrAuthorization } from '../src/middleware';

const app = express();

export const server = app.listen(3100);

app.use(json());

app.use('/api', nostrAuthorization({
    debug: false,
    persistPubkey: true,
    persistPubkeyFieldName: 'nostr',
    ttl: 60
}));

app.get('/api/state', (_req, res) => {
    res.status(200).send({
        state: true
    });
});

app.post('/api/state', (_req, res) => {
    res.status(200).send({
        state: true
    });
});

export const sk = generateSecretKey();
export const pk = getPublicKey(sk);

export const token = (options: {
    time?: number,
    method: string,
    payload?: unknown
}) => getToken('http://127.0.0.1:3100/api/state', options.method, (event) => {
    if (options.time)
        event.created_at = options.time;

    return finalizeEvent(event, sk);
}, true, options.payload);
