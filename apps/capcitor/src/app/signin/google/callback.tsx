import Images from '@/assets/images';
import routes from '@/constants/url';
import AuthProvider from '@/providers/auth';
import AuthRepository from '@/repositories/auth';
import { useLocation, useNavigate } from '@solidjs/router';
import { onMount, type Component } from 'solid-js';

interface SignInGoogleCallbackPageProps {}

const SignInGoogleCallbackPage: Component<SignInGoogleCallbackPageProps> = (props) => {
  const location = useLocation();
  const navigator = useNavigate();

  /**
   * get access token from hash in url
   * @param hash
   * @returns
   */
  const getAccessTokenFromHash = (hash: string) => {
    const [_, value] = hash
      .split('&')
      .filter((param) => param.includes('token'))
      .shift()
      ?.split('=') as [string, string];
    return value;
  };

  /**
   * Google access token을 이용해 로그인합니다
   * @param accessToken
   */
  const signIn = async (accessToken: string) => {
    // const result = await AuthProvider.postAuthGoogle({ body: { access_token: accessToken } });
    // if (!(await AuthRepository.signIn(result))) navigator(routes.signin.index);
  };

  onMount(async () => {
    const hash = location.hash;

    if (hash.includes('error')) {
      navigator(routes.signin.index);
    }

    const accessToken = getAccessTokenFromHash(hash);
    await signIn(accessToken);
  });

  return (
    <div class="w-screen h-screen flex flex-col gap-10 justify-center items-center">
      {/* <img src={Images.Resources.loading_white} class="w-[30%] animate-spin" /> */}
      <img src={Images.Logo.symbol_white} class="w-[30%] animate-bounce" />
      <img src={Images.Logo.text_white} class="w-[50%]" />
    </div>
  );
};

export default SignInGoogleCallbackPage;
