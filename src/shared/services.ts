import { Post, Posts } from './utils'

export default (posts: Posts) => ({
  fetchPosts: (tag: string, limit: number) => {
    const asArray = Object.keys(posts)
      .map(slug => {
        const { body, ...rest } = posts[slug]
        return {slug, ...rest}
      })
    return asArray
      .filter(post => tag == null || tag in post.tags)
      .sort((a, b) => b.created - a.created)
      .slice(0, limit == null ? asArray.length : limit)
  },
  fetchPost: (slug: string) =>
    posts[slug] === undefined ? null : posts[slug]
})
