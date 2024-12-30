import { describe, expect } from '@jest/globals';
import { TestHelper } from 'test/test-helper';

const testHelper = new TestHelper('/v1/auth/logout');

describe('/v1/auth/logout', () => {
  testHelper.test(async ({ fetch, request, signIn, api, authDev }) => {
    const auth = await authDev(0);
    const res = await api.post({
      pathname: '/v1/auth/logout',
      args: { auth },
    });

    expect(res.status).toBe(200);

    // expired된 토큰으로 리프레쉬 불가능
    const refreshRes = await api.post({
      pathname: '/v1/auth/refresh',
      args: {
        auth,
      },
    });

    expect(refreshRes.status).toBe(401);
  });
});
