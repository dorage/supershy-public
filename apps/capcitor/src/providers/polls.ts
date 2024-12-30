import {
  PollAnswerModel,
  PollAnswerResultModel,
  PollCandidateModel,
  PollModel,
} from '@/types/models';
import API from '.';

interface getPollsArgs {}
type getPollsData = PollAnswerModel[];

const getPolls = (args: getPollsArgs) =>
  API.get<getPollsData>({
    pathname: '/v1.0.1/polls',
    authorization: true,
    args,
  });

interface getPollsSchoolsArgs {}
type getPollsSchoolsResponse = {
  id: number;
  winner: PollCandidateModel;
  poll: PollModel;
}[];

const getPollsSchools = (args: getPollsSchoolsArgs) =>
  API.get<getPollsSchoolsResponse>({
    pathname: `/v1.0.1/polls/schools`,
    authorization: true,
    args: args,
  });

interface getPollsPollAnswerIdArgs {
  params: { poll_answer_id: string };
}
type getPollsPollAnswerIdResponse = PollAnswerResultModel;

const getPollsPollAnswerId = (args: getPollsPollAnswerIdArgs) =>
  API.get<getPollsPollAnswerIdResponse>({
    pathname: `/v1.0.1/polls/${args.params.poll_answer_id}`,
    authorization: true,
    args: args,
  });

interface putPollsPollAnswerIdArgs {
  params: { poll_answer_id: string };
  body: { winner: PollCandidateModel; candidates: PollCandidateModel[] };
}
type putPollsPollAnswerIdResponse = undefined;

const putPollsPollAnswerId = (args: putPollsPollAnswerIdArgs) =>
  API.put<putPollsPollAnswerIdResponse>({
    pathname: `/v1.0.1/polls/${args.params.poll_answer_id}`,
    authorization: true,
    args: args,
  });

interface deletePollsPollAnswerIdArgs {
  params: { poll_answer_id: string };
}
type deletePollsPollAnswerIdResponse = {};

const deletePollsPollAnswerId = (args: deletePollsPollAnswerIdArgs) =>
  API.delete<deletePollsPollAnswerIdResponse>({
    pathname: `/v1.0.1/polls/${args.params.poll_answer_id}`,
    authorization: true,
    args: args,
  });

const PollsProvider = {
  getPolls,
  getPollsSchools,
  getPollsPollAnswerId,
  putPollsPollAnswerId,
  deletePollsPollAnswerId,
};

export default PollsProvider;
