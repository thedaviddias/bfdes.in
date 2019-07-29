const marked = require("marked");
const katex = require("katex");
const hljs = require("highlight.js");

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
    if (typeof lang === "undefined") {
      return code;
    } else if (lang === "math") {
      return katex.renderToString(code);
    } else {
      return hljs.highlight(lang, code).value;
    }
  },
});

module.exports = function(source) {
  const wordCount = content =>
    content.split("```")
      .filter((_, i) => i % 2 === 0)
      .map(block => block.split(" ").length)
      .reduce((total, count) => total + count, 0);
  
  const [meta, content] = source
    .split("# ----")
    .filter((_, i) => i !== 0)
    .map(_ => _.trim());
  
  const [title, tags, created] = meta
    .split(/[\r\n]+/)
    .map(l => l.split(":").pop().trim());
  
  return `module.exports = ${JSON.stringify({
    title,
    tags: tags.split(" "),
    created: Date.parse(created),
    wordCount: wordCount(content),
    body: marked(content),
  })}`;
}
