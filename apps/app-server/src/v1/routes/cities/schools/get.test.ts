import { describe, expect } from '@jest/globals';
import { TestHelper } from 'test/test-helper';
import { zRes as zGetCitiesRes } from '../base/get';
import { zRes } from './get';

const testHelper = new TestHelper('/v1/cities/schools');

describe('/v1/cities/schools', () => {
  testHelper.test(async ({ fetch, request, signIn, api, authDev }) => {
    const auth = await authDev(1);

    const cityIds: string[] = [];

    // get cities
    const getCity = async (cityId?: string) => {
      const res = await api.get({
        pathname: '/v1/cities',
        args: {
          auth,
          query: {
            id: cityId,
          },
        },
      });
      expect(res.status).toBe(200);

      const json = await res.json();
      const { success } = zGetCitiesRes.safeParse(json);
      expect(success).toBe(true);

      const city = zGetCitiesRes.parse(json);
      if (city.length) {
        cityIds.push(city[0].id);
        await getCity(city[0].id);
      }
    };

    await getCity('000000');

    // get school
    for (const type of ['smp', 'smk', 'sma']) {
      const res = await api.get({
        pathname: `/v1/cities/schools`,
        args: {
          auth,
          query: {
            id: cityIds.at(-1),
            type: type,
          },
        },
      });

      expect(res.status).toBe(200);

      const json = await res.json();
      const { success } = zRes.safeParse(json);

      expect(success).toBe(true);
    }
  });
});
