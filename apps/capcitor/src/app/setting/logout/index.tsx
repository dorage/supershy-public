import routes from '@/constants/url';
import AuthRepository from '@/repositories/auth';
import { useNavigate } from '@solidjs/router';
import { onMount, type Component } from 'solid-js';

interface SettingLogoutPageProps {}

const SettingLogoutPage: Component<SettingLogoutPageProps> = (props) => {
  const navigate = useNavigate();
  onMount(async () => {
    await AuthRepository.signOut();
    navigate(routes.signin.index);
  });

  return <div></div>;
};

export default SettingLogoutPage;
