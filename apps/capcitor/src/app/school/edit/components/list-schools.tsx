import Logics from '@/components/logics';
import CitiesProvider from '@/providers/cities';
import { ESchoolType } from '@/types/enum';
import { createQuery } from '@tanstack/solid-query';
import { Accessor, Index, Setter, type Component } from 'solid-js';

interface ListSchoolsProps {
  parent_city_id: () => string | null;
  school_type: () => ESchoolType;
  selected: Accessor<string | null>;
  setSelected: Setter<string | null>;
}

const ListSchools: Component<ListSchoolsProps> = (props) => {
  const query = createQuery(
    () => ['cities', props.parent_city_id(), props.school_type()],
    async () => {
      const parent_city_id = props.parent_city_id();
      const school_type = props.school_type();

      if (parent_city_id == null) throw Error();

      return CitiesProvider.getCitiesSchools({
        query: { id: parent_city_id, type: school_type },
      });
    },
    {
      refetchOnWindowFocus: false,
      get enabled() {
        return props.parent_city_id() != null;
      },
    }
  );

  return (
    <Logics.QuerySwitch
      query={query}
      isSuccess={
        <Index each={query.data}>
          {(school) => (
            <div
              class="px-2 py-2 rounded-md text-white"
              classList={{ 'bg-primary-focus bg-opacity-40': props.selected() === school().nspn }}
              onclick={() => {
                props.setSelected((prev) => (prev === school().nspn ? null : school().nspn));
              }}
            >
              <span>{school().name}</span>
            </div>
          )}
        </Index>
      }
    />
  );
};

export default ListSchools;
