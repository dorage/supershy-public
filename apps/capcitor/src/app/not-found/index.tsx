import routes from '@/constants/url';
import { Link } from '@solidjs/router';
import type { Component } from 'solid-js';

interface NotFoundPageProps {}

const NotFoundPage: Component<NotFoundPageProps> = (props) => {
  return (
    <div>
      <div>Not Found</div>
      <Link href={routes.poll.index} replace>
        <div>Go Back To Home</div>
      </Link>
    </div>
  );
};

export default NotFoundPage;
