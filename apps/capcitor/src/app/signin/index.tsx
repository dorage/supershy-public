import Images from '@/assets/images';
import routes from '@/constants/url';
import { getAppState, setAppState } from '@/helpers/app';
import { getPlatform } from '@/helpers/capacitor';
import AuthProvider from '@/providers/auth';
import AuthRepository from '@/repositories/auth';
import { SignInWithApple } from '@capacitor-community/apple-sign-in';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { useNavigate } from '@solidjs/router';
import { Show, type Component, createSignal, Switch, Match } from 'solid-js';
import SignInDev from './dev';
import Password from './components/passwords';

GoogleAuth.initialize({
  clientId: '559776724933-dm1ffdmu3p1p5r2cvoslki4eugb9770o.apps.googleusercontent.com',
  scopes: ['profile', 'email'],
});

interface SignInPageProps {}

export type loginMode = 'INIT' | 'PWD_LOGIN' | 'PWD_REGISTER';

const SignInPage: Component<SignInPageProps> = (props) => {
  const [pwdMode, setPwdMode] = createSignal<loginMode>('INIT');
  const navigator = useNavigate();

  return (
    <div class="flex flex-col px-5 py-20 min-h-screen bg-gradient-to-b from-base-100 to-[#111345]">
      <div class="w-full flex flex-col items-center justify-center">
        <div class="w-[60%] flex flex-col items-center">
          <img src={Images.Logo.symbol_white} class="w-[50%]" />
          <div class="h-6" />
          <img src={Images.Logo.text_white} />
          <div class="h-4" />
        </div>
      </div>
      <div class="flex-1 flex flex-col justify-end items-center">
        <Switch>
          <Match when={pwdMode() === 'PWD_LOGIN'}>
            <Password.Login setPwdMode={setPwdMode} />
          </Match>
          <Match when={pwdMode() === 'PWD_REGISTER'}>
            <Password.Register setPwdMode={setPwdMode} />
          </Match>
          <Match when={pwdMode() === 'INIT'}>
            <SignInDev />
            <Show when={getPlatform() === 'android'}>
              <div
                class="btn-social w-full"
                onclick={async () => {
                  if (getAppState() === 'LOADING') return;
                  setAppState('LOADING');
                  try {
                    const user = await GoogleAuth.signIn();

                    const res = await AuthProvider.postAuthGoogle({
                      body: { code: user.serverAuthCode },
                    });

                    if (!(await AuthRepository.signIn(res))) navigator(routes.signin.index);
                  } catch (err) {
                    console.error('🚀 ~ file: index.tsx:53 ~ err:', err);
                  }
                  setAppState('INIT');
                }}
              >
                <div>
                  <img class="w-5" src={Images.Social.Google} />
                </div>
                <div class="text-black">Sign in with Google</div>
              </div>
            </Show>
            {/* apple sign in is visible only in ios */}
            <Show when={getPlatform() === 'ios'}>
              <div class="btn-social w-full">
                <img class="w-5" src={Images.Social.Apple} />
                <div
                  class="text-black"
                  onclick={async () => {
                    if (getAppState() === 'LOADING') return;
                    setAppState('LOADING');
                    try {
                      const { response } = await SignInWithApple.authorize({
                        clientId: 'playplease.us.supershy',
                        redirectURI: '',
                        scopes: 'email name',
                        state: '12345',
                        nonce: 'nonce',
                      });

                      const res = await AuthProvider.postAuthApple({
                        body: {
                          authorization_code: response.authorizationCode,
                          email: response.email!,
                          user: response.user!,
                          identity_token: response.identityToken!,
                        },
                      });

                      if (!(await AuthRepository.signIn(res))) navigator(routes.signin.index);
                    } catch (err) {
                      console.error('🚀 ~ file: index.tsx:95 ~ onclick={ ~ err:', err);
                    }
                    setAppState('INIT');
                  }}
                >
                  Sign in with Apple
                </div>
              </div>
            </Show>
            <div class="w-full">
              <div class="divider"></div>
            </div>
            <div>
              <span
                class="text-sm"
                onclick={() => {
                  setPwdMode('PWD_LOGIN');
                }}
              >
                sign in with id/password
              </span>
            </div>
          </Match>
        </Switch>
      </div>
    </div>
  );
};

export default SignInPage;
