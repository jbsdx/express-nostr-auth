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

    it('should return 200 on authorized requests', async () => {
        const _token = await token();

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
