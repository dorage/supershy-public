import { Ky } from '@/src/helpers/kysely';
import { useAuth } from '@/src/middlewares/auth';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { SuperShyEnv } from 'src/globals';
import { z } from 'zod';

const app = new Hono<SuperShyEnv>();

const zJson = z.object({
  otp: z.string().length(6),
});

app.put(useAuth(), zValidator('json', zJson), async (c) => {
  const payload = c.get('auth_payload');
  const json = c.req.valid('json');

  // OTP 테이블에서 획득
  const userOtp = await Ky.selectFrom('user_otps')
    .selectAll()
    .where('user_id', '=', payload.userId)
    .executeTakeFirstOrThrow();

  if (userOtp.otp !== json.otp) throw new HTTPException(404, { message: 'Invalid OTP' });

  // 전화번호 Verified True
  await Ky.updateTable('users')
    .set({ phone: userOtp.phone })
    .where('id', '=', payload.userId)
    .execute();

  return c.json({ okay: true });
});

export default app;
