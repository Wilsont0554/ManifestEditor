/// <reference types="vite/client" />

import type { DetailedHTMLProps, HTMLAttributes } from "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "voyager-explorer": DetailedHTMLProps<
        HTMLAttributes<HTMLElement> & {
          document?: string;
          prompt?: string;
        },
        HTMLElement
      >;
    }
  }
}
