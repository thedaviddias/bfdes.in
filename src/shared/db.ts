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

  all(tag?: string, offset: number = 0, limit: number = 10) {
    const start = Math.max(offset, 0)
    const end = start + Math.max(limit, 0)
    return this.posts
      .filter(p => tag == undefined || p.tags.includes(tag))
      .slice(start, end)
  }
  
  get(slug: string) {
    const i = this.index[slug]
    return this.posts[i]
  }
}
