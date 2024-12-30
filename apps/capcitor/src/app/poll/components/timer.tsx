import Time from '@/helpers/time';
import { useQueryClient } from '@tanstack/solid-query';
import { createEffect, createSignal, onMount, type Component } from 'solid-js';

interface TimerProps {}

const Timer: Component<TimerProps> = (props) => {
  const queryClient = useQueryClient();
  const [time, setTime] = createSignal<{ hours: string; minutes: string; seconds: string }>(
    Time.getNextDateCount()
  );

  onMount(() => {
    setInterval(() => setTime(Time.getNextDateCount()), 1000);
  });

  createEffect(() => {
    const { hours, minutes, seconds } = time();
    if (Number(hours) === 0 && Number(minutes) === 0 && Number(seconds) <= 0) {
      queryClient.refetchQueries(['polls']);
    }
  });

  return (
    <div class="flex flex-col gap-4">
      <div class="text-center font-extrabold">
        <span>Sampai jajak pendapat berikutnya</span>
      </div>
      <div class="flex gap-5">
        <div class="w-full flex flex-col justify-center flex-1 gap-1 text-center box aspect-square">
          <div class="font-bold text-4xl">{time().hours}</div>
          <div>jam</div>
        </div>
        <div class="w-full flex flex-col justify-center flex-1 gap-1 text-center box aspect-square">
          <div class="font-bold text-4xl">{time().minutes}</div>
          <div>min</div>
        </div>
        <div class="w-full flex flex-col justify-center flex-1 gap-1 text-center box aspect-square">
          <div class="font-bold text-4xl">{time().seconds}</div>
          <div>sec</div>
        </div>
      </div>
    </div>
  );
};

export default Timer;
