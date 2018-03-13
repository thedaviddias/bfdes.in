export const parseDate = (timestamp: number) => {
  const date = new Date(1000*timestamp)
  const options = {year: 'numeric', month: 'long', day: 'numeric'}
  return date.toLocaleDateString('en-gb', options)
}

export type Post = {title: string, wordCount: number, body: string, tags: string[], created: number}
export type Posts = {[s: string]: Post}
