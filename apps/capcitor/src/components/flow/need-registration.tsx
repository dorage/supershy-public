import routes from '@/constants/url';
import AuthSignal from '@/signals/auth';
import { useNavigate } from '@solidjs/router';
import { JSX, onMount, type Component } from 'solid-js';

interface NeedRegistrationProps {
  children: JSX.Element;
}

/**
 * Component for registration check
 * @param props
 * @returns
 */
const NeedRegistration: Component<NeedRegistrationProps> = (props) => {
  const navigator = useNavigate();

  onMount(() => {
    const user = AuthSignal.getSignedAuth().user;

    // need to register profile info
    if (user.name == null || user.gender == null) return navigator(routes.profile.register);

    // need to register school info
    if (user.school == null) return navigator(routes.school.register);
  });

  return <>{props.children}</>;
};

export default NeedRegistration;
