const marked = require("marked");
const katex = require("katex");
const hljs = require("highlight.js");

const languages = new Set(hljs.listLanguages());

marked.setOptions({
  renderer: new marked.Renderer(),
  highlight: (code, lang) => {
    if (languages.has(lang)) {
      return hljs.highlight(lang, code).value;
    } else if (lang === "math") {
      return katex.renderToString(code);
    }
    return hljs.highlightAuto(code).value;
  },
  breaks: true
});

module.exports = function(source) {
  const [meta, content] = source
    .split("---")
    .filter((_, i) => i !== 0)
    .map(content => content.trim());

  const [title, tags, created, summary] = meta.split(/[\r\n]+/).map(line =>
    line
      .split(":")
      .pop()
      .trim()
  );

  const wordCount = content
    .split("```")
    .filter((_, i) => i % 2 === 0)
    .map(block => block.split(" ").length)
    .reduce((total, count) => total + count, 0);

  return `module.exports = ${JSON.stringify({
    title,
    summary,
    wordCount,
    tags: tags.split(" "),
    created: Date.parse(created),
    body: marked(content)
  })}`;
};
