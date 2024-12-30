const sendNotificationToAll = async (options: { heading: string; content: string }) => {
  const res = await fetch('https://onesignal.com/api/v1/notifications', {
    method: 'POST',
    headers: {
      accept: 'application/json',
      Authorization: 'Basic NDNlMDM0ODEtNzM4MC00NTI4LTk3OGMtMDgxY2IzZmQ1MzNl',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      app_id: 'f9a30ca5-e9f4-4b31-9339-e0ae74542d61',
      name: `${options.heading}_to_all`,
      included_segments: ['All'],
      headings: {
        en: options.heading,
      },
      contents: {
        en: options.content,
      },
    }),
  });
  console.log('🚀 ~ file: onesignal.ts:21 ~ sendNotificationToAll ~ res:', res);
  if (res.status !== 200) {
    return res.text();
  }
  const json = await res.json();
  return json;
};

const sendNotificationToUser = async (options: {
  heading: string;
  content: string;
  userId: number;
}) => {
  const res = await fetch('https://onesignal.com/api/v1/notifications', {
    method: 'POST',
    headers: {
      accept: 'application/json',
      Authorization: 'Basic NDNlMDM0ODEtNzM4MC00NTI4LTk3OGMtMDgxY2IzZmQ1MzNl',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      app_id: 'f9a30ca5-e9f4-4b31-9339-e0ae74542d61',
      name: `${options.heading}_to_${options.userId}`,
      include_aliases: { external_id: [options.userId.toString()] },
      headings: {
        en: options.heading,
      },
      contents: {
        en: options.content,
      },
      target_channel: 'push',
    }),
  });
  console.log('🚀 ~ file: onesignal.ts:54 ~ res:', res);

  if (res.status !== 200) {
    return res.text();
  }
  const json = await res.json();
  return json;
};

const OneSignalHelper = {
  sendNotificationToAll,
  sendNotificationToUser,
};

export default OneSignalHelper;
