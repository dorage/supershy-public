import API, { APIArguments } from '.';

interface getHealthCheckResponse {
  is_enabled: true;
}

const getHealthCheck = (args: APIArguments) =>
  API.get<getHealthCheckResponse>({
    pathname: `/v1/app/health`,
    args: args,
  });

interface postVersionsArgs {
  body: {
    os: 'a' | 'i';
    version: string;
  };
}

interface postVersionsResponse {
  is_enabled: boolean;
}

const postVersions = (args: postVersionsArgs) =>
  API.post<postVersionsResponse>({
    pathname: `/v1/app/version`,
    args: args,
  });

interface getAppAdmobArgs {
  query: any;
}
type getAppAdmobResponse = {};

const getAppAdmob = (args: getAppAdmobArgs) =>
  API.get<getAppAdmobResponse>({
    pathname: `/v1/app/admob`,
    args: args,
  });

const AppProviders = { getHealthCheck, postVersions, getAppAdmob };

export default AppProviders;
