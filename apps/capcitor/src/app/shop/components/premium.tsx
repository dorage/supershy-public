import Images from '@/assets/images';
import type { Component, JSX, JSXElement } from 'solid-js';

interface PremiumProps {
  name: string;
  onclick: JSX.CustomEventHandlersLowerCase<HTMLDivElement>['onclick'];
  image: string;
  description: string;
  button: JSXElement;
  color?: 'success' | 'info' | 'warning' | 'danger' | 'primary' | 'secondary';
  diabled?: boolean;
}

const Premium: Component<PremiumProps> = (props) => {
  return (
    <div class="flex flex-col box h-48">
      <div
        class={`flex-1 rounded-t-lg`}
        style={{
          'background-image': `url('${props.image}')`,
          'background-size': 'cover',
          'background-position': 'center',
        }}
      ></div>
      <div class="flex justify-between items-center p-2">
        <div class="text-xl font-bold">{props.name}</div>
        {props.button}
      </div>
      <div class="text-xs pl-2 pr-2 pb-2">{props.description}</div>
    </div>
  );
};

export default Premium;
