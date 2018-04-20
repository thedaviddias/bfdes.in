import * as fs from 'fs'
import * as path from 'path' 
import { createInterface } from 'readline'
import * as marked from 'marked'
import * as hljs from 'highlight.js'
import * as katex from 'katex'

import { Post, Posts } from '../shared/utils'

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
    if(lang == 'math') {
      return katex.renderToString(code)
    }
    return hljs.highlightAuto(code).value
  }
})

function parseFile(path: string): Post {
  const parseMeta = (meta: string) => meta.split(':').pop().trim()

  const toTimestamp = (date: string) => {
    const [year, month, day] = date.split('-').map(s => parseInt(s))
    return (new Date(year, month, day)).valueOf()
  }

  const parseMarkdown = (content: string) => marked(content)

  const getWordCount = (content: string) =>
    content.split("```")
      .filter((_, i) => (i % 2 == 0))
      .reduce((total, block) => total + block.split(' ').length, 0)

  const [meta, content] = fs.readFileSync(path, 'utf8')
    .split('# ----')
    .filter((_, i) => i != 0)
    .map(_=> _.trim())

  const rest = meta.split(/[\r\n]+/)
    .reduce((post, l, i) => {switch(i) {
      case 0: return {title: parseMeta(l), ...post}
      case 1: return {tags: parseMeta(l).split(' '), ...post}
      case 2: return {created: toTimestamp(parseMeta(l)), ...post}
    }}, {} as Post)

  return {body: parseMarkdown(content), wordCount: getWordCount(content), ...rest}
}

export function parseFiles(dirname: string): Posts {
  const filenames = fs.readdirSync(dirname).filter(f => /\.md$/.test(f))
  return filenames.map(filename => {
    const [slug, _] = filename.split('.')
    return {[slug]: parseFile(path.resolve(dirname, filename))}
  }).reduce((others, post) => {
    return {...post, ...others}
  }, {})
}
