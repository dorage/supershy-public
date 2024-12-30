import { describe, expect } from '@jest/globals';
import { TestHelper } from 'test/test-helper';

const testHelper = new TestHelper('/v1/schools');

describe('/v1/schools', () => {
  testHelper.test(async ({ api, authDev }) => {
    const auth = await authDev(3);
    const res = await api.get({
      pathname: '/v1/schools',
      args: { auth },
    });

    const json = await res.json();

    expect(res.status).toBe(200);
  });
});
