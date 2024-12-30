import { describe, expect } from '@jest/globals';
import { TestHelper } from '../../../../../test/test-helper';
import { zJson, zRes } from './post';
import { z } from 'zod';

const testHelper = new TestHelper('/v1/auth/dev');

describe('auth sign-in', () => {
  testHelper.test(async ({ api }) => {
    const res = await api.post<z.infer<typeof zJson>>({
      pathname: '/v1/auth/dev',
      args: { body: { email: 'asdf@asdf.com' } },
    });

    const json = await res.json();

    expect(res.status).toBe(200);
    const { success } = zRes.safeParse(json);
    expect(success).toBe(true);
  });
});
