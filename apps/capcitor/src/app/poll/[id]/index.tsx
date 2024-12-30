import Layouts from '@/components/layouts';
import Loading from '@/components/loading';
import Logics from '@/components/logics';
import { getPollsDeatilKit } from '@/components/queries/polls';
import AuthSignal from '@/signals/auth';
import { useNavigate, useParams } from '@solidjs/router';
import { Show, type Component } from 'solid-js';
import Poll from '../components/poll';

interface PollDetailPageProps {}

const PollDetailPage: Component<PollDetailPageProps> = (props) => {
  const navigator = useNavigate();
  const poll_answer_id = () => useParams().id;
  const pollDetailQuery = getPollsDeatilKit.query({ params: { poll_answer_id: poll_answer_id() } });

  return (
    <Layouts.Screen>
      <Layouts.Body class="bg-poll w-full h-full flex flex-col justify-end pb-20">
        <div
          class="w-8 h-8 aspect-square flex justify-center items-center text-2xl"
          onclick={() => {
            navigator(-1);
          }}
        >
          <i class="bi bi-arrow-left-short"></i>
        </div>
        <Logics.QuerySwitch
          query={pollDetailQuery}
          isLoading={<Loading />}
          isError={<Loading />}
          isSuccess={(pollProps) => (
            <>
              <Poll.Question poll={pollProps.query.data.poll} />
              <Poll.Candidates
                candidates={pollProps.query.data.candidates}
                winner={pollProps.query.data.winner}
              />
              <Show when={pollProps.query.data.winner.id === AuthSignal.getSignedAuth().user.id}>
                <span class="divider" />
                <Poll.Voter
                  pollAnswerId={pollProps.query.data.id}
                  voter={pollProps.query.data.voter}
                />
              </Show>
            </>
          )}
        />
      </Layouts.Body>
    </Layouts.Screen>
  );
};

export default PollDetailPage;
