import crypto from 'node:crypto';

const header = {
  alg: 'RS256',
  typ: 'JWT',
};

const toBase64URL = (json: any) => {
  const jsonString = JSON.stringify(json);
  const btyeArray = Buffer.from(jsonString);
  return btyeArray.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
};

export const createGoogleJWT = () => {
  const now = new Date().getTime() / 1000;
  const oneHour = 60 * 60;
  const expireTime = now + oneHour;

  //   const claimSet = {
  //     iss: '...iam.gserviceaccount.com',
  //     iat: now,
  //     exp: expireTime,
  //     scope: 'https://www.googleapis.com/auth/androidpublisher',
  //     aud: 'https://oauth2.googleapis.com/token',
  //   };
  const claimSet = {
    iss: 'validate-reciept@sekolah-392009.iam.gserviceaccount.com',
    scope: 'https://www.googleapis.com/auth/androidpublisher',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: expireTime,
  };
  const encodedHeader = toBase64URL(header);
  const encodedClaimSet = toBase64URL(claimSet);
  const signer = crypto.createSign('RSA-SHA256');
  signer.write(encodedHeader + '.' + encodedClaimSet);
  signer.end();
  const privateKey =
    '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCM4zY5OZnbokFs\nSyMC60TCOl9AC4oD0YM+vhjX96S6/oIoYrgN+8r6k0dR99rAjG7GE5MAzR+bJKx6\nQizQdGcgS2sQoajWYViEJEsiw2Gs5VLd1jTyrh8lvQkrUOSLgv4hLTK+6//7xDp6\nQfWTM9EI4S3m87WGrlIWGAA9eWXOA55YQNWcVBXbvLsBlv8WDc2aflx4CXXlrzEa\nrPt4JZNjaEYFUeEIbVXgjIjjjd231dFbNMD0eS3JUNQV5gJJZd8+FPqRKPW/3wl8\njk7q7mAb/iXSmOR2JCGRTwARZdVB2AKynlIupGsZhRN0UYgr9wYVS72jFfRUipTm\nBAn1fjwnAgMBAAECggEAAS2xX9JeIBrMwBjzM2xzLpcjm6FWrgHlpPO2heMmnjQ2\nZuh646fa72el+nomFH0Lb13tWXddyVCjaxsvzS3I4wzec2aQYMkY3w1MRGX5l8ml\nsAD0gActPLj54UJG9yFixzV3YQBDK7PDgKkZyPmilcsHm3cnnV3KuZaWNSCiO/i2\nmZmrRHgbrUOVc9wRx4/Erx5WhcxI0Zig0Xgz7Sus+G/ehFw9T0dZIpIP1mubH22A\neQ8X1hZUF0GlM5oX2orqeVW+WeaYrqicBSkbMQXl4pxK/j0hZdoOir2RGAo6uoy6\nx3OLTqnjOOw56RuSuEmoCTr6zMicBevZQHSw4NXAWQKBgQC+WN8VSBpgWWAvuYXT\nOy4KXi29tuxaEx8xUsswAj3XOe6iCoe8vtCB3RRWOudu2LIXRlsnUhCe+JoD2FMD\nJ3tr0LKFsytO1Gb74v8lrkrIvVNM9P7iny6L5A77T9OCEV3u72C0dDT9JPmIcvzU\nSd9ppCThR70re39FbA+bZKJqIwKBgQC9ezGG60JTpIQu5FsfgxsMUxfowRxCo0gr\noaxHyKdRoycBjJoabPueiQcvKiu8j9WZsO55+26LpZg+5LW206nn9mOhZYiiUVJg\npLUyJIA8oYytp6dwbfS/PU9ptvXOk3My90xkYQ6haXR1XjirurChWftqzcDTP0eo\nP2wCok9cLQKBgHvK1JrEn9LVjYa8Q1qS/Ghlw53EX4ZdNUYgsGBytMFKvfXIn2qT\nNoueumEyQd2HNJuKeDHkX0bkK1Yg1CwS+2OtAM2PLrU/0hIzGPjql1xiNNCx7Sp5\nmA4Gre+nhMjsfoisSdpSUTvpVhf1oJR3zsKnrAyPWWn0EVuW4beQBUi9AoGBAIiS\ndAdAKKVrDg9Sbs+Oyv8eITyVfA4X7JvuQuPWn6r7AtFeC3ECnnYNZE09gxq9PYMy\ngSEQ9gPXjp2+ca9ebreP4w3gxhPgs5SPAz8qCfgppOFB1zD1QBRbV5Ll2dRUeRMC\nJmCviEEVZmh2SjiVLlyOI+Y+eT6J/NcrJ2nanYLdAoGAUmili73PRjsY7fivVNhf\ngDL9TtfwG5Cbi+T16sqra+hQfUAcGSPwWDLaWmjEbcYP2Pl58ye/Z6FKucjzrq1T\n7HNo9iOxGGdXwQ4lArEoTRNZF+AKSETOHjUJjEcQl9pZmOm7iBFwzUHe3/TmofDO\ndPAm1LE8o4y3CiLBl1kzpYc=\n-----END PRIVATE KEY-----\n';
  const signature = signer.sign(privateKey, 'base64');
  const encodedSignature = signature.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  return `${encodedHeader}.${encodedClaimSet}.${encodedSignature}`;
};
