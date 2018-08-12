import { Router } from 'express'
import * as React from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router'
import { ServerStyleSheet } from 'styled-components' 

import { App, PostsContext, PostContext } from '../shared/containers'
import conn from '../shared/services'

const router = Router()

const headerFor = (styleTags: string, initialData: any) =>
  `
    <title>bfdes.in</title>
    <link href=${require('../shared/images/favicon.png')} rel="icon">
    <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet">
    <link href="https://unpkg.com/highlight.js/styles/github.css" rel="stylesheet">
    <link href="https://unpkg.com/katex/dist/katex.min.css" rel="stylesheet">
    ${styleTags}
    <script src='/static/bundle.js' defer></script>
    <script>window.__INITIAL_DATA__ = ${JSON.stringify(initialData)}</script>
  `

// GET / is an alias for GET /posts
router.get('/', (req, res) => {
  res.redirect('/posts')
})

// GET /posts?tag=<tag>
router.get('/posts', (req, res) => {
  const Post = conn(req.app.get('posts'))
  const { tag } = req.query
  const data = Post.fetchPosts(tag)

  const sheet = new ServerStyleSheet()
  const markup = renderToString(sheet.collectStyles(
    <StaticRouter location={req.url} context={{}}>
      <PostsContext.Provider value={data}>
        <App />
      </PostsContext.Provider>
    </StaticRouter>
  ))
  const styleTags = sheet.getStyleTags()

  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        ${headerFor(styleTags, data)}
      </head>
      <body>
        <div id="root">${markup}</div>
      </body>
    </html>
  `)
})

// GET /posts/<slug>
router.get('/posts/:slug', (req, res) => {
  const Post = conn(req.app.get('posts'))
  const { slug } = req.params
  const data = Post.fetchPost(slug)

  const sheet = new ServerStyleSheet()
  const markup = renderToString(sheet.collectStyles(
    <StaticRouter location={req.url} context={{}}>
      <PostContext.Provider value={data}>
        <App />
      </PostContext.Provider>
    </StaticRouter>
  ))
  const styleTags = sheet.getStyleTags()

  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        ${headerFor(styleTags, data)}
      </head>
      <body>
        <div id="root">${markup}</div>
      </body>
    </html>
  `)
})

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

// 404 handler
router.get('*', (req, res) => {
  const sheet = new ServerStyleSheet()
  const markup = renderToString(sheet.collectStyles(
    <StaticRouter location={req.url} context={{}}>
      <App />
    </StaticRouter>
  ))
  const styleTags = sheet.getStyleTags()

  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        ${headerFor(styleTags, {})}
      </head>
      <body>
        <div id="root">${markup}</div>
      </body>
    </html>
  `)
})

export default router
