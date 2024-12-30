import type { Component, JSX } from 'solid-js';

interface ScreenProps {
  children: JSX.Element;
}

const Screen: Component<ScreenProps> = (props) => {
  return <div class="min-h-screen h-screen max-h-screen flex flex-col">{props.children}</div>;
};

export default Screen;
