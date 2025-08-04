import assert from 'assert';
import supertest from 'supertest';

import { server, token } from './mockup';

describe('Test middleware function', () => {

    const request = supertest(server);

    it('should return 401 on unauthorized requests', async () => {
        const res = await request
            .get('/api/state')
            .expect(401);

        assert(res.body.error === 'Missing token');
    });

    it('should return 401 on invalid requests', async () => {
        const res = await request
            .get('/api/state')
            .set('authorization', 'Nostr thisisfake')
            .expect(401);

        assert(res.body.error === 'Invalid padding: string should have whole number of bytes');
    });

    it('should return 401 on expired tokens', async () => {
        const _token = await token({
            time: new Date('1999-12-12').getTime() / 1000,
            method: 'GET'
        });

        const res = await request
            .get('/api/state')
            .set('authorization', _token)
            .expect(401);

        assert(res.body.error === 'Nostr event expiration');
    });

    it('should return 200 on http post requests', async () => {
        const payload = { data: '123' };
        const _token = await token({ method: 'POST', payload });

        const res = await request
            .post('/api/state',)
            .send(payload)
            .set('authorization', _token)
            .set('content-type', 'application/json')
            .expect(200);

        assert(res.body.state === true);
    });

    it('should return 200 on authorized requests', async () => {
        const _token = await token({ method: 'GET' });

        const res = await request
            .get('/api/state')
            .set('authorization', _token)
            .expect(200);

        assert(res.body.state === true);
    });

    after(() => {
        server.close();
    });
});
