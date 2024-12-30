import Layouts from '@/components/layouts';
import { premiumPreviewSignal } from '@/components/modal/components/premium-poll-preview';
import ModalHelpers from '@/components/modal/helpers';
import PremiumPreview from '@/components/premium-preview';
import Locale from '@/constants/locale';
import AuthSignal from '@/signals/auth';
import { useNavigate } from '@solidjs/router';
import { createFormlid } from 'formlid-js';
import { Show, onMount, type Component } from 'solid-js';
import * as Yup from 'yup';

interface PremiumCreatePageProps {}

interface PremiumCreateForm {
  question: string;
  include: boolean;
}

const PremiumCreatePage: Component<PremiumCreatePageProps> = (props) => {
  const navigator = useNavigate();
  const defaultGender = () => (AuthSignal.getSignedAuth().user.gender === 'm' ? 'm' : 'f');

  const { meta, field, form, helpers } = createFormlid<PremiumCreateForm>({
    initialValues: {
      question: '',
      include: true,
    },
    validationSchema: {
      question: Yup.string()
        .required(Locale.premiumCreate.form.question.error.required)
        .max(60, Locale.premiumCreate.form.question.error.max),
      include: Yup.boolean().required(),
    },
    onsubmit: (data) => {
      premiumPreviewSignal.set(() => ({
        mode: 'create',
        poll: { id: -1, question: data.question, gender: 'u' },
        include: data.include,
      }));
      ModalHelpers.premiumPollPreview.open();
    },
  });

  onMount(() => {
    premiumPreviewSignal.set(null);
    if (AuthSignal.getSignedAuth().user.vip.create) return;
    navigator(-1);
  });

  return (
    <div>
      <Layouts.Header title={Locale.premiumCreate.header} goBack />
      <Layouts.Body class="flex flex-col gap-2">
        <div>
          <PremiumPreview
            question={field('question').value.length ? field('question').value : 'Type below'}
            include={field('include').value}
            label
          />
        </div>
        <form class="flex flex-col gap-2" {...form}>
          <div class="form-control w-full mb-2">
            <label class="label">
              <span class="label-text font-semibold">
                {Locale.premiumCreate.form.question.label}
              </span>
            </label>
            <input
              type="text"
              placeholder="Type here"
              class="input input-bordered w-full"
              {...field('question')}
              maxLength={60}
            />
            <Show when={meta('question').error}>
              <span class="label-text text-xs text-red-600 pl-2">{meta('question').error}</span>
            </Show>
          </div>
          <div class="form-control">
            <label class="label">
              <span class="label-text font-semibold">
                {Locale.premiumCreate.form.include.label}
              </span>
            </label>
            <label
              class="btn btn-info w-full"
              classList={{
                'btn-info': !field('include').value,
                'btn-danger': field('include').value,
              }}
              onclick={() => {
                helpers.setValue('include')((prev) => !prev);
              }}
            >
              <Show
                when={field('include').value}
                fallback={
                  <>
                    <i class="iconoir-check" />
                    Termasuk
                  </>
                }
              >
                <>
                  <i class="iconoir-xmark" />
                  Belum termasuk
                </>
              </Show>
            </label>
          </div>
        </form>
        <div class="h-28"></div>
        <div class="fixed bottom-0 left-0 right-0 px-2 h-20 flex items-center gap-2 z-50">
          <span
            class="btn flex-1 bg-secondary text-white"
            classList={{
              'btn-disabled': !meta('question').isValidated,
            }}
            onclick={async () => {
              try {
                helpers.emitSubmit();
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

export default PremiumCreatePage;
