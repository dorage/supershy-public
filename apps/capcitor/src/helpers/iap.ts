import PremiumProvider from '@/providers/premiums';
import AuthRepository from '@/repositories/auth';
import AuthSignal from '@/signals/auth';
import { Capacitor } from '@capacitor/core';
import { LOG_LEVEL, Purchases } from '@revenuecat/purchases-capacitor';
import 'cordova-plugin-purchase';
import 'cordova-plugin-purchase/www/store';
import Storage from './storage';

export const CONSUMABLE = [
  'coin_100',
  'coin_500',
  'coin_1500',
  'coin_4000',
  'coin_100_promo',
  'coin_500_promo',
  'coin_1500_promo',
  'coin_4000_promo',
];

let _init = false;

const TransactionStorageKey = (options: { productId: string; transactionId: string }) =>
  `${options.productId}_${options.transactionId}`;

const validatePurchase = async (options: { productId: string; transactionId: string }) => {
  const { productId, transactionId } = options;

  try {
    const data = await Storage.getItem(TransactionStorageKey(options));
    if (data != null) return;
    await PremiumProvider.putPremiumsBuy({
      body: { product_id: productId, transaction_id: transactionId },
    });
    await Storage.setItem(TransactionStorageKey(options), 'TRUE');
  } catch (err) {
    console.error('[validatePurchase]: ', err);
  }
};

const initialize = async () => {
  if (_init) return;
  _init = true;

  // Revenuecat
  await Purchases.setLogLevel({
    level: import.meta.env.MODE === 'development' ? LOG_LEVEL.DEBUG : LOG_LEVEL.ERROR,
  });
  if (Capacitor.getPlatform() === 'ios') {
    await Purchases.configure({
      apiKey: '',
      appUserID: AuthSignal.getSignedAuth().user.id.toString(),
    });
  } else if (Capacitor.getPlatform() === 'android') {
    await Purchases.configure({
      apiKey: '',
      appUserID: AuthSignal.getSignedAuth().user.id.toString(),
    });
  }

  // validate before purchases
  const info = await Purchases.restorePurchases();
  for (const t of info.customerInfo.nonSubscriptionTransactions) {
    await validatePurchase({
      productId: t.productIdentifier,
      transactionId: t.transactionIdentifier,
    });
  }
};

const IAPHelper = {
  initialize,
  validatePurchase,
};

export default IAPHelper;
