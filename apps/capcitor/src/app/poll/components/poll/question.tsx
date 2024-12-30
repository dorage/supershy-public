import { PollModel } from '@/types/models';
import type { Component } from 'solid-js';

interface QuestionProps {
  poll: PollModel;
  textSize?: 'sm' | 'lg' | '2xl';
}

const Question: Component<QuestionProps> = (props) => {
  return (
    <div class="flex flex-1 justify-center items-center text-center">
      <span class={`text-${props.textSize ?? '2xl'} text-white`}>{props.poll.question}</span>
    </div>
  );
};

export default Question;
