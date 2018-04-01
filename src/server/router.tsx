import { Router } from 'express'
import * as React from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter, matchPath } from 'react-router-dom'
import { ServerStyleSheet } from 'styled-components' 

import App from '../shared/containers/App'
import conn from '../shared/services'

const router = Router()

const markupForRoute = (url: string, data: any) => {
  const sheet = new ServerStyleSheet()
  const markup = renderToString(sheet.collectStyles(
    <StaticRouter location={url} context={{ data }}>
      <App />
    </StaticRouter>
  )) 
  const styleTags = sheet.getStyleTags()
  return (
    `
      <!DOCTYPE html>
      <html>
        <head>
          <title>BFdes blog</title>
          <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet">
          <link href="https://unpkg.com/highlight.js/styles/github.css" rel="stylesheet">
          ${styleTags}
          <script src='/bundle.js' defer></script>
          <script>window.__INITIAL_DATA__ = ${JSON.stringify(data)}</script>
        </head>
        <body>
          <div id="root">${markup}</div>
        </body>
      </html>
    `
  )
}

// GET /api/posts?tag=<tag>
// Fetch all the posts in chronological order and filter by tag if supplied
router.get('/api/posts', (req, res) => {
  const { tag } = req.query
  const Post = conn(req.app.get('posts'))
  res.status(200).json(Post.fetchPosts(tag))
})


// GET /api/posts/<slug>
// Fetch a single post; these are uniquely identfied by their slugs
router.get('/api/posts/:slug', (req, res) => {
  const { slug } = req.params
  const Post = conn(req.app.get('posts'))
  const postOrNone = Post.fetchPost(slug)
  if(postOrNone != null) {
    res.status(200).json(postOrNone)
  } else {
    res.status(404).json({
      error: {
        message: "404: No post with that slug"
      }
    })
  }
})

// GET / is an alias for GET /posts
router.get('/', (req, res) => {
  const Post = conn(req.app.get('posts'))
  const data = Post.fetchPosts()
  res.send(markupForRoute(req.url, data))
})

// GET /about
router.get('/about', (req, res) => {
  res.send(markupForRoute(req.url, {}))
})

// GET /posts?tag=<tag>
router.get('/posts', (req, res) => {
  const Post = conn(req.app.get('posts'))
  const { tag } = req.query
  const data = Post.fetchPosts(tag)
  res.send(markupForRoute(req.url, data))
})

// GET /posts/<slug>
router.get('/posts/:slug', (req, res) => {
  const Post = conn(req.app.get('posts'))
  const { slug } = req.params
  const data = Post.fetchPost(slug)
  res.send(markupForRoute(req.url, data))
})

// 404 handler
router.get('*', (req, res) => {
  res.send(markupForRoute(req.url, {}))
})

export default router
