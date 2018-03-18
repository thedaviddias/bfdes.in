import * as React from 'react';
import { RouteProps } from 'react-router-dom'
import { Request } from 'express'

import {
  About,
  NoMatch,
  PostOr404,
  Posts,
  Sidebar
} from './components'

import { withTag } from './components/Posts'
import { withSlug } from './components/PostOr404'

import conn from './services'

type RouteConfig = RouteProps & {fetchInitialData?: (req: Request) => any}

const routes: RouteConfig[] = [
  {
    path: '/',
    component: Posts,
    exact: true,
    fetchInitialData: (req: Request) => {
      const Post = conn(req.app.get('posts'))
      return Post.fetchPosts()
    }
  },
  {
    path: '/about',
    component: About,
    exact: true
  },
  {
    path: '/posts/:slug',
    component: withSlug(PostOr404),
    exact: true,
    fetchInitialData: (req: Request) => {
      const Post = conn(req.app.get('posts'))
      const { slug } = req.params
      return Post.fetchPost(slug)
    }
  },
  {
    path: '/posts',
    component: withTag(Posts),
    exact: true,
    fetchInitialData: (req: Request) => {
      const Post = conn(req.app.get('posts'))
      const { tag } = req.query
      return Post.fetchPosts(tag)
    }
  },
  {
    component: NoMatch,
    exact: false
  }
]

export default routes
