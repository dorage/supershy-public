import { HTTPException } from 'hono/http-exception';
import { createGoogleJWT } from './google-jwt';

interface GoogleTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  token_type: string;
  id_token: string;
}

interface GoogleRefreshResponse {
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
}

export interface GoogleUserResponse {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  email_verified: boolean;
  locale: string;
}

interface ProductPurchase {
  kind: string;
  purchaseTimeMillis: string;
  purchaseState: number;
  consumptionState: number;
  developerPayload: string;
  orderId: string;
  purchaseType: number;
  acknowledgementState: number;
  purchaseToken: string;
  productId: string;
  quantity: number;
  obfuscatedExternalAccountId: string;
  obfuscatedExternalProfileId: string;
  regionCode: string;
}

const getServiceToken = async () => {
  const query = new URLSearchParams();
  query.append('grant_type', 'urn:ietf:params:oauth:grant-type:jwt-bearer');
  query.append('assertion', createGoogleJWT());

  const res = await fetch(`https://oauth2.googleapis.com/token?${query.toString()}`, {
    method: 'POST',
  });
  const data = (await res.json()) as GoogleTokenResponse;
  return data.access_token;
};

const validateReciept = async (props: { productId: string; iapToken: string }) => {
  const accessToken = await getServiceToken();
  const packageName = process.env.PACKAGE_NAME;
  const apiKey = process.env.GOOGLE_API_KEY;
  const res = await fetch(
    `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${packageName}/purchases/products/${props.productId}/tokens/${props.iapToken}:consume?key=${apiKey}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
    }
  );
  const data = (await res.json()) as ProductPurchase;
  return data;
};

const consumeProduct = async (props: { productId: string; iapToken: string }) => {
  const accessToken = await getServiceToken();
  const packageName = process.env.PACKAGE_NAME;
  const apiKey = process.env.GOOGLE_API_KEY;
  const res = await fetch(
    `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${packageName}/purchases/products/${props.productId}/tokens/${props.iapToken}:consume?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
    }
  );
  return res.status === 200;
};

const getUserToken = async (code: string) => {
  const query = new URLSearchParams();
  query.append('code', code);
  query.append('client_id', process.env.GOOGLE_API_CLIENT_ID);
  query.append('client_secret', process.env.GOOGLE_API_CLIENT_SECRET);
  query.append('grant_type', 'authorization_code');

  const res = await fetch(`https://oauth2.googleapis.com/token?${query.toString()}`, {
    method: 'POST',
  });
  const data = (await res.json()) as GoogleTokenResponse;
  if (data?.access_token == null)
    throw new HTTPException(401, { message: 'google auth code is wrong' });
  return data;
};

const refresh = async (refreshToken: string) => {
  const query = new URLSearchParams();
  query.append('refresh_token', refreshToken);
  query.append('client_id', process.env.GOOGLE_API_CLIENT_ID);
  query.append('client_secret', process.env.GOOGLE_API_CLIENT_SECRET);
  query.append('grant_type', 'refresh_token');

  const res = await fetch(`https://oauth2.googleapis.com/token?${query.toString()}`, {
    method: 'POST',
  });
  const data = (await res.json()) as GoogleRefreshResponse;
  if (data?.access_token == null)
    throw new HTTPException(401, { message: 'google auth code is wrong' });
  return data.access_token;
};

const getProfile = async (accessToken: string) => {
  const res = await fetch(
    `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`
  );
  const data = (await res.json()) as GoogleUserResponse;
  if (res.status !== 200)
    throw new HTTPException(401, { message: 'google access token is not validated' });
  return data;
};

const GoogleHelper = {
  refresh,
  getProfile,
  getUserToken,
  validateReciept,
  consumeProduct,
};

export default GoogleHelper;

// /**
//  * required useUser before
//  * @returns
//  */
// export const useGoogleAPI = () => {
//   return createMiddleware<SuperShyEnv>(async (c, next) => {
//     const oauth2Client = new google.auth.OAuth2();
//     const user = c.get('auth_userSchema');

//     oauth2Client.on('tokens', async (tokens) => {
//       if (tokens.refresh_token) {
//         // store the refresh_token in my database!
//         await Ky
//           .updateTable('users')
//           .set({ auth: sql`JSON_REPLACE(auth, '$.google_refresh', ${tokens.refresh_token})` })
//           .where('id', '=', user.id)
//           .execute();
//       }
//     });
//     oauth2Client.setCredentials({ refresh_token: user.auth.google_refresh });

//     const res = await oauth2Client.getAccessToken();
//     const googleToken = res.token;

//     if (googleToken == null) throw new HTTPException(403, { message: 'Google login had expired' });

//     c.set('auth_googleToken', googleToken);

//     await next();
//   });
// };
