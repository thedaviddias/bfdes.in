import * as fs from 'fs'
import * as path from 'path' 
import * as marked from 'marked'
import * as hljs from 'highlight.js'
import * as katex from 'katex'

marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: true,
  pedantic: true,
  sanitize: true,
  smartLists: true,
  smartypants: false,
  highlight: (code, lang) => {
    if(typeof lang == 'undefined') {
      return code
    } else if(lang == 'math') {
      return katex.renderToString(code)
    } else {
      return hljs.highlight(lang, code).value
    }
  }
})

function parseFile(path: string) {
  const parseMeta = (meta: string) =>
    meta.split(':').pop().trim()

  const toTimestamp = (date: string) => {
    const [year, month, day] = date.split('-').map(s => parseInt(s))
    return (new Date(year, month-1, day)).valueOf()
  }

  const parseMarkdown = (content: string) =>
    marked(content)

  const getWordCount = (content: string) =>
    content.split("```")
      .filter((_, i) => (i % 2 == 0))
      .reduce((total, block) => total + block.split(' ').length, 0)

  const [meta, content] = fs.readFileSync(path, 'utf8')
    .split('# ----')
    .filter((_, i) => i != 0)
    .map(_ => _.trim())

  const rest = meta.split(/[\r\n]+/)

  return {
    title: parseMeta(rest[0]),
    tags: parseMeta(rest[1]).split(' '),
    created: toTimestamp(parseMeta(rest[2])),
    body: parseMarkdown(content),
    wordCount: getWordCount(content)
  }
}

export function parse(dirname: string): Post[] {
  const filenames = fs.readdirSync(dirname).filter(f => /\.md$/.test(f))
  return filenames.map(filename => {
    const [slug, _] = filename.split('.')
    const post = parseFile(path.resolve(dirname, filename))
    return {slug, ...post }
  })
}

export function writeFeed(recentPosts: Post[]): void {
  const filename = './dist/static/feed.rss'
  const markup =
  `<?xml version="1.0" encoding="utf-8"?>
  <rss version="2.0">
    <channel>
      <title>bfdes.in</title>
      <link>https://www.bfdes.in</link>
      <description>Programming and Technology blog</description>
      ${recentPosts.map(post => {
        const date = new Date(post.created)
        const url = `https://www.bfdes.in/posts/${post.slug}`
        return (
          `<item>
            <title>${post.title}</title>
            <link>${url}</link>
            <guid>${url}</guid>
            <pubDate>${date.toUTCString()}</pubDate>
          </item>`
        )
      }).reduce((items, item) => items+item)}
    </channel>
  </rss>`.replace(/\>\s+\</g, '><')  // Get rid of newlines between sets of tags
  fs.writeFileSync(filename, markup)
}