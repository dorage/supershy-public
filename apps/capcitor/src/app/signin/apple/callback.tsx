import Images from '@/assets/images';
import routes from '@/constants/url';
import AuthProvider from '@/providers/auth';
import AuthRepository from '@/repositories/auth';
import { useLocation, useNavigate } from '@solidjs/router';
import { onMount, type Component, createEffect } from 'solid-js';

interface SignInAppleCallbackPageProps {}

const SignInAppleCallbackPage: Component<SignInAppleCallbackPageProps> = (props) => {
  const location = useLocation();
  const navigator = useNavigate();

  const signIn = async (authorization_code: string, user: string) => {
    // const result = await AuthProvider.postAuthApple({
    //   // body: { authorization_code, user },
    // });
    // console.log('result', result);
    // if (!(await AuthRepository.signIn(result))) navigator(routes.signin.index);
  };

  onMount(async () => {
    const query = location.query;

    if (query['authorization_code'] == null) {
      navigator(routes.signin.index);
    }

    await signIn(query['authorization_code'], query['user']);
  });

  return (
    <div class="w-screen h-screen flex flex-col gap-10 justify-center items-center">
      {/* <img src={Images.Resources.loading_white} class="w-[30%] animate-spin" /> */}
      <img src={Images.Logo.symbol_white} class="w-[30%] animate-bounce" />
      <img src={Images.Logo.text_white} class="w-[50%]" />
    </div>
  );
};

export default SignInAppleCallbackPage;
