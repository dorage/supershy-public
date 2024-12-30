interface ImportMetaEnv {
  readonly VITE_API_SERVER_HOST: string;
  readonly VITE_API_SERVER_HOST_NGROK: string;
  readonly VITE_GOOGLE_OAUTH_REDIRECT: string;
  readonly VITE_GOOGLE_OAUTH_SCOPE: string;
  readonly VITE_GOOGLE_OAUTH_CLIENT_ID: string;
  readonly VITE_DEV_AUTH_EMAIL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
