declare namespace NodeJS {
    export interface ProcessEnv {
        PORT: string;
        NODE_ENV: string;
        DATABASE_URL: string;
        SPOTIFY_CLIENT_ID: string;
        SPOTIFY_CLIENT_SECRET: string;
        TWILIO_ACCOUNT_SID: string;
        TWILIO_AUTH_TOKEN: string;
        FROM_NUMBER: string;
        HOST: string;
    }
}
