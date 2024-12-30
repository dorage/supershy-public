import { createQueryKit } from '@/helpers/query';
import UsersProvider from '@/providers/users';

export const getUsersWinKit = createQueryKit(
  () => ['v1.0.1', 'users', 'win'],
  UsersProvider.getUsersWin,
  { refetchInterval: 30 * 1000 }
);

export const getUsersWinCountKit = createQueryKit(
  () => ['v1.0.1', 'users', 'win', 'count'],
  UsersProvider.getUsersWinCount,
  { refetchInterval: 30 * 1000 }
);

export const getUsersVoteKit = createQueryKit(
  () => ['v1.0.1', 'users', 'vote'],
  UsersProvider.getUsersVote,
  { refetchInterval: 30 * 1000 }
);

export const getUsersVoteCountKit = createQueryKit(
  () => ['v1.0.1', 'users', 'vote', 'count'],
  UsersProvider.getUsersVoteCount,
  { refetchInterval: 30 * 1000 }
);
