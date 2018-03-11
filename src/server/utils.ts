import * as fs from 'fs'
import * as path from 'path' 
import { createInterface } from 'readline'
import * as marked from 'marked'
import * as hljs from 'highlight.js'

marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: true,
  pedantic: true,
  sanitize: true,
  smartLists: true,
  smartypants: false,
  highlight: code => hljs.highlightAuto(code).value
})

export type Post = {title: string, wordCount: number, body: string, tags: string[], created: number}
export type Posts = {[s: string]: Post}

function parseFile(path: string): Post {
  const parseMeta = (meta: string) => meta.split(':').pop().trim()

  const toTimestamp = (date: string) => {
    const [year, month, day] = date.split('-').map(parseInt)
    return (new Date(year, month, day)).valueOf()
  }

  const parseMarkdown = (content: string) => marked(content)

  const getWordCount = (content: string) =>
    content.split("```")
      .filter((_, i) => (i % 2 == 0))
      .reduce((total, block) => total + block.split(' ').length, 0)

  const post: any = {}
  const buffer: string[] = []

  const r = createInterface({
    input: fs.createReadStream(path)
  })
  r.once('line', _ => {})
  r.once('line', l => {
    post.title = parseMeta(l)
  })
  r.once('line', l => {
    post.tags = parseMeta(l).split(' ')
  })
  r.once('line', l => {
    post.created = toTimestamp(parseMeta(l))
  })
  r.once('line', _ => {})
  r.on('line', l => buffer.push(l))
  r.on('close', () => {
    const content = buffer.join('\r\n')
    post.content = parseMarkdown(content)
    post.wordCount = getWordCount(content)
  })

  return post
}

export function parseFiles(dirname: string): Posts {
  const filenames = fs.readdirSync(dirname)
  return filenames.map(filename => {
    const [slug, _] = filename.split('.')
    return [slug, parseFile(path.resolve(dirname, filename))]
  }).reduce((others, post) => {
    const [slug, rest] = post
    return {slug: rest, ...others}
  }, {})
}
