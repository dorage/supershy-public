import type { Component, JSX } from 'solid-js';
import ModalHelpers from '../modal/helpers';
import AuthSignal from '@/signals/auth';

interface PayableProps {
  class?: string;
  onclick: () => void;
  price: number;
  purchased?: boolean;
  children: JSX.Element;
}

const Payable: Component<PayableProps> = (props) => {
  return (
    <div
      class={props.class ?? ''}
      onclick={() => {
        if (!props.purchased && props.price > AuthSignal.getSignedAuth().user.coin)
          return ModalHelpers.notEnoughCoin.open();
        props.onclick();
      }}
    >
      {props.children}
    </div>
  );
};

export default Payable;
