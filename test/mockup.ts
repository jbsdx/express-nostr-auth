import express from 'express';
import { finalizeEvent, generateSecretKey, getPublicKey } from 'nostr-tools';
import { getToken } from 'nostr-tools/nip98';

import { nostrAuthorization } from 'src/middleware';

const app = express();

export const server = app.listen(3100);

app.use('/api', nostrAuthorization({
    debug: false,
    persistPubkey: true,
    persistPubkeyFieldName: 'user',
    ttl: 60
}));

app.get('/api/state', (_req, res) => {
    res.status(200).send({
        state: true
    });
});

export const sk = generateSecretKey();
export const pk = getPublicKey(sk);

export const token = () => getToken('http://127.0.0.1:3100/api/state', 'GET', (event) => {
    return finalizeEvent(event, sk);
}, true);
