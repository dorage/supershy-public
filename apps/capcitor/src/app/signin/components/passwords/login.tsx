import routes from '@/constants/url';
import AuthProvider from '@/providers/auth';
import AuthRepository from '@/repositories/auth';
import { useNavigate } from '@solidjs/router';
import { createMutation } from '@tanstack/solid-query';
import { createFormlid } from 'formlid-js';
import { Show, type Component, type Setter } from 'solid-js';
import * as Yup from 'yup';
import { loginMode } from '../..';

interface LoginForm {
  accountId: string;
  password: string;
}

interface LoginProps {
  setPwdMode: Setter<loginMode>;
}

const Login: Component<LoginProps> = (props) => {
  const navigate = useNavigate();
  const mutation = createMutation(AuthProvider.postAuthPassword, {
    async onSuccess(data, variables, context) {
      if (!(await AuthRepository.signIn(data))) navigate(routes.signin.index);
    },
    onError(error, variables, context) {
      // TODO; error alert
    },
  });

  const { field, meta, helpers } = createFormlid<LoginForm>({
    initialValues: { accountId: '', password: '' },
    validationSchema: {
      accountId: Yup.string().min(2).max(30).required(),
      password: Yup.string().min(8).max(20).required(),
    },
    onsubmit(data) {
      mutation.mutateAsync({ body: { account_id: data.accountId, password: data.password } });
    },
    validateOnSubmitOnly: true,
  });

  return (
    <div class="w-full flex flex-col">
      <div class="flex items-center gap-5 font-bold text-white text-2xl mb-12">
        <div
          class="w-8 aspect-square flex justify-center items-center "
          onclick={() => {
            props.setPwdMode(() => 'INIT');
          }}
        >
          <i class="bi bi-arrow-left-short"></i>
        </div>
        Log in
      </div>
      <div class="mb-12 flex flex-col gap-5">
        <label class="form-control w-full">
          <div class="label">
            <span class="label-text">Account Id</span>
          </div>
          <input type="text" class="input input-bordered w-full" {...field('accountId')} />
          <Show when={meta('accountId').error}>
            <span class="label-text text-xs text-red-600 pl-2">{meta('accountId').error}</span>
          </Show>
        </label>
        <label class="form-control w-full">
          <div class="label">
            <span class="label-text">Password</span>
          </div>
          <input type="text" class="input input-bordered w-full" {...field('password')} />
          <Show when={meta('password').error}>
            <span class="label-text text-xs text-red-600 pl-2">{meta('password').error}</span>
          </Show>
        </label>
      </div>
      <div class="flex gap-2">
        <div
          class="btn flex-1"
          onclick={() => {
            props.setPwdMode('PWD_REGISTER');
          }}
        >
          <div class="text-white">Daftar</div>
        </div>
        <div
          class="btn-social flex-1"
          onclick={() => {
            helpers.emitSubmit();
          }}
        >
          <div class="text-black">Login</div>
        </div>
      </div>
    </div>
  );
};

export default Login;
