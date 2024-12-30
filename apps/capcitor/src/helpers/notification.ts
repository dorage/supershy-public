import FCMRepository from '@/repositories/fcm';
// import {
//   ActionPerformed,
//   PushNotificationSchema,
//   PushNotifications,
//   Token,
// } from '@capacitor/push-notifications';
import { getPlatform } from './capacitor';

// export const initialize = async () => {
//   // if (import.meta.env.MODE !== 'production') return;
//   if (getPlatform() === 'web') return;
//   // 토큰이 이미 로컬저장소에 있다면 리턴
//   if (await FCMRepository.getFCMToken()) return;

//   // Request permission to use push notifications
//   // iOS will prompt user and return if they granted permission or not
//   // Android will just grant without prompting
//   PushNotifications.requestPermissions().then((result) => {
//     if (result.receive === 'granted') {
//       // Register with Apple / Google to receive push via APNS/FCM
//       PushNotifications.register();
//     } else {
//       // Show some error
//     }
//   });

//   // On success, we should be able to receive notifications
//   PushNotifications.addListener('registration', async (token: Token) => {
//     await FCMRepository.setFCMToken(token.value);
//   });

//   // Some issue with our setup and push will not work
//   PushNotifications.addListener('registrationError', (error: any) => {
//     console.error('FCM registrationError: ', error);
//   });

//   // Show us the notification payload if the app is open on our device
//   PushNotifications.addListener(
//     'pushNotificationReceived',
//     (notification: PushNotificationSchema) => {
//       console.log('notification: ', notification.body);
//       // alert('Push received: ' + JSON.stringify(notification));
//     }
//   );

//   // Method called when tapping on a notification
//   PushNotifications.addListener(
//     'pushNotificationActionPerformed',
//     (notification: ActionPerformed) => {
//       // alert('Push action performed: ' + JSON.stringify(notification));
//     }
//   );
//   // Method called when tapping on a notification
//   PushNotifications.addListener(
//     'pushNotificationActionPerformed',
//     (notification: ActionPerformed) => {
//       // alert('Push action performed: ' + JSON.stringify(notification));
//     }
//   );
// };

import OneSignal from 'onesignal-cordova-plugin';
import AuthSignal from '@/signals/auth';

let _init = false;

// Call this function when your app starts
const initialize = (): void => {
  // set Onesignal userId
  OneSignal.login(AuthSignal.getSignedAuth().user.id.toString());

  if (_init) return;
  _init = true;
  // Uncomment to set OneSignal device logging to VERBOSE
  // OneSignal.Debug.setLogLevel(6);

  // Uncomment to set OneSignal visual logging to VERBOSE
  // OneSignal.Debug.setAlertLevel(6);

  // NOTE: Update the init value below with your OneSignal AppId.
  OneSignal.initialize('');

  OneSignal.Notifications.addEventListener('click', () => {
    let notificationData = JSON.stringify(event);
    console.log(notificationData);
  });

  // Prompts the user for notification permissions.
  //    * Since this shows a generic native prompt, we recommend instead using an In-App Message to prompt for notification permission (See step 7) to better communicate to your users what notifications they will get.
  OneSignal.Notifications.requestPermission(true)
    .then((accepted: boolean) => {
      console.log('User accepted notifications: ' + accepted);
    })
    .catch((err) => {
      console.error('Onesignal permission error: ', err);
    });
};

const subscribe = () => {
  OneSignal.User.pushSubscription.optIn();
};

const unsubscribe = () => {
  OneSignal.User.pushSubscription.optOut();
};

const isSubscribed = () => {
  return OneSignal.User.pushSubscription.optedIn;
};

const NotifiationHelper = {
  initialize,
  subscribe,
  unsubscribe,
  isSubscribed,
};

export default NotifiationHelper;
