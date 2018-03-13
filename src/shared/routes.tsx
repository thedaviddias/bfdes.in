import * as React from 'react';
import { Request } from 'express'

import {
  About,
  NoMatch,
  PostOr404,
  Posts,
  Sidebar
} from './components'

import conn from './services'

const routes = [
  {
    path: '/',
    component: Posts,
    exact: true,
    fetchInitialData: (req: Request) => {
      const Post = conn(req.app.get('posts'))
      return Post.fetchPosts(null, 5)
    }
  },
  {
    path: '/about',
    component: About,
    exact: true
  },
  {
    path: '/posts/:slug',
    component: PostOr404,
    exact: true,
    fetchInitialData: (req: Request) => {
      const Post = conn(req.app.get('posts'))
      const { slug } = req.params
      return Post.fetchPost(slug)
    }
  },
  {
    path: '/posts',
    component: Posts,
    exact: true,
    fetchInitialData: (req: Request) => {
      const Post = conn(req.app.get('posts'))
      const { tag, limit } = req.query
      return Post.fetchPosts(tag, limit)
    }
  },
  {
    component: NoMatch,
    exact: false
  }
]

export default routes
