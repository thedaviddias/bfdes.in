declare type Post = {
  title: string,
  slug: string,
  wordCount: number,
  body: string,
  tags: string[],
  created: number
}

declare type PostStub = {
  title: string,
  slug: string,
  wordCount: number,
  tags: string[],
  created: number
}

declare const __isBrowser__: boolean  // Injected by Webpack to indicate whether we are running JS on the client or server
