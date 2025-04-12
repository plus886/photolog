declare namespace App {
  interface Locals {
    lastCommitHash: string;
    lastCommitTime: string;
  }
}

interface FONTPLUS {
  reload: (init?: boolean) => void;
  isloading: () => boolean;
}

declare let FONTPLUS: FONTPLUS;

interface Window {
  FONTPLUS: FONTPLUS;
}

declare let window: Window;
