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

// Webpack image import interop
declare module '*.png' {
  const content: string
  export default content
}
declare module '*.jpg' {
  const content: string
  export default content
}
declare module '*.svg' {
  const content: string
  export default content
}

// Injected by Webpack
declare const __isBrowser__: boolean;
