import AppProviders from '@/providers/app';
import AuthRepository from '@/repositories/auth';
import AuthSignal from '@/signals/auth';
import {
  AdLoadInfo,
  AdMob,
  AdMobRewardItem,
  MaxAdContentRating,
  RewardAdOptions,
  RewardAdPluginEvents,
} from '@capacitor-community/admob';
import moment, { Moment } from 'moment';
import { createEffect, createSignal } from 'solid-js';
import Storage from './storage';
import _ from './fp';

// ADMOB timer

const CAP_TIME = 12;
const CAP_MAX = 3;
const CAP_STORAGE_KEY = 'AD_FRQ';

const frequentCapping = (() => {
  let _init = false;
  let _timeout: any = null;
  const [q, setQ] = createSignal<Moment[]>([]);

  const initialize = async () => {
    if (_init) return;
    _init = true;

    await getQueue();
  };

  const timedOut = () => {
    filterQueue();
  };

  /**
   * local storage -> queue
   */
  const getQueue = async () => {
    let q = JSON.parse((await Storage.getItem(CAP_STORAGE_KEY)) ?? '[]');
    q = q
      .map((e: any) => {
        try {
          return moment(e).utc(false);
        } catch (err) {
          console.error(err);
          return null;
        }
      })
      .filter((e: any) => e != null);

    setQ(q);
  };

  /**
   * Add, after watching ad
   */
  const addRewardTime = async () => {
    const now = moment().utc(false);
    setQ((prev) => [...prev, now]);
    await Storage.setItem(CAP_STORAGE_KEY, JSON.stringify(q()));
  };

  /**
   * Check, time
   */
  const filterQueue = () => {
    const now = moment().utc(false);
    const _q = q().filter((t) => {
      try {
        const diff = moment(t.add(12, 'hours')).diff(now, 'milliseconds');
        return diff > 0;
      } catch (err) {
        return false;
      }
    });
    if (_q.length !== q.length) setQ(_q);
  };

  /**
   * 잔여 개수
   * @returns
   */
  const left = () => Math.max(0, CAP_MAX - q().length);

  /**
   * 가장 빨리 준비되는 시간
   * @returns
   */
  const fastest = () => q()[0];

  const timer = () => {
    if (fastest == null) return;
    // Get today's date and time
    const now = new Date().getTime();
    // Find the distance between now and the count down date
    const distance = moment(fastest().add(12, 'hours')).diff(now);

    // Time calculations for days, hours, minutes and seconds
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    return {
      hours: _.zfill(hours, 1),
      minutes: _.zfill(minutes, 2),
      seconds: _.zfill(seconds, 2),
    };
  };

  /**
   * renew timeout
   */
  createEffect(() => {
    const f = fastest();
    if (_timeout != null) clearTimeout(_timeout);
    if (f == null) return;
    _timeout = setTimeout(timedOut, 1000);
  });

  return {
    initialize,
    addRewardTime,
    fastest,
    left,
    timer,
  };
})();

/////////////////////////////////////////////////////////////////////

let _init = false;

const initialize = async (): Promise<void> => {
  if (_init) return;
  _init = true;

  await AdMob.initialize({
    initializeForTesting: import.meta.env.MODE === 'development',
    maxAdContentRating: MaxAdContentRating.Teen,
  });
  await frequentCapping.initialize();

  AdMob.addListener(RewardAdPluginEvents.Loaded, (info: AdLoadInfo) => {
    console.debug('🚀 ~ file: admob.ts:21 ~ AdMob.addListener ~ info:', info);
    // Subscribe prepared rewardVideo
  });

  AdMob.addListener(RewardAdPluginEvents.Rewarded, async (rewardItem: AdMobRewardItem) => {
    console.debug('🚀 ~ file: admob.ts:26 ~ AdMob.addListener ~ rewardItem:', rewardItem);

    // ...
    if (import.meta.env.MODE === 'development') {
      try {
        await AppProviders.getAppAdmob({
          query: {
            ad_network: 'TEST',
            ad_unit: 'TEST',
            //   custom_data: customData, // <-- passed CustomData
            reward_amount: 'TEST',
            reward_item: 'TEST',
            timestamp: 'TEST',
            transaction_id: 'TEST',
            user_id: AuthSignal.getSignedAuth().user.id, // <-- Passed UserID
            signature: 'TEST',
            key_id: 'TEST',
          },
        });
      } catch (err) {
        console.error(err);
      }
    }
    await AuthRepository.loadSignedUser();

    // ...
  });
};

const rewardVideo = async (): Promise<void> => {
  const options: RewardAdOptions = {
    adId: '',
    isTesting: import.meta.env.MODE === 'development',
    // npa: true
    ssv: { userId: AuthSignal.getSignedAuth().user.id.toString(), customData: '' },
  };
  await AdMob.prepareRewardVideoAd(options);
  await AdMob.showRewardVideoAd();
  await frequentCapping.addRewardTime();
  await AuthRepository.loadSignedUser();
};

const AdmobHelper = { initialize, rewardVideo, frequentCapping };

export default AdmobHelper;
