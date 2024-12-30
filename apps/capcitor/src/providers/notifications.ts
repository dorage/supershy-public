import { NotificationModel } from '@/types/models';
import API, { APIArguments } from '.';

interface getNotificationsArgs {
  query?: { last_notification_id?: string };
}
type getNotificationsResponse = NotificationModel[];

const getNotifications = (args: getNotificationsArgs) =>
  API.get<getNotificationsResponse>({
    pathname: '/v1/notifications',
    args: args,
    authorization: true,
  });

type getNotificationUnreadResponse = boolean;

const getNotificationUnread = (args: APIArguments) =>
  API.get<getNotificationUnreadResponse>({
    pathname: `/v1/notifications/unread`,
    args: args,
    authorization: true,
  });

type putNotificationsReadAllResponse = boolean;

const putNotificationsReadAll = (args: APIArguments) =>
  API.put<putNotificationsReadAllResponse>({
    pathname: '/v1/notifications/read',
    args: args,
    authorization: true,
  });

interface putNotificationsReadArgs {
  params: { notifiation_id: string };
}

type putNotificationsReadResponse = boolean;

const putNotificationsRead = (args: putNotificationsReadArgs) =>
  API.put<putNotificationsReadResponse>({
    pathname: `/v1/notifications/${args.params.notifiation_id}/read`,
    args: args,
    authorization: true,
  });

const NotificationProvider = {
  getNotifications,
  getNotificationUnread,
  putNotificationsRead,
  putNotificationsReadAll,
};

export default NotificationProvider;
