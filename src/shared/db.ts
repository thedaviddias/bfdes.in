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

  all(tag?: string): Post[] {
    return this.posts
      .filter(p => tag == undefined || p.tags.includes(tag))
  }
  
  get(slug: string): Post {
    const index = this.index[slug]
    if(index == undefined) {
      return null  // Not found
    }
    let previous, next
    if(index > 0) {
      previous = this.posts[index-1].slug
    }
    if(index < this.posts.length-1) {
      next = this.posts[index+1].slug
    }
    return {
      previous,
      next,
      ...this.posts[index]
    }
  }
}
