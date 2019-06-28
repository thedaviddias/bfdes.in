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

// Injected by Webpack
declare const __isBrowser__: boolean
