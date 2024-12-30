import API, { APIArguments } from '.';

export interface OAuthResponse {
  access_token: string;
}

interface postAuthDevArgs {
  body: { email: string };
}

const postAuthDev = (args: postAuthDevArgs) =>
  API.post<OAuthResponse>({ pathname: '/v1.1.0/auth/dev', args });

interface postAuthGoogleArgs {
  body: { code: string };
}

const postAuthGoogle = (args: postAuthGoogleArgs) =>
  API.post<OAuthResponse>({ pathname: '/v1.1.0/auth/google', args });

interface postAuthAppleArgs {
  body: {
    authorization_code: string;
    email: string;
    user: string;
    identity_token: string;
  };
}

const postAuthApple = (args: postAuthAppleArgs) =>
  API.post<OAuthResponse>({ pathname: '/v1.1.0/auth/apple', args });

const postRefresh = (args: APIArguments) =>
  API.post<OAuthResponse>({
    pathname: '/v1.1.0/auth/refresh',
    args,
    authorization: true,
  });

const postLogout = (args: APIArguments) =>
  API.post({
    pathname: '/v1.1.0/auth/logout',
    args,
    authorization: true,
  });

interface postAuthIdArgs {
  body: { account_id: string };
}
type postAuthIdResponse = {};

const postAuthId = (args: postAuthIdArgs) =>
  API.post<postAuthIdResponse>({
    pathname: `/v1.1.0/auth/id`,
    args: args,
  });

interface postAuthPasswordArgs {
  body: { account_id: string; password: string };
}
type postAuthPasswordResponse = OAuthResponse;

const postAuthPassword = (args: postAuthPasswordArgs) =>
  API.post<postAuthPasswordResponse>({
    pathname: `/v1.1.0/auth/password`,
    args: args,
  });

interface putAuthPasswordArgs {
  body: { account_id: string; password: string };
}
type putAuthPasswordResponse = { okay: boolean };

const putAuthPassword = (args: putAuthPasswordArgs) =>
  API.put<putAuthPasswordResponse>({
    pathname: `/v1.1.0/auth/password`,
    args: args,
  });

const AuthProvider = {
  postAuthDev,
  postAuthGoogle,
  postAuthApple,
  postLogout,
  postRefresh,
  postAuthId,
  postAuthPassword,
  putAuthPassword,
};

export default AuthProvider;
