import Loading from '@/components/loading';
import Logics from '@/components/logics';
import { getPollsKit } from '@/components/queries/polls';
import { Show, type Component, onMount } from 'solid-js';
import MakeReadyTemplate from './make-ready';
import TodayPollTemplate from './today-poll';

interface PollTemplateProps {}

const PollTemplate: Component<PollTemplateProps> = (props) => {
  const getPollQuery = getPollsKit.query({});

  return (
    <Logics.QuerySwitch
      query={getPollQuery}
      isLoading={<Loading />}
      isError={<Loading />}
      isSuccess={(pollAnswer) => (
        <Show when={pollAnswer.query.data.length > 0} fallback={<MakeReadyTemplate />}>
          <TodayPollTemplate
            pollAnswer={pollAnswer.query.data[0]}
            length={pollAnswer.query.data.length}
          />
        </Show>
      )}
    />
  );
};

export default PollTemplate;
