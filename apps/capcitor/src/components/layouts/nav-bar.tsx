import routes from '@/constants/url';
import NotificationProvider from '@/providers/notifications';
import { Link, useLocation } from '@solidjs/router';
import { createQuery } from '@tanstack/solid-query';
import { type Component } from 'solid-js';
import Logics from '../logics';

interface NavBarProps {}

const NavBar: Component<NavBarProps> = (props) => {
  // const unreadNotificationQuery = createQuery(
  //   () => ['notifications', 'unread'],
  //   NotificationProvider.getNotificationUnread,
  //   { refetchInterval: 60 * 1000 }
  // );
  const location = useLocation();

  return (
    <div id="navbar" class="btm-nav">
      <button
        class="text-deactive"
        classList={{ 'active text-active': location.pathname === routes.poll.index }}
      >
        <Link href={routes.poll.index}>
          <i class="iconoir-fire-flame text-xl" />
        </Link>
      </button>
      <button
        class="text-deactive"
        classList={{ 'active text-active': location.pathname === routes.community.index }}
      >
        <Link href={routes.community.index}>
          <i class="iconoir-community text-xl" />
        </Link>
      </button>
      <button
        class="text-deactive"
        classList={{ 'active text-active': location.pathname === routes.shop }}
      >
        <Link href={routes.shop}>
          <i class="iconoir-shop text-xl" />
        </Link>
      </button>
      {/* <button
        class="text-deactive"
        classList={{ 'active text-active': location.pathname === routes.notification }}
      >
        <Link href={routes.notification}>
          <div class="indicator">
            <Logics.QuerySwitch
              query={unreadNotificationQuery}
              isSuccess={
                <span
                  class="indicator-item indicator-left w-2 h-2 rounded-full bg-secondary translate-x-2"
                  classList={{ hidden: !unreadNotificationQuery.data!.data }}
                ></span>
              }
            />
            <span class="indicator-item indicator-left badge badge-xs badge-secondary"></span>

            <i class="bi bi-bell"></i>
          </div>
        </Link>
      </button> */}
      <button
        class="text-deactive"
        classList={{ 'active text-active': location.pathname === routes.profile.index }}
      >
        <Link href={routes.profile.index}>
          <i class="iconoir-people-tag text-xl" />
        </Link>
      </button>
    </div>
  );
};

export default NavBar;
