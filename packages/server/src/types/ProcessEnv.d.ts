declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: string;
    HOST: string;
    MPD_PORT: string;
    LIBRARY_ROOT_PATH: string;
  }
}
