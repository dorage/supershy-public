import { type Component } from 'solid-js';
import ModalSignal from './signal';
import NotEnoughCoin from './components/not-enough-coin';
import PremiumPollPreview from './components/premium-poll-preview';

interface ModalRootProps {}

const ModalRoot: Component<ModalRootProps> = (props) => {
  return (
    <>
      <NotEnoughCoin />
      <PremiumPollPreview />
    </>
  );
};

export default ModalRoot;
