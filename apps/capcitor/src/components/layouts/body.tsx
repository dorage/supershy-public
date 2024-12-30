import type { Component, JSX } from 'solid-js';

interface BodyProps {
  class?: string;
  classList?: { [key in string]: boolean };
  children?: JSX.Element;
}

const Body: Component<BodyProps> = (props) => {
  return (
    <div class={`px-5 py-5 ${props.class}`} classList={props.classList}>
      {props.children}
    </div>
  );
};

export default Body;
