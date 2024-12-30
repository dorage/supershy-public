import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: '',
  appName: 'super shy',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    SplashScreen: {
      backgroundColor: '#00010a',
      showSpinner: true,
      spinnerColor: '#ffffff',
    },
    CapacitorCookies: {
      enabled: true,
    },
    GoogleAuth: {},
    server: {
      allowNavigation: ['supershy-api.playplease.us', 'localhost:9000'],
    },
  },
};

export default config;
