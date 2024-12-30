import { nativeHelper } from './capacitor';

await nativeHelper({
  async native() {
    // hide splash as soon as possible
    // await SplashScreen.hide();
  },
  async web() {},
});
