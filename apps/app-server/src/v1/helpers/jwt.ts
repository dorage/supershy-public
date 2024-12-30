import { sign, verify } from 'hono/jwt';
import moment from 'moment';
import * as crypto from 'node:crypto';

interface JWTUserPayload {
  userId: number;
}

const createToken = async ({
  payload,
  secret,
  algorithm,
}: {
  payload: JWTUserPayload;
  secret: string;
  algorithm: 'HS256' | 'HS384' | 'HS512';
}) => {
  const iat = crypto.randomUUID();
  const nbf = moment().utc(false);
  const accessExp = moment().utc(false).add(180, 'd');
  const refreshExp = moment().utc(false).add(360, 'd');
  const acessTokenPayload = {
    // exp: The token is checked to ensure it has not expired.
    exp: accessExp,
    // nbf: The token is checked to ensure it is not being used before a specified time.
    nbf,
    // iat: The token is checked to ensure it is not issued in the future.
    iat,
    ...payload,
  };
  const refreshTokenPayload = {
    // exp: The token is checked to ensure it has not expired.
    exp: refreshExp,
    // nbf: The token is checked to ensure it is not being used before a specified time.
    nbf,
    // iat: The token is checked to ensure it is not issued in the future.
    iat,
    ...payload,
  };

  return {
    iat,
    refreshExp,
    nbf,
    accessToken: await sign(acessTokenPayload, secret, algorithm),
    refreshToken: await sign(refreshTokenPayload, secret, algorithm),
  };
};

const JWTHelper = {
  createToken,
  verifyToken: verify,
};

export default JWTHelper;
