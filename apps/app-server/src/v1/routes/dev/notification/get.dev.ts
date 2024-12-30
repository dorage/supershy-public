import OneSignalHelper from '@/src/helpers/onesignal';
import { Ky } from '@/src/helpers/kysely';
import { Hono } from 'hono';
import { SuperShyEnv } from 'src/globals';

const app = new Hono<SuperShyEnv>();

app.get('/notify', async (c) => {
  const all = await OneSignalHelper.sendNotificationToAll({
    heading: 'NodeSDK to all',
    content: `NodeSDK to all NodeSDK to all`,
  });
  const single = await OneSignalHelper.sendNotificationToUser({
    heading: 'NodeSDK to 62',
    content: `NodeSDK to 62 NodeSDK to 62`,
    userId: 62,
  });

  return c.json({ all, single });
});

export default app;
