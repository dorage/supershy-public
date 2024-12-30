import Locale from '@/constants/locale';
import UsersProvider from '@/providers/users';
import AuthSignal from '@/signals/auth';
import { createMutation } from '@tanstack/solid-query';
import { createFormlid } from 'formlid-js';
import { Show, createEffect, createSignal, on, type Component } from 'solid-js';
import * as Yup from 'yup';

interface PhoneFormProps {
  onSuccess: () => void;
}

interface phoneEditForm {
  phone: string;
  otp: string;
}

const PhoneForm: Component<PhoneFormProps> = (props) => {
  const putPhoneVerifyMutate = createMutation(UsersProvider.putUsersPhoneVerify);
  const postPhoneVerifyMutate = createMutation(UsersProvider.postUsersPhoneVerify);

  const { field, meta } = createFormlid<phoneEditForm>({
    initialValues: {
      phone: AuthSignal.getSignedAuth().user.phone ?? '',
      otp: '',
    },
    validationSchema: {
      name: Yup.string().required(Locale.phoneEdit.form.phone.error.required).max(12),
      otp: Yup.string().required().length(6),
    },
    onsubmit: async (value) => {},
  });

  const [timer, setTimer] = createSignal<number>(300);
  const [submit, setSubmit] = createSignal<boolean>(false);
  const [verified, setVerified] = createSignal<boolean>(false);

  createEffect(
    on(submit, () => {
      if (!submit()) return;

      const timedOut = () => {
        if (timer() === 0) {
          setTimer(300);
          setSubmit(false);
          return;
        }
        setTimer((prev) => prev - 1);
        setTimeout(timedOut, 1000);
      };

      setTimeout(timedOut, 1000);
    })
  );

  const refinePhone = (phone: string) => {
    const nums = phone.match(/[0-9]/g);
    if (nums == null) return '';
    if (nums.length === 11) return `0${nums.join('')}`;
    if (nums.length === 12) return nums.join('');
    return nums.join('');
  };

  const refineOTP = (otp: string) => {
    const nums = otp.match(/[0-9]/g);
    if (nums == null) return '';
    return nums.join('');
  };

  return (
    <>
      <div class="form-control w-full mb-2">
        <label class="label">
          <span class="label-text font-semibold">{Locale.phoneEdit.form.phone.label}</span>
        </label>
        <div class="flex gap-2">
          <input
            type="text"
            placeholder="0862-XXXX-XXXX"
            class="input input-bordered w-full"
            {...field('phone')}
            maxLength={14}
            readOnly={submit() || verified()}
          />
          <span
            class="btn btn-secondary w-20"
            classList={{ 'btn-disabled': submit() }}
            onclick={async () => {
              if (submit()) return;
              // 전화번호 길이 검사
              const phone = refinePhone(field('phone').value);
              if (phone.length !== 12) return meta('phone').setError('Nomor ponsel tidak valid');
              try {
                await postPhoneVerifyMutate.mutateAsync({
                  body: {
                    phone,
                  },
                });
                setSubmit(true);
              } catch (err) {
                return meta('phone').setError('Nomor ponsel tidak valid');
              }
            }}
          >
            <Show when={submit()} fallback={<>Kirim</>}>
              <>{timer()}s</>
            </Show>
          </span>
        </div>
        <Show when={meta('phone').error}>
          <span class="label-text text-xs text-red-600 pl-2">{meta('phone').error}</span>
        </Show>
      </div>
      <Show when={submit()}>
        {/* OTP */}
        <div class="form-control w-full mb-2">
          <label class="label">
            <span class="label-text font-semibold">{Locale.phoneEdit.form.otp.label}</span>
          </label>
          <div class="flex gap-2">
            <input
              type="text"
              placeholder=""
              class="input input-bordered w-full"
              {...field('otp')}
              maxLength={6}
              readOnly={verified()}
            />
            <span
              class="btn btn-secondary w-20"
              classList={{ 'btn-disabled': verified() }}
              onclick={async () => {
                if (!submit()) return;
                const otp = refineOTP(field('otp').value);
                if (otp.length !== 6) return meta('otp').setError('OTP tidak valid');
                try {
                  await putPhoneVerifyMutate.mutateAsync({
                    body: {
                      otp,
                    },
                  });
                  setVerified(true);
                  props.onSuccess();
                } catch (err) {
                  return meta('otp').setError('OTP tidak valid');
                }
              }}
            >
              Verifikasi
            </span>
          </div>
          <Show when={meta('otp').error}>
            <span class="label-text text-xs text-red-600 pl-2">{meta('otp').error}</span>
          </Show>
        </div>
      </Show>
    </>
  );
};

export default PhoneForm;
