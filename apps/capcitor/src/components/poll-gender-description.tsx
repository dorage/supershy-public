import { EPollGender } from '@/types/enum';
import { Switch, type Component, Match } from 'solid-js';
import Commons from './commons';

interface PollGenderDescriptionProps {
  gender: EPollGender;
}
const Arrow = () => <i class="iconoir-arrow-right text-xs mx-1" />;

const PollGenderDescription: Component<PollGenderDescriptionProps> = (props) => {
  return (
    <Switch>
      <Match when={props.gender === 'f'}>
        <Commons.Gender gender="m" />
        <Arrow />
        <Commons.Gender gender="f" />
      </Match>
      <Match when={props.gender === 'm'}>
        <Commons.Gender gender="f" />
        <Arrow />
        <Commons.Gender gender="m" />
      </Match>
      <Match when={props.gender === 'o'}>
        <Commons.Gender gender="m" />
        <Arrow />
        <Commons.Gender gender="f" />
        <i class="iconoir-slash" />
        <Commons.Gender gender="f" />
        <Arrow />
        <Commons.Gender gender="m" />
      </Match>
      <Match when={props.gender === 'u'}>
        <Commons.Gender gender="m" />
        <Commons.Gender gender="f" />
        <Arrow />
        <Commons.Gender gender="m" />
        <Commons.Gender gender="f" />
      </Match>
    </Switch>
  );
};

export default PollGenderDescription;
