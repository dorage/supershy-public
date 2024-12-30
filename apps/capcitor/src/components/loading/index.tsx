import type { Component } from 'solid-js';

interface LoadingProps {}

const Loading: Component<LoadingProps> = (props) => {
  return (
    <div class="w-full h-full flex justify-center items-center animate-pulse">
      <div class="loading loading-lg loading-ring bg-white" />
    </div>
  );
};

export default Loading;
