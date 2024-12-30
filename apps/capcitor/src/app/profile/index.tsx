import Gender from '@/components/commons/gender';
import Layouts from '@/components/layouts';
import Logics from '@/components/logics';
import { getSchoolsKit } from '@/components/queries/schools';
import { getUsersVoteCountKit, getUsersWinCountKit } from '@/components/queries/users';

import routes from '@/constants/url';
import ShareHelpers from '@/helpers/share';
import AuthSignal from '@/signals/auth';
import { Link, useNavigate } from '@solidjs/router';
import { Index, type Component } from 'solid-js';

interface ProfilePageProps {}

const ProfilePage: Component<ProfilePageProps> = (props) => {
  const navigator = useNavigate();
  const winCountQuery = getUsersWinCountKit.query({});
  const voteCountQuery = getUsersVoteCountKit.query({});
  const getSchoolsQuery = getSchoolsKit.query({});

  return (
    <div class="flex flex-col overflow-y-auto">
      <Layouts.Header title="Profil">
        <Link href={routes.setting.index}>
          <i class="bi bi-gear-fill"></i>
        </Link>
      </Layouts.Header>
      <Layouts.Body class="pb-24 flex flex-col gap-2">
        <div class="flex flex-col gap-1 justify-center w-full">
          <div class="header text-lg">{AuthSignal.getSignedAuth().user.name}</div>
          <div class="flex flex-col gap-2 items-center justify-between text-sm">
            <div class="flex flex-col rounded-md w-full p-2 gap-1 box">
              <div class="flex justify-between text-lg">
                <div>
                  <i class="iconoir-leaderboard-star text-white" />
                </div>
                <div
                  class="btn btn-sm btn-secondary w-24"
                  onclick={() => {
                    navigator(routes.poll.win);
                  }}
                >
                  <Logics.QuerySwitch
                    query={winCountQuery}
                    isSuccess={(props) => props.query.data.count ?? 0}
                  />
                </div>
              </div>
              <div class="text-xs">Ini adalah pertanyaan yang aku pilih</div>
            </div>
            <div class="flex flex-col rounded-md w-full p-2 gap-1 box">
              <div class="flex justify-between text-lg">
                <div>
                  <i class="iconoir-bookmark text-white" />
                </div>
                <div
                  class="btn btn-sm btn-secondary w-24"
                  onclick={() => {
                    navigator(routes.poll.vote);
                  }}
                >
                  <Logics.QuerySwitch
                    query={voteCountQuery}
                    isSuccess={(props) => props.query.data.count ?? 0}
                  />
                </div>
              </div>
              <div class="text-xs">Ini adalah pertanyaan yang aku dipilih</div>
            </div>
          </div>
        </div>
        <div class="divider"></div>
        <Logics.QuerySwitch
          query={getSchoolsQuery}
          isSuccess={(props) => (
            <>
              <div class="flex flex-col gap-2 justify-between">
                <div class="header">Sekolahku</div>
                <div class="flex flex-col box p-2 gap-2">
                  <div class="font-bold">
                    <span>{props.query.data.school.name}</span>
                  </div>
                  <div class={'flex justify-between text-sm'}>
                    <div>{AuthSignal.getSignedAuth().user.grade} th</div>
                    {/* TOOD; 내 학교 학생 수 */}
                    <Logics.QuerySwitch
                      query={getSchoolsQuery}
                      isSuccess={(props) => (
                        <span class="flex items-center gap-2">
                          <i class="iconoir-user"></i>
                          <span>{props.query.data.students.length}</span>
                        </span>
                      )}
                    />
                  </div>
                </div>
              </div>
              <div class="flex flex-col gap-2">
                <div
                  class="btn btn-sm btn-secondary"
                  onclick={async () => {
                    await ShareHelpers.inviteFriend({
                      name: AuthSignal.getSignedAuth().user.name!,
                      school: props.query.data.school.name!,
                    });
                  }}
                >
                  <i class="iconoir-plus"></i>Ajak Temanmu
                </div>
                <Index each={props.query.data.students}>
                  {(data) => (
                    <div class="flex items-center gap-2 box p-2">
                      <span class="flex items-center">
                        <Gender gender={data().gender} />
                      </span>
                      <span>{data().name}</span>
                    </div>
                  )}
                </Index>
              </div>
            </>
          )}
        />
      </Layouts.Body>
      <Layouts.NavBar />
    </div>
  );
};

export default ProfilePage;
