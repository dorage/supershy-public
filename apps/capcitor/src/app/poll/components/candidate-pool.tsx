import Logics from '@/components/logics';
import { getSchoolsKit } from '@/components/queries/schools';
import ContactsHelper from '@/helpers/contacts';
import ShareHelpers from '@/helpers/share';
import Storage from '@/helpers/storage';
import AuthSignal from '@/signals/auth';
import { PollAnswerModel, PollCandidateModel } from '@/types/models';
import { Contacts } from '@capacitor-community/contacts';
import {
  Accessor,
  JSXElement,
  createEffect,
  createSignal,
  on,
  onMount,
  type Component,
  Show,
} from 'solid-js';

interface CandidatePoolProps {
  children: (props: {
    candidates: Accessor<PollCandidateModel[]>;
    lastCandidates: Accessor<PollCandidateModel[]>;
    refresh: () => void;
    reset: () => Promise<void>;
  }) => JSXElement;
  pollAnswer: PollAnswerModel;
}

const random = (max: number, min: number = 0) => Math.floor(Math.random() * (max - min) + min);

const isSameCandidate = (c1: PollCandidateModel, c2: PollCandidateModel) => {
  return c1.id === c2.id && c1.name === c2.name && c1.gender === c2.gender && c1.phone === c2.phone;
};

const CandidatePool: Component<CandidatePoolProps> = (props) => {
  const getSchoolQuery = getSchoolsKit.query({});
  const [getPool, setPool] = createSignal<PollCandidateModel[]>([]);

  const [getCandidates, setCandidates] = createSignal<PollCandidateModel[]>([]);
  const [getUsed, setUsed] = createSignal<PollCandidateModel[]>([]);

  const reset = async () => {
    setCandidates([]);
    setUsed([]);
    await Storage.remove('CND');
    createCandidates();
  };

  createEffect(() => {
    if (getSchoolQuery.data == null) return;

    const students = getSchoolQuery.data.students.filter(
      (e) => e.id !== AuthSignal.getSignedAuth().user.id
    );
    const studentPhoneSet = new Set(students.map((e) => e.phone));
    const contacts = ContactsHelper.contacts().filter((e) => !studentPhoneSet.has(e.phone));

    setPool([...students, ...contacts]);
  });

  onMount(async () => {
    const data = await Storage.getItem('CND');
    if (data == null) return;
    const { candidates, lastCandidates } = JSON.parse(data);
    if (candidates == null || lastCandidates == null) return;
    setCandidates(candidates);
    setUsed(lastCandidates);
  });

  createEffect(
    on(getPool, () => {
      if (getCandidates().length > 0) return;
      createCandidates();
    })
  );

  const createCandidates = async () => {
    const candidates: PollCandidateModel[] = [];
    const pool = getPool();

    if (pool.length < 4) {
      return;
    }

    const used = getUsed();
    const unique = pool.filter((c1) => !used.some((c2) => isSameCandidate(c1, c2)));

    while (candidates.length < Math.min(unique.length, 4)) {
      const candidate = unique[random(unique.length)];
      if (candidates.some((e) => isSameCandidate(e, candidate))) continue;
      candidates.push(candidate);
    }

    while (candidates.length < 4) {
      const candidate = used[random(used.length)];
      candidates.push(candidate);
    }

    setCandidates(candidates);
    setUsed((prev) => [...prev, ...candidates]);

    await Storage.setItem(
      'CND',
      JSON.stringify({ candidates, lastCandidates: [...used, ...candidates] })
    );
  };

  return (
    <Logics.QuerySwitch
      query={getSchoolQuery}
      isSuccess={(schoolProps) => (
        <Show
          when={getCandidates().length}
          fallback={
            <div class="flex-1 flex flex-col justify-start items-center gap-5">
              <div>Tidak ada yang bisa memuat</div>
              <Show
                when={!ContactsHelper.permission()}
                fallback={
                  <label
                    class="btn btn-secondary flex gap-2 animate-bounce"
                    onclick={async () => {
                      await ShareHelpers.inviteFriend({
                        name: AuthSignal.getSignedAuth().user.name!,
                        school: schoolProps.query.data.school.name,
                      });
                    }}
                  >
                    <i class="iconoir-plus"></i>Ajak Temanmu
                  </label>
                }
              >
                <div>
                  <label
                    class="btn btn-success flex gap-2 animate-bounce"
                    onclick={async () => {
                      await Contacts.requestPermissions();
                      await ContactsHelper.initialize();
                    }}
                  >
                    <i class="iconoir-book-lock"></i>
                    Izinkan Kontak
                  </label>
                </div>
              </Show>
            </div>
          }
        >
          <>
            {props.children({
              candidates: getCandidates,
              lastCandidates: getUsed,
              refresh: createCandidates,
              reset: reset,
            })}
          </>
        </Show>
      )}
    />
  );
};

export default CandidatePool;
