import API from '.';

interface postDevCoinArgs {}
type postDevCoinResponse = {};

const postDevCoin = (args: postDevCoinArgs) =>
  API.post<postDevCoinResponse>({
    pathname: `/v1/dev/coin`,
    authorization: true,
    args: args,
  });

const DevProvider = { postDevCoin };

export default DevProvider;
