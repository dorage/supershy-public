import Layouts from '@/components/layouts';
import Logics from '@/components/logics';
import { premiumPreviewSignal } from '@/components/modal/components/premium-poll-preview';

import ModalHelpers from '@/components/modal/helpers';
import PremiumProvider from '@/providers/premiums';
import AuthSignal from '@/signals/auth';
import { useNavigate } from '@solidjs/router';
import { createQuery } from '@tanstack/solid-query';
import { Index, onMount, type Component } from 'solid-js';

interface PremiumJoinPageProps {}

const PremiumJoinPage: Component<PremiumJoinPageProps> = (props) => {
  const navigator = useNavigate();
  const v1PollQuery = createQuery(
    () => ['v1', 'premium', 'join', 'poll'],
    () => PremiumProvider.getPremiumsJoin({})
  );

  onMount(() => {
    premiumPreviewSignal.set(null);
    if (AuthSignal.getSignedAuth().user.vip.join) return;
    navigator(-1);
  });

  return (
    <div>
      <Layouts.Header title="Pesertaan" goBack />
      <Layouts.Body class="flex flex-col gap-4">
        <div class="text-center">Pilih apa yang ingin Anda ikuti</div>
        <div class="divider"></div>
        <Logics.QuerySwitch
          query={v1PollQuery}
          isSuccess={(props) => (
            <Index each={props.query.data}>
              {(poll) => (
                <div
                  class="flex flex-col px-2 py-5 rounded-md text-white text-center border-2 border-white border-opacity-5"
                  classList={{
                    'bg-primary-focus bg-opacity-40':
                      premiumPreviewSignal.get()?.poll.id === poll().id,
                  }}
                  onclick={() =>
                    premiumPreviewSignal.set({ mode: 'join', poll: poll(), include: true })
                  }
                >
                  <div>{poll().question}</div>
                </div>
              )}
            </Index>
          )}
        />
        <div class="h-20"></div>
        <div class="fixed bottom-0 left-0 right-0 px-2 h-20 flex items-center gap-2 z-50">
          <span
            class="btn flex-1 bg-secondary text-white"
            classList={{ 'btn-disabled': premiumPreviewSignal.get() == null }}
            onclick={async () => {
              try {
                ModalHelpers.premiumPollPreview.open();
              } catch (err) {
                console.log('error');
              }
            }}
          >
            Preview
          </span>
        </div>
      </Layouts.Body>
    </div>
  );
};

export default PremiumJoinPage;
