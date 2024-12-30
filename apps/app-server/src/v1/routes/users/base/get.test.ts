import { describe, expect } from '@jest/globals';
import { TestHelper } from '../../../../../test/test-helper';
import { zRes } from './get';

const testHelper = new TestHelper('/v1/users');

describe('get user', () => {
  testHelper.test(async ({ fetch, request, signIn, api, authDev }) => {
    const auth = await authDev(1);

    const res = await api.get({ pathname: '/v1/users', args: { auth } });

    const json = await res.json();

    expect(res.status).toBe(200);

    const { success } = zRes.safeParse(json);
    expect(success).toBe(true);
  });
});
