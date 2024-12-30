import routes from '@/constants/url';
import { useNavigate } from '@solidjs/router';
import type { Component } from 'solid-js';
import ModalHelpers from '../helpers';
import Budget from '@/components/commons/budget';

interface NotEnoughCoinProps {}

const NotEnoughCoin: Component<NotEnoughCoinProps> = (props) => {
  const navigator = useNavigate();
  return (
    <dialog id={ModalHelpers.notEnoughCoin.id} class="modal modal-bottom sm:modal-middle">
      <div class="modal-box">
        {/* <h3 class="font-bold text-lg">Hello!</h3> */}
        <div class="flex flex-col items-center">
          <p class="py-4 text-lg font-bold text-white">Koin Anda tidak cukup</p>
          <div class="flex items-center justify-between gap-5">
            <span>Koin saya</span>
            <Budget />
          </div>
        </div>
        <div class="modal-action">
          <form method="dialog" class="flex flex-1 gap-2">
            <button class="btn btn-secondary btn-ghost flex-1">Tutup</button>
            <div
              class="btn btn-secondary flex-1"
              onclick={() => {
                navigator(routes.shop);
                ModalHelpers.notEnoughCoin.close();
              }}
            >
              Toko
            </div>
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default NotEnoughCoin;
