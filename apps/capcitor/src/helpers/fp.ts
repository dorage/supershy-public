const zfill = <T>(target: T, fill: number): string => {
  const s = String(target);

  if (s.length >= fill) return s;

  return (
    Array(fill - s.length)
      .fill('0')
      .join() + s
  );
};

const sleep = (ms: number) =>
  new Promise((res) =>
    setTimeout(() => {
      res(true);
    }, ms)
  );

const _ = { sleep, zfill };

export default _;
