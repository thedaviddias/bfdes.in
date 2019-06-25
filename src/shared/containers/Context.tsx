import * as React from 'react'

export default {
  Post: React.createContext<Post>(null),
  PostStub: React.createContext<PostStub[]>(null)
} 
