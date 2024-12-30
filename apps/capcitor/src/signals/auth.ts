import { UserModel } from '@/types/models';
import { Accessor, createSignal } from 'solid-js';

// typing

export interface AuthLoading {
  isLoading: true;
  isAuth: false;
  user: null;
}

export interface AuthUnsigned {
  isLoading: false;
  isAuth: false;
  user: null;
}

export interface AuthSigned {
  isLoading: false;
  isAuth: true;
  user: UserModel;
}

// signal

const signal = createSignal<AuthLoading | AuthUnsigned | AuthSigned>({
  isLoading: true,
  isAuth: false,
  user: null,
});

/**
 * Auth 상태를 반환합니다
 * @returns
 */
const getAuthState = () => {
  if (signal[0]().isAuth) return 'SIGNED';
  if (signal[0]().isLoading) return 'LOADING';
  return 'UNSIGNED';
};

// helpers

const getLoadingAuth = signal[0] as Accessor<AuthLoading>;

const getUnsignedAuth = signal[0] as Accessor<AuthUnsigned>;

const getSignedAuth = signal[0] as Accessor<AuthSigned>;

const setAuthLoading = () =>
  signal[1](() => ({
    isLoading: true,
    isAuth: false,
    user: null,
  }));

const setAuthUnsigned = () =>
  signal[1](() => ({
    isLoading: false,
    isAuth: false,
    user: null,
  }));

interface setAuthSignedArgs {
  user: UserModel;
}

const setAuthSigned = (args: setAuthSignedArgs) =>
  signal[1](() => ({
    isLoading: false,
    isAuth: true,
    user: args.user,
  }));

const AuthSignal = {
  get: signal[0],
  set: signal[1],
  getAuthState,
  setAuthLoading,
  setAuthUnsigned,
  setAuthSigned,
  getLoadingAuth,
  getUnsignedAuth,
  getSignedAuth,
};

export default AuthSignal;
