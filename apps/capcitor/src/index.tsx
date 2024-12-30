import '@/helpers/app';
import '@/helpers/notification';
import '@/helpers/splash';

import { QueryClient, QueryClientProvider } from '@tanstack/solid-query';
import { render } from 'solid-js/web';

import App from '@/app';
import '@/styles/index.css';
import { getPlatform } from './helpers/capacitor';
import { setLogs } from './components/log';
import { Capacitor } from '@capacitor/core';

const root = document.getElementById('root');
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      async onError() {},
    },
    mutations: {
      async onError() {},
    },
  },
});

/**
 * remove console log
 */
if (import.meta.env.MODE === 'development') {
  if (Capacitor.isNativePlatform()) {
    const createLog = (e: any) => {
      if (typeof e === 'string') return e;
      if (typeof e === 'bigint' || typeof e === 'number') return e.toString();
      if (typeof e === 'object') return JSON.stringify(e, null, 2);
      return String(e);
    };
    window.console.log = (...text) => {
      setLogs((prev) => [...prev, text.map(createLog).join(' | ')]);
    };
    window.console.error = (...text) => {
      setLogs((prev) => [...prev, text.map(createLog).join(' | ')]);
    };
  }
} else {
  window.console.log = (...text) => {};
  window.console.error = (...text) => {};
  window.console.debug = (...text) => {};
}

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?'
  );
}

// ios 만 body에 위아래 패딩 추가
if (getPlatform() === 'ios') document.body.classList.add('ios');

render(
  () => (
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  ),
  root!
);
