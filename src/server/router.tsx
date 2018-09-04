import { Router } from 'express'
import * as React from 'react'
import { renderToNodeStream } from 'react-dom/server'
import { StaticRouter } from 'react-router'

import { App, Context } from '../shared/containers'
import conn from '../shared/services'

const router = Router()

const headerFor = (initialData: any) =>
  `
    <meta charset="utf8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1">
    <title>bfdes.in</title>
    <link href=${require('../shared/images/favicon.png')} rel="icon">
    <link href="/styles/main.css" rel="stylesheet">
    <link href="https://unpkg.com/highlight.js/styles/github.css" rel="stylesheet" defer>
    <link href="https://unpkg.com/katex/dist/katex.min.css" rel="stylesheet" defer>
    <script src='/javascripts/bundle.js' defer></script>
    <script>window.__INITIAL_DATA__ = ${JSON.stringify(initialData)}</script>
  `

// GET / is an alias for GET /posts
router.get('/', (_, res) => {
  res.redirect('/posts')
})

// GET /posts?tag=<tag>
router.get('/posts', (req, res) => {
  const Post = conn(req.app.get('posts'))
  const { tag } = req.query
  const data = Post.fetchPosts(tag)    
  
  const stream = renderToNodeStream(
    <StaticRouter location={req.url} context={{}}>
      <Context.PostStub.Provider value={data}>
        <App />
      </Context.PostStub.Provider>
    </StaticRouter>
  )

  res.write(`<html><head>${headerFor(data)}</head><body><div id="root">`)
  stream.pipe(res, {end: false})
  stream.on('end', () => res.end('</div></body></html>'))
})

// GET /posts/<slug>
router.get('/posts/:slug', (req, res) => {
  const Post = conn(req.app.get('posts'))
  const { slug } = req.params
  const data = Post.fetchPost(slug)

  const stream = renderToNodeStream(
    <StaticRouter location={req.url} context={{}}>
      <Context.Post.Provider value={data}>
        <App />
      </Context.Post.Provider>
    </StaticRouter>
  )

  res.write(`<html><head>${headerFor(data)}</head><body><div id="root">`)
  stream.pipe(res, {end: false})
  stream.on('end', () => res.end('</div></body></html>'))
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
  const stream = renderToNodeStream(
    <StaticRouter location={req.url} context={{}}>
        <App />
    </StaticRouter>
  )

  res.write(`<html><head>${headerFor(null)}</head><body><div id="root">`)
  stream.pipe(res, {end: false})
  stream.on('end', () => res.end('</div></body></html>'))
})

export default router
