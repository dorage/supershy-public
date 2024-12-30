import Images from '@/assets/images';
import type { Component } from 'solid-js';

interface LoadingIndicatorProps {}

const LoadingIndicator: Component<LoadingIndicatorProps> = (props) => {
  return (
    <>
      <img src={Images.Logo.symbol_white} class="w-[30%] animate-bounce" />
      <img src={Images.Logo.text_white} class="w-[50%]" />
    </>
  );
};

export default LoadingIndicator;
