import Layouts from '@/components/layouts';
import { type Component } from 'solid-js';
import PollTemplate from './templates/poll';

interface PollPageProps {}

const PollPage: Component<PollPageProps> = (props) => {
  return (
    <Layouts.Screen>
      <PollTemplate />
      <Layouts.NavBar />
    </Layouts.Screen>
  );
};

export default PollPage;
