const createThrottle = <TArgs extends Array<any>, TReturn>(
  fn: (...args: TArgs) => TReturn,
  ms: number
): ((...args: TArgs) => TReturn | undefined) => {
  let enable = true;

  return (...args: TArgs) => {
    if (!enable) return;
    enable = false;

    setTimeout(() => (enable = true), ms);
    return fn(...args);
  };
};

const createDebounce = <TArgs extends Array<any>, TReturn>(
  fn: (...args: TArgs) => TReturn,
  ms: number
): ((...args: TArgs) => undefined) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (...args: TArgs) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn(...args);
      timeout = null;
    }, ms);
  };
};

const pure = { createThrottle, createDebounce };

export default pure;
