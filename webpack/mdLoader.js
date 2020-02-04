const marked = require("marked");
const katex = require("katex");
const hljs = require("highlight.js");

marked.setOptions({
  renderer: new marked.Renderer(),
  highlight: (code, lang) => {
    if (hljs.getLanguage(lang)) {
      return hljs.highlight(lang, code).value;
    } else if (lang === "math") {
      return katex.renderToString(code);
    }
    return hljs.highlightAuto(code).value;
  },
  breaks: true
});

const metaRegex = /^\s*---(?<matter>[\s\S]*)---(?<content>[\s\S]*)$/
const rowRegex = /(?<key>\w+):\s*(?<value>[\w\s-!]+)\n+/g
const tagRegex = /(?<tag>\w+)/g

module.exports = function(source) {
  const { matter, content } = metaRegex.exec(source).groups

  const meta = Array
    .from(matter.matchAll(rowRegex))
    .map(match => match.groups)
    .reduce((map, {key, value}) => map.set(key, value.trim()), new Map())

  const tags = Array
    .from(meta.get("tags").matchAll(tagRegex))
    .map(match => match.groups.tag)

  const wordCount = content
    .split("```")
    .filter((_, i) => i % 2 === 0)
    .map(block => block.trim().split(/\s+/).length)
    .reduce((total, count) => total + count, 0);

  const created = Date.parse(meta.get("created"));

  return `module.exports = ${JSON.stringify({
    title: meta.get("title"),
    summary: meta.get("summary"),
    wordCount,
    tags,
    created,
    body: marked(content)
  })}`;
};
