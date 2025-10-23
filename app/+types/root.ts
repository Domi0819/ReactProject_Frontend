// Minimal placeholder types for Route used by root.tsx
export interface Route {}

export namespace Route {
  export type LinksFunction = (...args: any[]) => any;
  export type ErrorBoundaryProps = { error?: any };
  export type MetaArgs = any;
}
