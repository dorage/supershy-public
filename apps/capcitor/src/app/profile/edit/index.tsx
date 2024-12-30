import PhoneForm from '@/app/phone/components/phone-form';
import Layouts from '@/components/layouts';
import Locale from '@/constants/locale';
import routes from '@/constants/url';
import UsersProvider from '@/providers/users';
import AuthRepository from '@/repositories/auth';
import AuthSignal from '@/signals/auth';
import { EUserGender } from '@/types/enum';
import { useNavigate } from '@solidjs/router';
import { createMutation } from '@tanstack/solid-query';
import { createFormlid } from 'formlid-js';
import { Show, onMount, type Component } from 'solid-js';
import * as Yup from 'yup';

interface ProfileEditPageProps {}

interface ProfileEditForm {
  name: string;
  gender: string;
  phone: boolean;
}

const ProfileEditPage: Component<ProfileEditPageProps> = (props) => {
  const navigator = useNavigate();
  const putUserMutate = createMutation(UsersProvider.putUsers, { async onSuccess() {} });

  const { field, meta, helpers, form } = createFormlid<ProfileEditForm>({
    initialValues: {
      name: AuthSignal.getSignedAuth().user.name ?? '',
      gender: AuthSignal.getSignedAuth().user.gender ?? '',
      phone: false,
    },
    validationSchema: {
      name: Yup.string()
        .required(Locale.profileEdit.form.name.error.required)
        .min(2, Locale.profileEdit.form.name.error.min)
        .max(30, Locale.profileEdit.form.name.error.max),
      gender: Yup.string()
        .required(Locale.profileEdit.form.gender.error.required)
        .matches(/(m|f)/g),
      phone: Yup.boolean().isTrue(),
    },
    onsubmit: async (value) => {
      await putUserMutate.mutateAsync({
        body: {
          name: value.name,
          gender: value.gender as EUserGender,
        },
      });
      await AuthRepository.loadSignedUser();
      navigator(routes.checkRegistration);
    },
  });

  onMount(() => {
    const user = AuthSignal.getSignedAuth().user;
    if (user.name == null || user.gender == null) return;
    navigator(routes.checkRegistration);
  });

  return (
    <div>
      <Layouts.Header title={Locale.profileEdit.header} />
      <Layouts.Body class="flex flex-col gap-2">
        <div class="flex flex-col gap-1 justify-center text-sm font-extraligh">
          <label class="text-center">{Locale.profileEdit.desc1}</label>
          <label class="text-center text-white">{Locale.profileEdit.desc2}</label>
        </div>
        {/* FirstName */}
        <div class="form-control w-full mb-2">
          <label class="label">
            <span class="label-text font-semibold">{Locale.profileEdit.form.name.label}</span>
          </label>
          <input
            type="text"
            placeholder="Type here"
            class="input input-bordered w-full"
            {...field('name')}
            maxLength={20}
          />
          <Show when={meta('name').error}>
            <span class="label-text text-xs text-red-600 pl-2">{meta('name').error}</span>
          </Show>
        </div>
        {/* Gender */}
        <div class="form-control w-full">
          <label class="label">
            <span class="label-text font-semibold">{Locale.profileEdit.form.gender.label}</span>
          </label>
          <div class="flex gap-10">
            <div class="form-control flex-1">
              <label class="label cursor-pointer">
                <span class="label-text">pria</span>
                <input
                  type="radio"
                  class="radio checked:bg-blue-500"
                  {...field('gender')}
                  value="m"
                  checked={field('gender').value === 'm'}
                />
              </label>
            </div>
            <div class="form-control flex-1">
              <label class="label cursor-pointer">
                <span class="label-text">wanita</span>
                <input
                  type="radio"
                  class="radio checked:bg-red-500"
                  {...field('gender')}
                  value="f"
                  checked={field('gender').value === 'f'}
                />
              </label>
            </div>
          </div>
          <Show when={meta('gender').error}>
            <span class="label-text text-xs text-red-600 pl-2">{meta('gender').error}</span>
          </Show>
        </div>
        <PhoneForm
          onSuccess={() => {
            field('phone').setValue(true);
          }}
        />
      </Layouts.Body>
      {/* Submit */}
      <div class="fixed bottom-0 left-0 right-0 px-2 h-20 flex items-center gap-2 z-10">
        <span
          class="btn w-full flex-1 bg-secondary text-white"
          classList={{
            'btn-disabled':
              !meta('name').isValidated ||
              !meta('gender').isValidated ||
              !meta('phone').isValidated,
          }}
          onclick={helpers.emitSubmit}
        >
          Save
        </span>
      </div>
    </div>
  );
};

export default ProfileEditPage;
