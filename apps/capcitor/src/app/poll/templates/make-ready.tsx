import Layouts from '@/components/layouts';
import Logics from '@/components/logics';
import { getPollsSchoolsKit } from '@/components/queries/polls';
import { Link } from '@solidjs/router';
import { Index, type Component } from 'solid-js';
import Timer from '../components/timer';

interface MakeReadyTemplateProps {}

const MakeReadyTemplate: Component<MakeReadyTemplateProps> = (props) => {
  const getPollsSchoolsQuery = getPollsSchoolsKit.query({});

  return (
    <div class="pb-nav-bar">
      <Layouts.Header />
      <Layouts.Body>
        <div>
          <Timer />
        </div>
        <div class="flex flex-col gap-2 pt-5 text-sm">
          <div>Kamu selasai jajak pendapat terbaru!</div>
          <div>Jajak pendapat baru diperbarui setiap jam 2 siang</div>
        </div>
        <span class="divider"></span>
        <div class="flex flex-col justify-center">
          <div class="text-center font-bold">🏫 teman di sekolah ku</div>
          <div class="flex flex-col gap-2 text-center py-2">
            <Logics.QuerySwitch
              query={getPollsSchoolsQuery}
              isSuccess={(props) => (
                <Index each={props.query.data}>
                  {(poll) => (
                    <Link href={`/poll/${poll().id}`}>
                      <div class="box p-2">
                        <b>'{poll().winner.name}'</b>
                        <span> dipilih!</span>
                      </div>
                    </Link>
                  )}
                </Index>
              )}
            />
          </div>
        </div>
      </Layouts.Body>
    </div>
  );
};

export default MakeReadyTemplate;
