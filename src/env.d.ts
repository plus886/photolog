declare namespace App {
  interface Locals {
    lastCommitHash: string;
    lastCommitTime: string;
  }
}

namespace NodeJS {
  interface ProcessEnv {
    MICROCMS_DOMAIN: string;
    MICROCMS_API_KEY: string;
  }
}
