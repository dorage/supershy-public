import Logics from '@/components/logics';
import CitiesProvider from '@/providers/cities';
import { createQuery } from '@tanstack/solid-query';
import { Index, Show, type Component } from 'solid-js';

interface SelectLocationProps {
  placeholder: string;
  parent_city_id: () => string | null;
  setter: (id: string) => void;
}

const SelectLocation: Component<SelectLocationProps> = (props) => {
  const isEnabled = () => props.parent_city_id() !== undefined;
  const query = createQuery(
    () => ['location', props.parent_city_id()],
    () => {
      const parent_city_id = props.parent_city_id();
      return CitiesProvider.getCities({
        query: { id: parent_city_id == null ? '000000' : parent_city_id },
      });
    },
    { refetchOnWindowFocus: false }
  );

  return (
    <Show
      when={isEnabled()}
      fallback={
        <select class="select select-bordered w-full" disabled>
          <option disabled selected>
            {props.placeholder}
          </option>
        </select>
      }
    >
      <Logics.QuerySwitch
        query={query}
        isLoading={
          <select class="select select-bordered w-full" disabled>
            <option disabled selected>
              {props.placeholder}
            </option>
          </select>
        }
        isError={
          <select class="select select-bordered w-full" disabled>
            <option disabled selected>
              {props.placeholder}
            </option>
          </select>
        }
        isSuccess={(queryProps) => (
          <select
            class="select select-bordered w-full"
            oninput={(e) => {
              props.setter(e.currentTarget.value);
            }}
          >
            <option disabled selected>
              {props.placeholder}
            </option>
            <Index each={queryProps.query.data}>
              {(city) => <option value={city().id}>{city().name}</option>}
            </Index>
          </select>
        )}
      />
    </Show>
  );
};

export default SelectLocation;
