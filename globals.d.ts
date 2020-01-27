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

// Declarations for TypeScript compatibility with Webpack, Jest
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

declare namespace NodeJS {
  interface Global {
    __isBrowser__: boolean;
  }
}

declare interface Window {
  __isBrowser__: boolean;
  __INITIAL_DATA__: Payload;
}
