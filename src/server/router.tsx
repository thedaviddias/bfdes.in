import { Router } from 'express'
import * as React from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter, matchPath } from 'react-router-dom'
import routes from '../shared/routes'

import App from '../shared/containers/App'

import conn from '../shared/services'

const router = Router()

// GET /api/posts
// Fetch all the posts in chronological order and filter by query params
router.get('/api/posts', (req, res, next) => {
  const { tag } = req.query
  const Post = conn(req.app.get('posts'))
  res.status(200).json(Post.fetchPosts(tag))
})


// GET /api/posts/<slug>
// Fetch a single post; these are uniquely identfied by their slugs
router.get('/api/posts/:slug', (req, res, next) => {
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

router.get('*', (req, res, next) => {
  const activeRoute = routes.find(route => matchPath(req.url, route) != null)
  const data = activeRoute.fetchInitialData ? activeRoute.fetchInitialData(req) : {}
  const markup = renderToString(
    <StaticRouter location={req.url} context={{ data }}>
      <App />
    </StaticRouter>
  )

  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>BFdes blog</title>
        <script src='/bundle.js' defer></script>
      </head>
      <body>
        <div id="root">${markup}</div>
      </body>
    </html>
  `)
})

export default router
