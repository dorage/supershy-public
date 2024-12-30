import { describe, expect } from '@jest/globals';
import { TestHelper } from 'test/test-helper';

const testHelper = new TestHelper('/v1/users');

describe('/v1/users', () => {
  testHelper.test(async ({ fetch, signIn }) => {
    const auth = await signIn();
    const res = await fetch({
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${auth.access_token}`,
        cookie: auth.cookies,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: 'tester tester', gender: 'f' }),
    });

    const json = await res.json();

    expect(res.status).toBe(200);
  });
});
