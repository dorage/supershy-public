import Resources from '@/assets/images/resources';
import Logics from '@/components/logics';
import { getSchoolsKit } from '@/components/queries/schools';
import ShareHelpers from '@/helpers/share';
import AuthSignal from '@/signals/auth';
import { type Component } from 'solid-js';

interface PendingOpenProps {}

const PendingOpen: Component<PendingOpenProps> = (props) => {
  const getSchoolsQuery = getSchoolsKit();

  return (
    <div class="flex flex-col justify-center items-center gap-5 h-full pb-10">
      <div class="px-10">
        <img src={Resources.pending} />
      </div>
      <div class="text-center">
        Ini akan terbuka
        <br />
        saat 20 orang teman berkumpul
      </div>
      {/* <div>{AuthSignal.getSignedAuth().user.school!.name}</div> */}
      <div>
        <Logics.QuerySwitch
          query={getSchoolsQuery.query}
          isSuccess={(props) => (
            <div class="font-bold text-4xl">{props.query.data.students.length} / 20</div>
          )}
        />
      </div>
      <div class="flex gap-2">
        <label
          class="btn btn-secondary btn-sm flex gap-2 animate-bounce"
          onclick={async () => {
            await ShareHelpers.inviteFriend({
              name: AuthSignal.getSignedAuth().user.name!,
              school: AuthSignal.getSignedAuth().user.school!.name!,
            });
          }}
        >
          <i class="iconoir-plus"></i>Ajak Temanmu
        </label>
      </div>
    </div>
  );
};

export default PendingOpen;
