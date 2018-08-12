import * as React from 'react'

type Post = {
  title: string,
  slug: string,
  wordCount: number,
  tags: string[],
  created: number
}

export default React.createContext<Post[]>(null)
