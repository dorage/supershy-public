import Coin from '@/components/coin';
import Payable from '@/components/logics/payable';
import { getPollsDeatilKit } from '@/components/queries/polls';
import PremiumProvider from '@/providers/premiums';
import AuthRepository from '@/repositories/auth';
import { PollVoterModel } from '@/types/models';
import { createMutation } from '@tanstack/solid-query';
import { Match, Show, Switch, type Component } from 'solid-js';

interface VoterProps {
  pollAnswerId: string;
  voter?: null | PollVoterModel;
}

const Voter: Component<VoterProps> = (props) => {
  const query = getPollsDeatilKit.query({ params: { poll_answer_id: props.pollAnswerId } });
  const voterMutation = createMutation(PremiumProvider.putPremiumsOpen, {
    onSuccess(result) {
      query.refetch();
      AuthRepository.loadSignedUser();
    },
  });

  return (
    <div class="h-20 flex flex-col justify-center items-center gap-2">
      <Show
        when={props.voter != null}
        fallback={
          <>
            <div class="text-white">Kamu dipilih!</div>
            <Payable
              class="w-full"
              price={100}
              onclick={() => voterMutation.mutate({ body: { poll_answer_id: props.pollAnswerId } })}
            >
              <span class="w-full btn btn-lg">
                <div class="flex flex-col justify-center items-center gap-2">
                  <span>Litha siapa memilih kamu</span>
                  <span class="flex justify-center items-center gap-1">
                    <Coin class="w-5 h-5 aspect-square" />
                    <span class="text-sm">100</span>
                  </span>
                </div>
              </span>
            </Payable>
          </>
        }
      >
        <div>Dia memilih kamu!</div>
        <div class="flex gap-2 text-white font-bold text-xl">
          <Switch>
            <Match when={props.voter?.gender === 'm'}>
              <span class="text-blue-600">♂️</span>
            </Match>
            <Match when={props.voter?.gender === 'f'}>
              <span class="text-red-600">♀️</span>
            </Match>
          </Switch>
          <span id="voter_name">{props.voter?.name}</span>
        </div>
      </Show>
    </div>
  );
};

export default Voter;
