import { createQueryKit } from '@/helpers/query';
import PollsProvider from '@/providers/polls';

export const getPollsKit = createQueryKit(() => ['v1.0.1', 'polls'], PollsProvider.getPolls, {
  refetchInterval: 60 * 1000,
});

export const getPollsDeatilKit = createQueryKit(
  ({ params: { poll_answer_id } }) => ['v1.0.1', 'polls', poll_answer_id],
  PollsProvider.getPollsPollAnswerId,
  {
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchInterval: false,
    refetchIntervalInBackground: false,
  }
);

export const getPollsSchoolsKit = createQueryKit(
  () => ['v1.0.1', 'polls', 'schools'],
  PollsProvider.getPollsSchools,
  {}
);
