import { Post, Posts } from './utils'

export default (posts: Posts) => ({
  fetchPosts: (tag?: string) => {
    const asArray = Object.keys(posts)
      .map(slug => {
        const { body, ...rest } = posts[slug]
        return {slug, ...rest}
      })
    return asArray
      .filter(post => tag == undefined || post.tags.includes(tag))
      .sort((a, b) => b.created - a.created)
  },
  fetchPost: (slug: string) =>
    posts[slug] === undefined ? null : posts[slug]
})
