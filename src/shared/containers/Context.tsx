import * as React from 'react'
import { Post, PostStub } from '../utils'

export default {
  Post: React.createContext<Post>(null),
  PostStub: React.createContext<PostStub[]>(null)
} 
