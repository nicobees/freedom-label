/// <reference types="vite/client" />

declare namespace JSX {
  interface IntrinsicElements {
    'rapi-doc': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    >;
  }
}