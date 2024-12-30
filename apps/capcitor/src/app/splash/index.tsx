import LoadingIndicator from '@/components/loading';
import { getPlatform, nativeHelper } from '@/helpers/capacitor';
import AppProviders from '@/providers/app';
import AuthRepository from '@/repositories/auth';
import { App } from '@capacitor/app';
import { onMount, type Component } from 'solid-js';

interface SplashPageProps {}

const SplashPage: Component<SplashPageProps> = (props) => {
  const checkAppHealth = async () => {
    return nativeHelper({
      async native() {
        const { is_enabled } = await AppProviders.getHealthCheck({});
        if (!is_enabled) {
          if (confirm('Maaf. pertahankan sekarang :)')) {
            await App.exitApp();
          }
        }
        return is_enabled;
      },
      web() {
        return true;
      },
    });
  };

  const checkClientVersion = async () => {
    return nativeHelper({
      async native() {
        const appInfo = await App.getInfo();
        const { is_enabled } = await AppProviders.postVersions({
          body: { os: getPlatform() === 'android' ? 'a' : 'i', version: appInfo.version },
        });
        if (!is_enabled) {
          if (confirm('Need Update')) {
            await App.exitApp();
          }
        }
        return is_enabled;
      },
      async web() {
        return true;
      },
    });
  };

  onMount(async () => {
    if (!(await checkAppHealth())) return;
    if (!(await checkClientVersion())) return;
    await AuthRepository.loadSignedUser();
  });

  return (
    <div class="w-screen h-screen flex flex-col gap-10 justify-center items-center">
      <LoadingIndicator />
    </div>
  );
};

export default SplashPage;
