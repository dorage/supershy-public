import { createUniqueId, onCleanup, onMount } from 'solid-js';
import pure from './pure';

const intervals: { [key in string]: ReturnType<typeof setInterval> } = {};

export const useInfiniteScroll = (fetchFn: () => void) => {
  const id = createUniqueId();

  onMount(() => {
    const throttleFetchNextPage = pure.createThrottle(fetchFn, 300);

    intervals[id] = setInterval(() => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
        throttleFetchNextPage();
      }
    }, 200);
  });

  onCleanup(() => {
    clearInterval(intervals[id]);
    delete intervals[id];
  });
};
