declare interface PostStub {
  title: string,
  slug: string,
  wordCount: number,
  tags: string[],
  created: number
}

declare interface Post extends PostStub {
  body: string
}

declare const __isBrowser__: boolean  // Injected by Webpack to indicate whether we are running JS on the client or server
