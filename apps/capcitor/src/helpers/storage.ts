import { Preferences } from '@capacitor/preferences';
import { nativeHelper } from './capacitor';

const setItem = async (key: string, value: string) => {
  return nativeHelper({
    web: () => localStorage.setItem(key, value),
    native: () => Preferences.set({ key, value }),
  });
};

const getItem = async (key: string): Promise<string | null> => {
  const v = await nativeHelper({
    web: () => localStorage.getItem(key),
    native: () => Preferences.get({ key }),
  });

  if (v == null) return null;
  if (typeof v === 'string') return v;
  if (v.value == null) return null;
  return v.value;
};

const remove = async (key: string) => {
  await nativeHelper({
    web: () => localStorage.removeItem(key),
    native: () => Preferences.remove({ key }),
  });
};

const clear = async () => {
  await nativeHelper({
    web: () => localStorage.clear(),
    native: () => Preferences.clear(),
  });
};

const Storage = { getItem, setItem, remove, clear };

export default Storage;
