// Common types to be kept in sync on client and server
declare interface PostStub {
  title: string;
  slug: string;
  summary: string;
  wordCount: number;
  tags: string[];
  created: number;
}

declare interface Post extends PostStub {
  body: string;
  previous?: string;
  next?: string;
}

declare type InitialData = Post | PostStub[];

// Allows image import in TypeScipt
declare module "*.png" {
  const content: string;
  export default content;
}
declare module "*.jpg" {
  const content: string;
  export default content;
}
declare module "*.svg" {
  const content: string;
  export default content;
}

// Read-only build flag set by Webpack
declare const __isBrowser__: boolean;

// Mutable flag set in Jest test code
declare namespace NodeJS {
  interface Global {
    __isBrowser__: boolean;
  }
}

// Data for deferred render supplied by the server
declare interface Window {
  __INITIAL_DATA__: InitialData;
}
