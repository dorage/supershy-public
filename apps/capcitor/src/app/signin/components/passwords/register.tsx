import AuthProvider from '@/providers/auth';
import { createMutation } from '@tanstack/solid-query';
import { createFormlid } from 'formlid-js';
import { Show, type Component, type Setter } from 'solid-js';
import * as Yup from 'yup';
import { loginMode } from '../..';

interface LoginForm {
  accountId: string;
  password: string;
  verifiedPassword: string;
}

interface RegisterProps {
  setPwdMode: Setter<loginMode>;
}

const Register: Component<RegisterProps> = (props) => {
  const postAuthIdMutation = createMutation(AuthProvider.postAuthId);
  const putAuthPasswordMutation = createMutation(AuthProvider.putAuthPassword, {
    onSuccess(data, variables, context) {
      props.setPwdMode(() => 'PWD_LOGIN');
    },
    onError(error, variables, context) {
      // TODO; error alert
    },
  });

  const { field, meta, helpers } = createFormlid<LoginForm>({
    initialValues: { accountId: '', password: '', verifiedPassword: '' },
    validationSchema: {
      accountId: Yup.string().min(2).max(30).required(),
      password: Yup.string().min(8).max(20).required(),
      verifiedPassword: Yup.string().min(8).max(20).required(),
    },
    validateOnSubmitOnly: true,
    async onsubmit(data) {
      // duplicated check
      try {
        await postAuthIdMutation.mutateAsync({ body: { account_id: data.accountId } });
      } catch (err) {
        helpers.setError('accountId')('It is taken already');
        // TODO; error alert
        return;
      }
      // password check
      if (data.password !== data.verifiedPassword) {
        helpers.setError('verifiedPassword')('Password is not matched');
        return;
      }
      putAuthPasswordMutation.mutateAsync({
        body: { account_id: data.accountId, password: data.verifiedPassword },
      });
    },
  });

  return (
    <div class="w-full flex flex-col">
      <div class="flex items-center gap-5 font-bold text-white text-2xl mb-12">
        <div
          class="w-8 aspect-square flex justify-center items-center "
          onclick={() => {
            props.setPwdMode(() => 'PWD_LOGIN');
          }}
        >
          <i class="bi bi-arrow-left-short"></i>
        </div>
        Daftar
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
        <label class="form-control w-full">
          <div class="label">
            <span class="label-text">Cek password</span>
          </div>
          <input type="text" class="input input-bordered w-full" {...field('verifiedPassword')} />
          <Show when={meta('verifiedPassword').error}>
            <span class="label-text text-xs text-red-600 pl-2">
              {meta('verifiedPassword').error}
            </span>
          </Show>
        </label>
      </div>
      <div>
        <div
          class="btn-social w-full"
          onclick={() => {
            helpers.emitSubmit();
          }}
        >
          <div class="text-black">Daftar</div>
        </div>
      </div>
    </div>
  );
};

export default Register;
