import { EPollGender } from '@/types/enum';
import API from '.';
import { PollModel } from '@/types/models';

interface putPremiumsBuyArgs {
  body: {
    product_id: string;
    transaction_id: string;
  };
}
type putPremiumsBuyResponse = {};

const putPremiumsBuy = (args: putPremiumsBuyArgs) =>
  API.put<putPremiumsBuyResponse>({
    pathname: `/v1/premiums/buy`,
    authorization: true,
    args: args,
  });

interface putPremiumsOpenArgs {
  body: { poll_answer_id: string };
}
type putPremiumsOpenResponse = {};

const putPremiumsOpen = (args: putPremiumsOpenArgs) =>
  API.put<putPremiumsOpenResponse>({
    pathname: `/v1/premiums/open`,
    authorization: true,
    args: args,
  });

interface getPremiumsJoinArgs {}
type getPremiumsJoinResponse = PollModel[];

const getPremiumsJoin = (args: getPremiumsJoinArgs) =>
  API.get<getPremiumsJoinResponse>({
    pathname: `/v1/premiums/join`,
    authorization: true,
    args: args,
  });

interface putPremiumsJoinArgs {}
type putPremiumsJoinResponse = {};

const putPremiumsJoin = (args: putPremiumsJoinArgs) =>
  API.put<putPremiumsJoinResponse>({
    pathname: `/v1/premiums/join`,
    authorization: true,
    args: args,
  });

interface postPremiumsJoinArgs {
  body: { poll_id: number };
}
type postPremiumsJoinResponse = {};

const postPremiumsJoin = (args: postPremiumsJoinArgs) =>
  API.post<putPremiumsJoinResponse>({
    pathname: `/v1/premiums/join`,
    authorization: true,
    args: args,
  });

interface putPremiumsCreateArgs {}
type putPremiumsCreateResponse = {};

const putPremiumsCreate = (args: putPremiumsCreateArgs) =>
  API.put<putPremiumsCreateResponse>({
    pathname: `/v1/premiums/create`,
    authorization: true,
    args: args,
  });

interface postPremiumsCreateArgs {
  body: { question: string; gender: EPollGender; include: boolean };
}
type postPremiumsCreateResponse = {};

const postPremiumsCreate = (args: postPremiumsCreateArgs) =>
  API.post<postPremiumsCreateResponse>({
    pathname: `/v1/premiums/create`,
    authorization: true,
    args: args,
  });

interface getPremiumsRewardArgs {
  query: any;
}
type getPremiumsRewardResponse = {};

const getPremiumsReward = (args: getPremiumsRewardArgs) =>
  API.get<getPremiumsRewardResponse>({
    pathname: `/v1/premiums/reward`,
    authorization: true,
    args: args,
  });

const PremiumProvider = {
  putPremiumsBuy,
  putPremiumsOpen,
  getPremiumsJoin,
  putPremiumsJoin,
  postPremiumsJoin,
  putPremiumsCreate,
  postPremiumsCreate,
  getPremiumsReward,
};

export default PremiumProvider;
