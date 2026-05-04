/// <reference types="vite/client" />

import type * as React from "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "voyager-explorer": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        document?: string;
        prompt?: string | boolean;
      };
    }
  }
}
