import { App, URLOpenListenerEvent } from '@capacitor/app';
import { nativeHelper } from './capacitor';
import { createEffect, createSignal, on } from 'solid-js';

/**
 * backbutton event
 */
type AppState = 'INIT' | 'LOADING';
const [_appState, _setAppState] = createSignal<AppState>('INIT');

export const getAppState = _appState;
export const setAppState = _setAppState;

createEffect(
  on(_appState, () => {
    switch (_appState()) {
      case 'INIT':
        document.body.style.overflow = 'auto';
        break;
      case 'LOADING':
        document.body.style.overflow = 'hidden';
        break;
    }
  })
);

App.addListener('backButton', () => {
  if (_appState() === 'LOADING') return;
  window.history.back();
});

/**
 * Deeplink 이벤트 등록
 */
export const addAppUrlOpenEventListener = () => {
  App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
    const slug = event.url.split('.us').pop();
    alert(slug);
  });
};

/**
 * App information
 */

const appInfo = await nativeHelper({
  async native() {
    return await App.getInfo();
  },
  web() {
    return null;
  },
});

export const getAppInfo = () => appInfo;
