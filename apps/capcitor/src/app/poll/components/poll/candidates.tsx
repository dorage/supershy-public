import AuthSignal from '@/signals/auth';
import { PollCandidateModel } from '@/types/models';
import { Index, type Component, Accessor, Show, Match, Switch } from 'solid-js';

interface CandidatesProps {
  candidates: PollCandidateModel[];
  winner?: PollCandidateModel;
  onclick?: (
    candidate: Accessor<PollCandidateModel>,
    idx: number,
    e: MouseEvent & {
      currentTarget: HTMLSpanElement;
      target: Element;
    }
  ) => void | Promise<void>;
}

const Candidates: Component<CandidatesProps> = (props) => {
  const isWinner = (candidate: PollCandidateModel, winner?: PollCandidateModel) => {
    if (winner == null) return false;
    return (
      candidate.id === winner.id &&
      candidate.name === winner.name &&
      candidate.gender === winner.gender &&
      candidate.phone === winner.phone
    );
  };

  return (
    <div class="flex flex-col gap-2">
      <Index each={props.candidates}>
        {(candidate, idx) => (
          <Switch>
            {/* Candidate does not exist */}
            <Match when={candidate().id === -1}>
              <span class="btn w-full aspect-square text-lg btn-disabled scale-95 no-animation">
                tidak ada
              </span>
            </Match>
            {/* Candidate exists */}
            <Match when={candidate().id !== -1}>
              <span
                class="btn w-full aspect-square text-lg"
                classList={{
                  // loser css, if winner_id has provided
                  'btn-disabled scale-95 no-animation':
                    props.winner != null && !isWinner(candidate(), props.winner),
                  // winner css, if winner_id has provided
                  'ring-2 ring-white animate-bounce before:content-["👑"] no-animation':
                    props.winner != null && isWinner(candidate(), props.winner),
                }}
                onclick={(e) => props.onclick && props.onclick(candidate, idx, e)}
              >
                <span
                  classList={{
                    hidden: props.winner != null && isWinner(candidate(), props.winner),
                  }}
                >
                  <Show
                    when={candidate().id !== AuthSignal.getSignedAuth().user.id}
                    fallback={<i class="iconoir-people-tag" />}
                  >
                    <Switch>
                      <Match when={candidate().gender === 'm'}>
                        <i class="iconoir-male text-blue-400" />
                      </Match>
                      <Match when={candidate().gender === 'f'}>
                        <i class="iconoir-female text-red-400" />
                      </Match>
                      <Match when={candidate().gender == null}>
                        <i class="iconoir-question-mark text-gray-600" />
                      </Match>
                    </Switch>
                  </Show>
                </span>
                {candidate().name}
              </span>
            </Match>
          </Switch>
        )}
      </Index>
    </div>
  );
};

export default Candidates;
