type Index = {[slug: string]: number}

/**
 * In-memory database to query the posts.
 */
export default class DB {
  posts: Post[] // Posts in sorted order
  index: Index  // Index to query the posts by slug
  constructor(posts: Post[]) {
    this.posts = posts.sort((a, b) =>
      b.created - a.created
    )
    this.index = this.posts.reduce((index, post, i) =>
      ({...index, [post.slug]: i })
    , {})
  }

  all(tag?: string) {
    return this.posts.filter(post =>
      tag == undefined || post.tags.includes(tag)
    )
  }
  
  get(slug: string) {
    const i = this.index[slug]
    return this.posts[i]
  }
}
