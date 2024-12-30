import Images from '@/assets/images';
import type { Component } from 'solid-js';

interface CoinProps {
  class?: string;
}

const Coin: Component<CoinProps> = (props) => {
  // return <i class="iconoir-planet-sat rounded-full border-[1px] bg-yellow-900 text-white" />;
  return <img src={Images.Resources.coin} class={props.class ?? 'w-5'} />;
};

export default Coin;
