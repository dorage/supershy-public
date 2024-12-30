import Layouts from '@/components/layouts';
import Logics from '@/components/logics';
import { getUsersVoteKit } from '@/components/queries/users';
import { Link } from '@solidjs/router';
import { Index, Show, type Component } from 'solid-js';

interface PollVotePageProps {}

const PollVotePage: Component<PollVotePageProps> = (props) => {
  const getUsersVoteQuery = getUsersVoteKit.query({});

  return (
    <div>
      <Layouts.Header title="Memilih" goBack />
      <Layouts.Body>
        <div class="flex flex-col gap-2">
          <Logics.QuerySwitch
            query={getUsersVoteQuery}
            isSuccess={(props) => (
              <Index each={props.query.data}>
                {(data) => (
                  <Link href={`/poll/${data().id}`}>
                    <div class="box text-center p-2">
                      <div>{data().poll.question}</div>
                      {/* lock */}
                      <div class="flex justify-end items-center gap-1 text-sm">
                        <Show when={!data().is_checked} fallback={<i class="iconoir-eye" />}>
                          <i class="iconoir-eye-closed" />
                        </Show>
                      </div>
                    </div>
                  </Link>
                )}
              </Index>
            )}
          />
        </div>
      </Layouts.Body>
    </div>
  );
};

export default PollVotePage;
