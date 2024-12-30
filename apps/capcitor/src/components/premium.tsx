import Images from '@/assets/images';
import type { Component, JSX } from 'solid-js';

interface PremiumProps {
  name: string;
  price: string | number;
  onclick: JSX.CustomEventHandlersLowerCase<HTMLDivElement>['onclick'];
  image: string;
  color?: 'success' | 'info' | 'warning' | 'danger' | 'primary' | 'secondary';
  diabled?: boolean;
}

const Premium: Component<PremiumProps> = (props) => {
  return (
    <div class="flex flex-col box h-40">
      <div
        class={`flex-1 rounded-t-lg`}
        style={{
          'background-image': `url('${props.image}')`,
          'background-size': 'cover',
          'background-position': 'center',
        }}
      ></div>
      <div class="flex justify-between items-center p-2">
        <div class="text-2xl font-bold">{props.name}</div>
        <div
          class={`btn btn-${props.color ?? 'success'} btn-sm w-28`}
          classList={{ 'btn-disabled': props.diabled }}
          onclick={props.onclick}
        >
          {props.price}
        </div>
      </div>
    </div>
  );
};

export default Premium;
