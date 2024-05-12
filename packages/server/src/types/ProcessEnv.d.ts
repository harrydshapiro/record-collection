declare namespace NodeJS {
  export interface ProcessEnv {
    PORT: string;
    NODE_ENV: string;
    DATABASE_URL: string;
    SPOTIFY_CLIENT_ID: string;
    SPOTIFY_CLIENT_SECRET: string;
    FROM_NUMBER: string;
    HOST: string;
    MPD_PORT: string;
  }
}
