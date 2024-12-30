import { describe, expect } from '@jest/globals';
import { TestHelper } from 'test/test-helper';

const testHelper = new TestHelper('/v1/users/grade');

describe('/v1/users/grade', () => {
  testHelper.test(async ({ api, authDev }) => {
    const auth = await authDev(4);
    const res = await api.put({
      pathname: '/v1/users/grade',
      args: {
        auth,
        body: {
          grade: '1',
        },
      },
    });

    const json = await res.json();

    expect(res.status).toBe(200);
  });
});
