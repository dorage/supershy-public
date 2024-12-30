import { getPollsKit } from '@/components/queries/polls';
import Locale from '@/constants/locale';
import _ from '@/helpers/fp';
import PollsProvider from '@/providers/polls';
import { PollAnswerModel, PollCandidateModel } from '@/types/models';
import { createMutation, useQueryClient } from '@tanstack/solid-query';
import { createSignal, type Component } from 'solid-js';
import CandidatePool from '../components/candidate-pool';
import Poll from '../components/poll';

interface TodayPollTemplateProps {
  pollAnswer: PollAnswerModel;
  length: number;
}

const TodayPollTemplate: Component<TodayPollTemplateProps> = (props) => {
  const [winner, setWinner] = createSignal<PollCandidateModel | undefined>();
  const queryClient = useQueryClient();

  const voteMutate = createMutation(PollsProvider.putPollsPollAnswerId);
  const skipMutate = createMutation(PollsProvider.deletePollsPollAnswerId);

  return (
    <>
      <div class="h-screen bg-poll pb-nav-bar flex flex-col justify-end px-5 pt-5">
        {/* Indicator */}
        <span class="text-center pb-5">
          {Locale.poll.left} {props.length}
        </span>
        <Poll.Question poll={props.pollAnswer.poll} />
        <CandidatePool pollAnswer={props.pollAnswer}>
          {({ candidates, lastCandidates, refresh, reset }) => (
            <>
              <Poll.Candidates
                candidates={candidates()}
                winner={winner()}
                onclick={async (candidate, idx, e) => {
                  try {
                    if (winner() != null) return;
                    setWinner(candidate());
                    await _.sleep(1500);
                    await voteMutate.mutateAsync({
                      params: { poll_answer_id: props.pollAnswer.id },
                      body: { winner: candidate(), candidates: candidates() },
                    });
                    queryClient.setQueryData(getPollsKit.queryKey({}), (prev: any) => [
                      ...prev.slice(1),
                    ]);
                    setWinner(undefined);
                    await reset();
                  } catch (err) {
                    console.error('error');
                  }
                }}
              />
              <div class="divider"></div>
              {/* Actions */}
              <div class="flex justify-between pb-5">
                {/* Refresh */}
                <span
                  class="btn btn-ghost"
                  classList={{
                    'btn-disabled bg-transparent': lastCandidates().length >= 12,
                  }}
                  onclick={async () => {
                    try {
                      if (winner() != null) return;
                      refresh();
                    } catch (err) {
                      console.error('🚀 ~ file: today-poll.tsx:71 ~ onclick={ ~ err:', err);
                      alert('error');
                    }
                  }}
                >
                  <i class="bi bi-shuffle"></i>
                  {Locale.poll.shuffle} {3 - lastCandidates().length / 4}/2
                </span>
                {/* Skip */}
                <span
                  class="btn btn-ghost"
                  onclick={async () => {
                    try {
                      if (winner() != null) return;
                      // delete current pa
                      await skipMutate.mutateAsync({
                        params: { poll_answer_id: props.pollAnswer.id },
                      });
                      // refetch polls
                      queryClient.setQueryData(getPollsKit.queryKey({}), (prev: any) => [
                        ...prev.slice(1),
                      ]);
                      await reset();
                    } catch (err) {
                      console.error('🚀 ~ file: today-poll.tsx:91 ~ onclick={ ~ err:', err);
                      alert('error');
                    }
                  }}
                >
                  <i class="bi bi-fast-forward-fill"></i>
                  {Locale.poll.skip}
                </span>
              </div>
            </>
          )}
        </CandidatePool>
      </div>
    </>
  );
};

export default TodayPollTemplate;
