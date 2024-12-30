import { JSX, createSignal } from 'solid-js';

const [Modal, setModal] = createSignal<JSX.Element>(
  <div class="bg-white rounded-xl flex flex-col w-full p-2">
    <div class="py-5 text-black text-center">뭐 어떻게 하시겠습니까?</div>
    <div class="h-2"></div>
    <div class="flex gap-2">
      <span class="btn btn-secondary flex-1" onclick={() => setIsOpened(false)}>
        cancle
      </span>
      <span class="btn flex-1">okay</span>
    </div>
  </div>
);

const [isOpened, setIsOpened] = createSignal(false);

const ModalSignal = {
  setModal: (modal: JSX.Element) => setModal(modal),
  getModal: Modal,
  isOpened,
  open: () => setIsOpened(true),
  close: () => setIsOpened(false),
};

export default ModalSignal;
