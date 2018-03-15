import { Router } from 'express'
import conn from '../../shared/services'

const router = Router()

// GET /posts
// Fetch all the posts in chronological order and filter by query params
router.get('/posts', (req, res, next) => {
  const { tag } = req.query
  const Post = conn(req.app.get('posts'))
  res.status(200).json(Post.fetchPosts(tag))
})


// GET /posts/<slug>
// Fetch a single post; these are uniquely identfied by their slugs
router.get('/posts/:slug', (req, res, next) => {
  const { slug } = req.params
  const Post = conn(req.app.get('posts'))
  const postOrNone = Post.fetchPost(slug)
  if(postOrNone != null) {
    res.status(200).json(postOrNone)
  } else {
    res.status(400).json({
      error: {
        message: "404: No post with that slug"
      }
    })
  }
})

export default router
