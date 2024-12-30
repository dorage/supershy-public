import { EUserGender } from '@/types/enum';
import { PollAnswerResultModel, UserModel } from '@/types/models';
import API, { APIArguments } from '.';

const getUsers = (args: APIArguments) =>
  API.get<UserModel>({
    pathname: '/v1.0.1/users',
    args,
    authorization: true,
  });

interface putUsersArgs {
  body: {
    name: string;
    gender: EUserGender;
  };
}
interface putUsersData {}

const putUsers = (args: putUsersArgs) =>
  API.put<putUsersData>({
    pathname: '/v1/users',
    args,
    authorization: true,
  });

interface putUsersSchoolArgs {
  body: {
    nspn: string;
    type: string;
    city: string;
  };
}
interface putUsersSchoolData {}

const putUsersSchool = (args: putUsersSchoolArgs) =>
  API.put<putUsersSchoolData>({
    pathname: '/v1.0.1/users/schools',
    args,
    authorization: true,
  });

interface putUsersGradeArgs {
  body: {
    grade: string;
  };
}
interface putUsersGradeData {}

const putUsersGrade = (args: putUsersGradeArgs) =>
  API.put<putUsersGradeData>({
    pathname: '/v1.0.1/users/grade',
    args,
    authorization: true,
  });

interface getUsersWinArgs {}
type getUsersWinResponse = PollAnswerResultModel[];

const getUsersWin = (args: getUsersWinArgs) =>
  API.get<getUsersWinResponse>({
    pathname: `/v1.0.1/users/win`,
    authorization: true,
    args: args,
  });

interface getUsersWinCountArgs extends APIArguments {}
type getUsersWinCountResponse = { count: number };

const getUsersWinCount = (args: getUsersWinCountArgs) =>
  API.get<getUsersWinCountResponse>({
    pathname: `/v1.0.1/users/win/count`,
    authorization: true,
    args: args,
  });

interface getUsersVoteArgs {}
type getUsersVoteResponse = PollAnswerResultModel[];

const getUsersVote = (args: getUsersVoteArgs) =>
  API.get<getUsersVoteResponse>({
    pathname: `/v1.0.1/users/vote`,
    authorization: true,
    args: args,
  });

interface getUsersVoteCountArgs {}
type getUsersVoteCountResponse = { count: number };

const getUsersVoteCount = (args: getUsersVoteCountArgs) =>
  API.get<getUsersVoteCountResponse>({
    pathname: `/v1.0.1/users/vote/count`,
    authorization: true,
    args: args,
  });

interface putUsersPhoneVerifyArgs {
  body: {
    otp: string;
  };
}
type putUsersPhoneVerifyResponse = {};

const putUsersPhoneVerify = (args: putUsersPhoneVerifyArgs) =>
  API.put<putUsersPhoneVerifyResponse>({
    pathname: `/v1.0.1/users/phone/verify`,
    authorization: true,
    args: args,
  });

interface postUsersPhoneVerifyArgs {
  body: { phone: string };
}
type postUsersPhoneVerifyResponse = {};

const postUsersPhoneVerify = (args: postUsersPhoneVerifyArgs) =>
  API.post<postUsersPhoneVerifyResponse>({
    pathname: `/v1.0.1/users/phone/verify`,
    authorization: true,
    args: args,
  });

const UsersProvider = {
  getUsers,
  putUsers,
  putUsersSchool,
  putUsersGrade,
  putUsersPhoneVerify,
  postUsersPhoneVerify,
  // postUsersPremium,
  // postUsersAlert,
  // deleteUsersAlert,
  getUsersWin,
  getUsersWinCount,
  getUsersVote,
  getUsersVoteCount,
};

export default UsersProvider;
