import Layouts from '@/components/layouts';
import routes from '@/constants/url';
import UsersProvider from '@/providers/users';
import { ESchoolType } from '@/types/enum';
import { useNavigate } from '@solidjs/router';
import { createEffect, createSignal, on, type Component, onMount } from 'solid-js';
import ListSchools from './components/list-schools';
import SelectLocation from './components/select-location';
import { createMutation } from '@tanstack/solid-query';
import AuthRepository from '@/repositories/auth';
import Locale from '@/constants/locale';
import AuthSignal from '@/signals/auth';

interface SchoolEditPageProps {}

const SchoolEditPage: Component<SchoolEditPageProps> = (props) => {
  const navigator = useNavigate();
  const [selectedSchoolId, setSelectedSchoolId] = createSignal<string | null>(null);
  const [schoolType, setSchoolType] = createSignal<ESchoolType>('smp');
  const [cities, setCities] = createSignal<(string | null)[]>([null]);
  const getCity = (idx: number) => () => cities()[idx];
  const setCity = (idx: number) => (value: string) => {
    setCities((prev) => [...prev.slice(0, idx), value]);
  };

  const updateUserMutate = createMutation(UsersProvider.putUsersSchool);

  // 유저 등록된 학교 확인
  onMount(() => {
    if (AuthSignal.getSignedAuth().user.school_group_id == null) return;
    navigator(routes.checkRegistration);
  });

  // 기존 선택이 변경되면,
  // 선택도 초기화
  createEffect(
    on([schoolType, cities], () => {
      setSelectedSchoolId(() => null);
    })
  );

  return (
    <div>
      <Layouts.Header title={Locale.schoolEdit.header}></Layouts.Header>
      {/* Location */}
      <div class="px-5 py-2">
        <div class="flex flex-col gap-2">
          <div class="form-control w-full">
            <label class="label">
              <span class="label-text">{Locale.schoolEdit.form.city.level1}</span>
            </label>
            <SelectLocation
              placeholder={`${Locale.schoolEdit.form.city.placeholder} ${Locale.schoolEdit.form.city.level1}`}
              setter={setCity(1)}
              parent_city_id={getCity(0)}
            />
          </div>
          <div class="form-control w-full">
            <label class="label">
              <span class="label-text">{Locale.schoolEdit.form.city.level2}</span>
            </label>
            <SelectLocation
              placeholder={`${Locale.schoolEdit.form.city.placeholder} ${Locale.schoolEdit.form.city.level2}`}
              setter={setCity(2)}
              parent_city_id={getCity(1)}
            />
          </div>
          <div class="form-control w-full">
            <label class="label">
              <span class="label-text">{Locale.schoolEdit.form.city.level3}</span>
            </label>
            <SelectLocation
              placeholder={`${Locale.schoolEdit.form.city.placeholder} ${Locale.schoolEdit.form.city.level3}`}
              setter={setCity(3)}
              parent_city_id={getCity(2)}
            />
          </div>
        </div>
        <span class="divider" />
        {/* School Type */}
        <div class="flex items-center justify-between gap-5">
          <label>{Locale.schoolEdit.form.schoolType.label}</label>
          <select
            class="select select-bordered"
            value={schoolType()}
            onchange={(e) => {
              setSchoolType(() => e.currentTarget.value as ESchoolType);
            }}
            classList={{ 'select-disabled': getCity(3)() == null }}
          >
            <option disabled selected>
              {Locale.schoolEdit.form.schoolType.label}
            </option>
            <option value={'smp'}>SMP</option>
            <option value={'smk'}>SMK</option>
            <option value={'sma'}>SMA</option>
          </select>
        </div>
        <span class="divider" />
        {/* School List */}
        <div>
          <ListSchools
            school_type={schoolType}
            parent_city_id={getCity(3)}
            selected={selectedSchoolId}
            setSelected={setSelectedSchoolId}
          />
        </div>
        <div class="w-full h-20"></div>
      </div>
      <div class="fixed bottom-0 left-0 right-0 px-2 h-20 flex items-center gap-2 z-10">
        <span
          class="btn flex-1 bg-secondary text-white"
          classList={{ 'btn-disabled': selectedSchoolId() == null }}
          onclick={async () => {
            try {
              const schoolId = selectedSchoolId();
              const city = getCity(3)();
              if (schoolId == null) return;
              if (city == null) return;
              await updateUserMutate.mutateAsync({
                body: { nspn: schoolId, city: city, type: schoolType() },
              });
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
    </div>
  );
};

export default SchoolEditPage;
