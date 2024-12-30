import ZenzivaHelper from '@/src/helpers/zenziva';
import { Ky } from '@/src/helpers/kysely';
import { useAuth } from '@/src/middlewares/auth';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { SuperShyEnv } from 'src/globals';
import { z } from 'zod';
import { useUserRegistered } from '@/src/v1.0.1/middlewares/user';
import { useUser } from '@/src/v1/middlewares/user';

const app = new Hono<SuperShyEnv>();

const zJson = z.object({
  phone: z
    .string()
    .length(12)
    .regex(/[0-9]*/),
});

app.use('*', useAuth(), useUser(), useUserRegistered({ null: ['phone'] }));

app.post(zValidator('json', zJson), async (c) => {
  const json = c.req.valid('json');
  const payload = c.get('auth_payload');
  // OTP 번호 생성
  const otp = createOTP();
  // OTP 번호 DB에 저장
  await Ky.deleteFrom('user_otps').where('user_id', '=', payload.userId).execute();
  await Ky.insertInto('user_otps')
    .values({ user_id: payload.userId, phone: json.phone, otp: otp })
    .execute();
  // OTP 발송
  ZenzivaHelper.sendOTP({ to: json.phone, otp: otp });

  return c.json({ okay: true });
});

const randomDigit = () => Math.floor(Math.random() * 10);

const createOTP = () => {
  let otp = '';
  for (let i = 0; i < 6; i++) {
    otp += `${randomDigit()}`;
  }
  return otp;
};

export default app;
