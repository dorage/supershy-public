import Layouts from '@/components/layouts';
import Logics from '@/components/logics';
import { getUsersWinKit } from '@/components/queries/users';
import { Link } from '@solidjs/router';
import { Index, Show, type Component } from 'solid-js';

interface PollWinPageProps {}

const PollWinPage: Component<PollWinPageProps> = (props) => {
  const getUsersWinQuery = getUsersWinKit.query({});

  return (
    <div>
      <Layouts.Header title="Dipilih" goBack />
      <Layouts.Body>
        <div class="flex flex-col gap-2">
          <Logics.QuerySwitch
            query={getUsersWinQuery}
            isSuccess={(props) => (
              <Index each={props.query.data}>
                {(data) => (
                  <Link href={`/poll/${data().id}`}>
                    <div class="box text-center p-2">
                      <div>{data().poll.question}</div>
                      {/* lock */}
                      <div class="flex justify-end items-center gap-1 text-sm">
                        <Show
                          when={!data().is_checked}
                          fallback={<span class="text-xs">lihat</span>}
                        >
                          <i class="iconoir-lock-square" />
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

export default PollWinPage;
