import StorageKeys from '@/constants/storage';
import Storage from '@/helpers/storage';
import UsersProvider from '@/providers/users';

const getFCMToken = async () => {
  return await Storage.getItem(StorageKeys.fcmToken);
};

const setFCMToken = async (token: string) => {
  await Storage.setItem(StorageKeys.fcmToken, token);
};

const isFCMRegistered = async (): Promise<boolean> => {
  const v = await Storage.getItem(StorageKeys.fcmTokenSet);
  return v != null;
};

const isFCMSubscribed = async (): Promise<boolean> => {
  const v = await Storage.getItem(StorageKeys.fcmTokenSet);
  if (v == null) return false;
  return v.toUpperCase() === 'TRUE';
};

const setFCMRegistered = async (registered: boolean) => {
  await Storage.setItem(StorageKeys.fcmTokenSet, String(registered));
};

const onPushNoticiation = async () => {
  const token = await Storage.getItem(StorageKeys.fcmToken);
  if (token == null) return;
  await UsersProvider.postUsersAlert({ body: { token } });
};

const offPushNotification = async () => {
  const token = await Storage.getItem(StorageKeys.fcmToken);
  if (token == null) return;
  await UsersProvider.deleteUsersAlert({ body: { token } });
};

const FCMRepository = {
  getFCMToken,
  setFCMToken,
  isFCMRegistered,
  isFCMSubscribed,
  setFCMRegistered,
  onPushNoticiation,
  offPushNotification,
};

export default FCMRepository;
