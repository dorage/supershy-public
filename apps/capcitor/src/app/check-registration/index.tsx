import Images from '@/assets/images';
import routes from '@/constants/url';
import { getPlatform } from '@/helpers/capacitor';
import IAPHelper from '@/helpers/iap';
import NotifiationHelper from '@/helpers/notification';
import AuthRepository from '@/repositories/auth';
import AuthSignal from '@/signals/auth';
import { useNavigate } from '@solidjs/router';
import { JSX, Match, Switch, createSignal, onMount, type Component } from 'solid-js';

interface CheckRegistrationPageProps {
  // children: JSX.Element;
}

const CheckRegistrationPage: Component<CheckRegistrationPageProps> = (props) => {
  const [loading, setLoading] = createSignal(true);
  const navigator = useNavigate();

  const needRegistration = async () => {
    const user = AuthSignal.getSignedAuth().user;

    // need to register profile info
    if (user.name == null || user.gender == null) {
      navigator(routes.profile.register);
      return true;
    }

    // need to register school info
    if (user.school_group_id == null) {
      navigator(routes.school.register);
      return true;
    }

    if (user.grade == null) {
      navigator(routes.school.grade.register);
      return true;
    }

    if (user.phone == null) {
      navigator(routes.phone.edit);
      return true;
    }

    return false;
  };

  onMount(async () => {
    if (getPlatform() !== 'web') {
      try {
        // Initialize RevenueCat
        await IAPHelper.initialize();
      } catch (err) {
        console.error(err);
      }
      try {
        // Initialize OneSignal
        NotifiationHelper.initialize();
      } catch (err) {
        console.error(err);
      }
    }
    // load user-info again
    await AuthRepository.loadSignedUser();
    // 회원가입여부 체크
    if (await needRegistration()) return;

    console.log('here');
    navigator(routes.poll.index);
    // 로딩 끝
    // setLoading(false);
  });

  return (
    <div class="w-screen h-screen flex flex-col gap-10 justify-center items-center">
      <Switch>
        <Match when={loading()}>
          <img src={Images.Logo.symbol_white} class="w-[30%] animate-bounce" />
          <img src={Images.Logo.text_white} class="w-[50%]" />
        </Match>
        {/* <Match when={!loading()}>{props.children}</Match> */}
      </Switch>
    </div>
  );
};

export default CheckRegistrationPage;
