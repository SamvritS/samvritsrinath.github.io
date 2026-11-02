// The <number-flow> intrinsic element, for the telemetry readout's digit roll.
// number-flow 0.6 is a custom element rather than a React wrapper, and React 19
// assigns custom element properties directly, so the element works in JSX once
// the tag is declared. troika's own declaration lives in
// types/troika-three-text.d.ts, which has to be a separate script file.
//
// The import below is load-bearing: it makes this file a module, and without it
// "declare module 'react'" is a fresh ambient declaration that REPLACES React's
// type surface rather than augmenting it, so every useState, useRef, and Suspense
// in the app stops resolving.
import type { DetailedHTMLProps, HTMLAttributes } from "react";

// number-flow 0.6 is a custom element, not a React wrapper. React 19 assigns
// custom element properties directly, so the element works in JSX, but its
// intrinsic element has to be declared for the type checker.
//
// Deliberately no value/format/locales/numberPrefix/numberSuffix: the element's
// own API is driven imperatively by components/telemetry-ticker.tsx, and
// declaring a prop the element cannot accept is how a getter-only `value`
// reached JSX and typecheck stayed green while the homepage threw.
declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "number-flow": DetailedHTMLProps<
        HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
}

