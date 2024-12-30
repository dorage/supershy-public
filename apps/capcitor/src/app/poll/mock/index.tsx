import Locale from '@/constants/locale';
import { createSignal, type Component } from 'solid-js';
import Poll from '../components/poll';
import { PollCandidateModel, PollModel } from '@/types/models';

interface PollMockPageProps {}

const scenarios: { poll: PollModel; candidates: PollCandidateModel[] }[] = [
  {
    // poll: { id: 1, gender: 'f', question: 'Siapa yang paling cantik' },
    poll: { id: 1, gender: 'f', question: 'Siapa yang paling cantik' },
    candidates: [
      { gender: 'f', name: 'Febby', id: 1 },
      { gender: 'f', name: 'Jesslyn', id: 2 },
      { gender: 'f', name: 'Cynthia', id: 3 },
      { gender: 'f', name: 'Clara', id: 4 },
    ],
  },
  {
    poll: { id: 1, gender: 'm', question: 'Siapa yang ingin kamu ajak movie date' },
    candidates: [
      { gender: 'm', name: 'Pieter', id: 1 },
      { gender: 'm', name: 'Kevin', id: 2 },
      { gender: 'm', name: 'Rayhananda', id: 3 },
      { gender: 'm', name: 'Nathan', id: 4 },
    ],
  },
  {
    poll: { id: 1, gender: 'u', question: 'Siapa yang ingin kamu ajak belajar bareng' },
    candidates: [
      { gender: 'f', name: 'Jesslyn', id: 4 },
      { gender: 'm', name: 'Nathan', id: 2 },
      { gender: 'f', name: 'Febby', id: 1 },
      { gender: 'm', name: 'Rayhananda', id: 3 },
    ],
  },
];

const PollMockPage: Component<PollMockPageProps> = (props) => {
  const [winnerId, setWinnerId] = createSignal<undefined | number>(undefined);
  const scenario = scenarios[2];

  return (
    <div class="h-screen bg-poll pb-nav-bar flex flex-col justify-end px-5 pt-5">
      {/* Indicator */}
      <span class="text-center pb-5">{Locale.poll.left} 12</span>
      <Poll.Question poll={scenario.poll} />
      <Poll.Candidates
        // candidates={candidates.query.data.candidates}
        candidates={scenario.candidates}
        winner_id={winnerId()}
        onclick={async (candidate, idx, e) => {
          try {
            if (winnerId() != null) return;
            setWinnerId(candidate().id);
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
            'btn-disabled bg-transparent': false,
          }}
          onclick={async () => {}}
        >
          <i class="bi bi-shuffle"></i>
          {Locale.poll.shuffle} {2}/2
        </span>
        {/* Skip */}
        <span
          class="btn btn-ghost"
          onclick={async () => {
            try {
            } catch (err) {
              alert('error');
            }
          }}
        >
          <i class="bi bi-fast-forward-fill"></i>
          {Locale.poll.skip}
        </span>
      </div>
    </div>
  );
};

export default PollMockPage;
