import { describe, expect } from '@jest/globals';
import { TestHelper } from '../../../../../test/test-helper';
import { zRes } from './get';

const testHelper = new TestHelper('/v1/cities');

describe('get cities', () => {
  testHelper.test(async ({ fetch, signIn, request, authDev, api }) => {
    const auth = await authDev(1);

    const getCity = async (cityId?: string) => {
      const res = await api.get({
        pathname: `/v1/cities`,
        args: { auth, query: { id: cityId } },
      });
      expect(res.status).toBe(200);

      const json = await res.json();
      const { success } = zRes.safeParse(json);
      expect(success).toBe(true);

      const city = zRes.parse(json);
      console.log(city);
      if (city.length) await getCity(city[0].id);
    };

    await getCity('000000');
  });
});
