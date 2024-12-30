import Layouts from '@/components/layouts';
import Locale from '@/constants/locale';
import routes from '@/constants/url';
import AuthSignal from '@/signals/auth';
import { useNavigate } from '@solidjs/router';
import { createSignal, onMount, type Component } from 'solid-js';
import PhoneForm from './components/phone-form';

interface PhoneEditPageProps {}

interface phoneEditForm {
  phone: string;
  otp: string;
}

const PhoneEditPage: Component<PhoneEditPageProps> = (props) => {
  const navigator = useNavigate();

  onMount(() => {
    const user = AuthSignal.getSignedAuth().user;
    if (user.phone == null) return;
    navigator(routes.checkRegistration);
  });

  const [verified, setVerified] = createSignal<boolean>(false);

  return (
    <div>
      <Layouts.Header title={Locale.phoneEdit.header} />
      <Layouts.Body class="flex flex-col gap-1">
        {/* phone */}
        <PhoneForm
          onSuccess={() => {
            setVerified(true);
          }}
        />
      </Layouts.Body>
      {/* Submit */}
      <div class="fixed bottom-0 left-0 right-0 px-2 h-20 flex items-center gap-2 z-10">
        <span
          class="btn w-full flex-1 bg-secondary text-white"
          classList={{ 'btn-disabled': !verified() }}
          onclick={() => {
            navigator(routes.checkRegistration);
          }}
        >
          Save
        </span>
      </div>
    </div>
  );
};

export default PhoneEditPage;
