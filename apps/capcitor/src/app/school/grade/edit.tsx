import Layouts from '@/components/layouts';
import Locale from '@/constants/locale';
import routes from '@/constants/url';
import UsersProvider from '@/providers/users';
import AuthRepository from '@/repositories/auth';
import AuthSignal from '@/signals/auth';
import { useNavigate } from '@solidjs/router';
import { createMutation } from '@tanstack/solid-query';
import { createSignal, type Component, onMount } from 'solid-js';

interface EditSchoolGradePageProps {}

const EditSchoolGradePage: Component<EditSchoolGradePageProps> = (props) => {
  const navigator = useNavigate();
  const [grade, setGrade] = createSignal<string | null>(null);

  const setGradeMutate = createMutation(UsersProvider.putUsersGrade);

  const onclickGrade = (grade: string) => () => {
    setGrade(grade);
  };

  onMount(() => {
    const user = AuthSignal.getSignedAuth().user;
    if (user.grade == null) return;
    navigator(routes.checkRegistration);
  });

  return (
    <div>
      <Layouts.Header title={Locale.gradeEdit.header} />
      <Layouts.Body class="flex flex-col gap-2 text-center">
        <div class="text-left label">kelas</div>
        <div
          class="px-2 py-2 rounded-md text-white text-xl"
          classList={{ 'bg-primary-focus bg-opacity-40': grade() === '1' }}
          onclick={onclickGrade('1')}
        >
          1 st
        </div>
        <div
          class="px-2 py-2 rounded-md text-white text-xl"
          classList={{ 'bg-primary-focus bg-opacity-40': grade() === '2' }}
          onclick={onclickGrade('2')}
        >
          2 nd
        </div>
        <div
          class="px-2 py-2 rounded-md text-white text-xl"
          classList={{ 'bg-primary-focus bg-opacity-40': grade() === '3' }}
          onclick={onclickGrade('3')}
        >
          3 rd
        </div>
        <div class="fixed bottom-0 left-0 right-0 px-2 h-20 flex items-center gap-2 z-10">
          <span
            class="btn flex-1 bg-secondary text-white"
            classList={{ 'btn-disabled': grade() == null }}
            onclick={async () => {
              try {
                const myGrade = grade();
                if (myGrade == null) return;
                await setGradeMutate.mutateAsync({ body: { grade: myGrade } });
                await AuthRepository.loadSignedUser();
                navigator(routes.checkRegistration);
              } catch (err) {
                console.log('error');
              }
            }}
          >
            Save
          </span>
        </div>
      </Layouts.Body>
    </div>
  );
};

export default EditSchoolGradePage;
