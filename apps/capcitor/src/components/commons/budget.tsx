import type { Component } from 'solid-js';
import Coin from '../coin';
import AuthSignal from '@/signals/auth';

interface BudgetProps {}

const Budget: Component<BudgetProps> = (props) => {
  return (
    <div class="flex gap-2 justify-between items-center box px-2 p-1 w-28">
      <Coin class="w-5 h-5" />
      <span class="flex-1 text-right">
        {AuthSignal.getSignedAuth()?.user?.coin.toLocaleString()}
      </span>
    </div>
  );
};

export default Budget;
