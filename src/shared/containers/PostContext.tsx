import * as React from 'react'

type Post = {
  title: string,
  body: string,
  wordCount: number,
  tags: string[],
  created: number
}

export default React.createContext<Post>(null)
