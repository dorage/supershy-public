import { describe, expect } from '@jest/globals';
import { TestHelper } from 'test/test-helper';
import { z } from 'zod';
import { zJson } from './put';

const testHelper = new TestHelper('/v1/users/schools');

/**
 * TODO; 초기 가입자 - 실패
 * TODO; 이름/성별 - 성공
 * TODO; 학교/학년 - 실패
 */
describe('/v1/users/schools', () => {
  testHelper.test(async ({ api, authDev }) => {
    const registerSchool = (auth: any) =>
      api.put<z.infer<typeof zJson>>({
        pathname: '/v1/users/schools',
        args: {
          auth,
          body: {
            city: '010101',
            type: 'smk',
            nspn: 'A-A-ASMK',
          },
        },
      });

    {
      const auth = await authDev(1);
      const res = await registerSchool(auth);
      expect(res.status).toBe(403);
    }
    {
      const auth = await authDev(3);
      const res = await registerSchool(auth);
      expect(res.status).toBe(403);
    }
    {
      const auth = await authDev(2);
      const res = await registerSchool(auth);
      expect(res.status).toBe(200);
    }
  });
});
