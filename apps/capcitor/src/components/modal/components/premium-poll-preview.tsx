import Poll from '@/app/poll/components/poll';
import routes from '@/constants/url';
import { useNavigate } from '@solidjs/router';
import type { Component } from 'solid-js';
import ModalHelpers from '../helpers';
import { Show, createSignal } from 'solid-js';
import AuthSignal from '@/signals/auth';
import { PollModel } from '@/types/models';
import { createMutation } from '@tanstack/solid-query';
import PremiumProvider from '@/providers/premiums';
import AuthRepository from '@/repositories/auth';
import PremiumPreview from '@/components/premium-preview';

interface PremiumPreviewSignal {
  mode: 'join' | 'create';
  poll: PollModel;
  include: boolean;
}
const [premiumPreview, setPremiumPreview] = createSignal<null | PremiumPreviewSignal>(null);
export const premiumPreviewSignal = {
  get: premiumPreview,
  set: setPremiumPreview,
};

interface PremiumPollPreviewProps {}

const PremiumPollPreview: Component<PremiumPollPreviewProps> = (props) => {
  const navigator = useNavigate();

  const v1JoinMutate = createMutation(PremiumProvider.postPremiumsJoin);
  const v1CreateMutate = createMutation(PremiumProvider.postPremiumsCreate);

  return (
    <dialog id={ModalHelpers.premiumPollPreview.id} class="modal modal-bottom sm:modal-middle">
      <div class="modal-box">
        <Show when={premiumPreview() != null}>
          <PremiumPreview
            question={premiumPreview()!.poll.question}
            gender={premiumPreview()!.poll.gender}
            include={premiumPreview()!.include}
            label
          />
        </Show>
        <div class="modal-action">
          <form method="dialog" class="flex flex-1 gap-2">
            <div
              class="btn btn-secondary flex-1"
              onclick={async () => {
                const data = premiumPreview();
                if (data == null) return ModalHelpers.premiumPollPreview.close();
                if (data.mode === 'create') {
                  await v1CreateMutate.mutateAsync({
                    body: {
                      question: data.poll.question,
                      gender: data.poll.gender,
                      include: data.include,
                    },
                  });
                } else if (data.mode === 'join') {
                  await v1JoinMutate.mutateAsync({ body: { poll_id: data.poll.id } });
                }
                await AuthRepository.loadSignedUser();
                ModalHelpers.premiumPollPreview.close();
                setPremiumPreview(null);
                navigator(routes.profile.index);
              }}
            >
              Save
            </div>
            <button class="btn bg-slate-800 flex-1">Back</button>
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default PremiumPollPreview;
