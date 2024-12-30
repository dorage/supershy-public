import routes from '@/constants/url';
import AuthSignal from '@/signals/auth';
import { useNavigate } from '@solidjs/router';
import { createEffect, type Component, type JSX } from 'solid-js';

interface PendingOpenSchooolProps {
  children: JSX.Element;
}

const PendingOpenSchoool: Component<PendingOpenSchooolProps> = (props) => {
  const navigator = useNavigate();

  createEffect(() => {
    const user = AuthSignal.getSignedAuth().user;
    if (user == null) return;
    if (user.school == null) return;

    navigator(routes.school.pending);
  });

  return <>{props.children}</>;
};

export default PendingOpenSchoool;
