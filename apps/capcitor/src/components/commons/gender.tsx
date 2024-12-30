import { EUserGender } from '@/types/enum';
import { Match, Switch, type Component } from 'solid-js';

interface GenderProps {
  gender: EUserGender;
}

const Gender: Component<GenderProps> = (props) => {
  return (
    <Switch>
      <Match when={props.gender === 'm'}>
        <i class="iconoir-male text-blue-500" />
      </Match>
      <Match when={props.gender === 'f'}>
        <i class="iconoir-female text-red-500" />
      </Match>
    </Switch>
  );
};

export default Gender;
