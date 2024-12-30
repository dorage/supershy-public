import StorageKeys from '@/constants/storage';
import Storage from '@/helpers/storage';
import AuthProvider, { OAuthResponse } from '@/providers/auth';
import UsersProvider from '@/providers/users';
import AuthSignal from '@/signals/auth';
import { UserModel } from '@/types/models';

/**
 * remove oauth tokens
 */
const removeTokens = async () => {
  await Storage.remove(StorageKeys.accessToken);
};

/**
 * set oauth tokens
 * @param accessToken s
 * @param refreshToken
 */
const setTokens = async (accessToken: string) => {
  await Storage.setItem(StorageKeys.accessToken, accessToken);
};

/**
 * get oauth tokens from localstroage
 * @returns
 */
const getTokens = async () => {
  return {
    accessToken: await Storage.getItem(StorageKeys.accessToken),
  };
};

/**
 * refresh tokens and run callback
 * @returns
 */
const refresh = async (cb?: Function) => {
  try {
    const result = await AuthProvider.postRefresh({});
    await setTokens(result.access_token);
    if (cb != null) return cb();
  } catch (err) {
    // refresh 실패시 토큰 정보 삭제
    await removeTokens();
    AuthSignal.setAuthUnsigned();
  }
};

const signIn = async (result: OAuthResponse) => {
  try {
    await setTokens(result.access_token);
    // make it loading again
    AuthSignal.setAuthLoading();
    return true;
  } catch (err) {
    alert('error has occured. please try again :)');
    return false;
  }
};

/**
 * get user
 * @returns
 */
const getUser = async (): Promise<UserModel> => {
  try {
    // fetch GET /users
    const user = await UsersProvider.getUsers({});

    return user;
  } catch (err) {
    return await refresh(getUser);
  }
};

const loadSignedUser = async () => {
  const { accessToken } = await getTokens();

  // if device has no token, make it unsigned state
  if (accessToken == null) return AuthSignal.setAuthUnsigned();

  const user = await getUser();

  if (user == null) return AuthSignal.setAuthUnsigned();

  AuthSignal.setAuthSigned({ user: user });
};

const signOut = async () => {
  try {
    await AuthProvider.postLogout({});
  } catch (err) {
  } finally {
    await removeTokens();
    AuthSignal.setAuthUnsigned();
  }
};

const AuthRepository = {
  refresh,
  signIn,
  loadSignedUser,
  signOut,
};

export default AuthRepository;
