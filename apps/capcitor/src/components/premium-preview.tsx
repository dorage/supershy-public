import Poll from '@/app/poll/components/poll';
import AuthSignal from '@/signals/auth';
import { EPollGender } from '@/types/enum';
import { PollCandidateModel } from '@/types/models';
import { Show, type Component } from 'solid-js';

interface PremiumPreviewProps {
  question: string;
  include: boolean;
  label?: boolean;
}

const mockMales: PollCandidateModel[] = [
  { id: -99, name: 'Rayhananda', gender: 'm', phone: '0'.repeat(12) },
  { id: -99, name: 'Kevin', gender: 'm', phone: '0'.repeat(12) },
  { id: -99, name: 'Pieter', gender: 'm', phone: '0'.repeat(12) },
  { id: -99, name: 'Nathan', gender: 'm', phone: '0'.repeat(12) },
];
const mockFemales: PollCandidateModel[] = [
  { id: -99, name: 'Febby', gender: 'f', phone: '0'.repeat(12) },
  { id: -99, name: 'Cynthia', gender: 'f', phone: '0'.repeat(12) },
  { id: -99, name: 'Jesslyn', gender: 'f', phone: '0'.repeat(12) },
  { id: -99, name: 'Callysta', gender: 'f', phone: '0'.repeat(12) },
];

const PremiumPreview: Component<PremiumPreviewProps> = (props) => {
  const getCandidates = () => {
    const candidates: PollCandidateModel[] = [];
    const userGender = AuthSignal.getSignedAuth().user.gender;

    candidates.push(mockFemales[0]);
    candidates.push(mockFemales[3]);
    candidates.push(mockMales[1]);

    if (props.include) {
      candidates[1] = {
        id: AuthSignal.getSignedAuth().user.id,
        name: AuthSignal.getSignedAuth().user.name!,
        gender: AuthSignal.getSignedAuth().user.gender!,
        phone: '0'.repeat(0),
      };
    }
    console.log(props);
    console.log(candidates);
    return candidates;
  };

  return (
    <>
      <Show when={props.label}>
        <label class="label">
          <span class="label-text font-semibold">Pratayang</span>
        </label>
      </Show>
      <div class="flex flex-col items-center">
        <div class="bg-poll w-full h-72 rounded-lg flex flex-col gap-5 p-5">
          <Poll.Question
            poll={{
              id: 0,
              gender: 'f',
              question: props.question,
            }}
            textSize="lg"
          />
          <Poll.Candidates candidates={getCandidates()} />
        </div>
      </div>
    </>
  );
};

export default PremiumPreview;
