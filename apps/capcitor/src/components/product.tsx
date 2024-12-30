import type { Component, JSXElement } from 'solid-js';

interface ProductProps {
  name: string;
  image: string;
  button: JSXElement;
}

const Product: Component<ProductProps> = (props) => {
  const refine = () => {
    const match = props.name.match(/(.*)\(.*\)/i);
    if (match == null) return props.name;
    return match[1].trim();
  };

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
        <div class="text-xl font-bold">{refine()}</div>
        {props.button}
      </div>
    </div>
  );
};

export default Product;
