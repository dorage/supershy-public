import Resources from '@/assets/images/resources';
import Layouts from '@/components/layouts';
import routes from '@/constants/url';
import ContactsHelper from '@/helpers/contacts';
import { Link } from '@solidjs/router';
import { type Component } from 'solid-js';

interface SettingPageProps {}

const SettingPage: Component<SettingPageProps> = (props) => {
  return (
    <div class="flex flex-col min-h-screen pb-5">
      <Layouts.Header title="Pengaturan" goBack />
      <Layouts.Body class="flex-1 min-h-full flex flex-col justify-end">
        <div class="flex-1 flex items-center justify-center">
          <img src={Resources.instargram} />
        </div>

        {/* <div class="flex items-center justify-between">
          <div>Push notification</div>
          <input type="checkbox" class="toggle" checked />
        </div>
        <div class="divider" />
        <div class="flex items-center justify-between">
          <div>Instagram</div>
        </div>
        <div class="divider" /> */}
        <div class="flex items-center justify-between">
          <Link href={routes.setting.logout}>
            <div>Logout</div>
          </Link>
        </div>
      </Layouts.Body>
    </div>
  );
};

export default SettingPage;
