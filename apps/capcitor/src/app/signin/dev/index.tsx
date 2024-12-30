import routes from '@/constants/url';
import AuthProvider from '@/providers/auth';
import AuthRepository from '@/repositories/auth';
import { useNavigate } from '@solidjs/router';
import { Show, type Component } from 'solid-js';

interface SignInDevProps {}

const SignInDev: Component<SignInDevProps> = (props) => {
  const navigator = useNavigate();

  const signIn = (email: string) => async () => {
    const result = await AuthProvider.postAuthDev({ body: { email } });
    console.log('🚀 ~ file: index.tsx:14 ~ signIn ~ result:', result);

    if (!AuthRepository.signIn(result)) navigator(routes.signin.index);
  };

  return (
    <Show when={import.meta.env.MODE === 'development'}>
      <span class="btn" onclick={signIn('tester1@playplease.us')}>
        sign in tester 1
      </span>
      <span class="btn" onclick={signIn('tester2@playplease.us')}>
        sign in tester 2
      </span>
      <span class="divider"></span>
    </Show>
  );
};

export default SignInDev;
