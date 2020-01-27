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

declare type Payload = Post | PostStub[];

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

// Read-only flag set by Webpack
declare const __isBrowser__: boolean;

// Mutable flag set in Jest testing
declare namespace NodeJS {
  interface Global {
    __isBrowser__: boolean;
  }
}

// Data for deferred render supplied by the server 
declare interface Window {
  __INITIAL_DATA__: Payload;
}
