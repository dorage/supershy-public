import { Capacitor } from '@capacitor/core';

export const getPlatform = (): 'web' | 'ios' | 'android' => {
  return Capacitor.getPlatform().toLowerCase() as 'web' | 'ios' | 'android';
};

interface platformArgs<TWeb, TAndroid, TIOS> {
  web: () => TWeb | Promise<TWeb>;
  android: () => TAndroid | Promise<TAndroid>;
  ios: () => TIOS | Promise<TIOS>;
}
/**
 * android, ios, web 별 동작
 * @param param0
 * @returns
 */
export const platformHelper = <TWeb, TAndroid = TWeb, TIOS = TWeb>({
  web,
  android,
  ios,
}: platformArgs<TWeb, TAndroid, TIOS>):
  | TWeb
  | TAndroid
  | TIOS
  | Promise<TWeb>
  | Promise<TAndroid>
  | Promise<TIOS> => {
  const platform = getPlatform();
  if (platform === 'ios') return ios();
  if (platform === 'android') return android();
  return web();
};

interface nativeArgs<TNative, TWeb> {
  native: () => TNative | Promise<TNative>;
  web: () => TWeb | Promise<TWeb>;
}
/**
 * native 혹은 web
 * @param param0
 * @returns
 */
export const nativeHelper = <TNative, TWeb>({
  native,
  web,
}: nativeArgs<TNative, TWeb>): TNative | TWeb | Promise<TNative> | Promise<TWeb> => {
  if (Capacitor.isNativePlatform()) return native();
  return web();
};

/**
 * plugin 사용가능 상태 확인
 * @param name
 * @param callback
 * @param fallback
 * @returns
 */
export const pluginHelper = (name: string, callback: () => void, fallback?: () => void) => {
  let isAvailable = false;
  try {
    isAvailable = Capacitor.isPluginAvailable(name);
  } catch (err) {
    console.error(err);
    if (fallback) fallback();
    return;
  }

  if (isAvailable) return callback();
  if (fallback) fallback();
};
