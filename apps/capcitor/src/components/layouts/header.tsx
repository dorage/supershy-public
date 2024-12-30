import Images from '@/assets/images';
import { useNavigate } from '@solidjs/router';
import { createSignal, type Component, type JSX, Show } from 'solid-js';

interface HeaderProps {
  title?: string;
  goBack?: boolean;
  children?: JSX.Element;
}

const Header: Component<HeaderProps> = (props) => {
  const navigator = useNavigate();
  const [pulse, setPulse] = createSignal(false);

  return (
    <div
      id="header"
      class="flex gap-4 items-center font-bold text-2xl px-5 pt-5 pb-2 text-primary h-[4rem]"
    >
      <div
        class="w-8 aspect-square flex justify-center items-center "
        classList={{ hidden: !props.goBack }}
        onclick={() => {
          navigator(-1);
        }}
      >
        <i class="bi bi-arrow-left-short"></i>
      </div>
      <div
        class="flex gap-3 items-center flex-1"
        classList={{ 'animate-pulse': pulse() }}
        onclick={() => {
          setPulse(true);
          setTimeout(() => setPulse(false), 10000);
        }}
      >
        <img src={Images.Logo.symbol_white} class="h-8" />
        <Show when={props.title} fallback={<img src={Images.Logo.text_white} class="h-6" />}>
          <div class="text-2xl font-bold flex-1">{props.title}</div>
        </Show>
      </div>

      <div class="flex justify-center items-center w-8">{props.children}</div>
    </div>
  );
};

export default Header;
