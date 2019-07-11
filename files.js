const fs = require("fs");
const hljs = require("highlight.js");
const katex = require("katex");
const marked = require("marked");
const path = require("path");

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

function readPost(path) {
  const toTimestamp = dateString => {
    const [year, month, day] = dateString
      .split("-")
      .map(s => parseInt(s, 10));
    const date = new Date(year, month - 1, day);
    return date.valueOf();
  };

  const wordCount = content =>
    content.split("```")
      .filter((_, i) => i % 2 === 0)
      .reduce((total, block) => total + block.split(" ").length, 0);

  const [meta, content] = fs.readFileSync(path, "utf8")
    .split("# ----")
    .filter((_, i) => i !== 0)
    .map(_ => _.trim());

  const [title, tags, created] = meta
    .split(/[\r\n]+/)
    .map(l => l.split(":").pop().trim());

  return {
    title,
    tags: tags.split(" "),
    created: toTimestamp(created),
    body: marked(content),
    wordCount: wordCount(content),
  };
}

function readPosts(dirname) {
  const filenames = fs
    .readdirSync(dirname)
    .filter(filename => /\.md$/.test(filename));
  return filenames.map(filename => {
    const [slug, _] = filename.split(".");
    const post = readPost(path.resolve(dirname, filename));
    return { slug, ...post };
  });
}

function writeFeed(recentPosts) {
  const markup =
    `<?xml version="1.0" encoding="utf-8"?>
    <rss version="2.0">
    <channel>
      <title>bfdes.in</title>
      <link>https://www.bfdes.in</link>
      <description>Programming and Technology blog</description>
      ${recentPosts.map(post => {
        const date = new Date(post.created);
        const url = `https://www.bfdes.in/posts/${post.slug}`;
        return (
          `<item>
            <title>${post.title}</title>
            <link>${url}</link>
            <guid>${url}</guid>
            <pubDate>${date.toUTCString()}</pubDate>
          </item>`
        );
      }).join("")}
    </channel>
  </rss>`.replace(/\>\s+\</g, "><");  // Get rid of newlines between sets of tags
  fs.mkdirSync("./dist/static", { recursive: true })
  fs.writeFileSync("./dist/static/feed.rss", markup);
}

module.exports = {
  readPosts,
  writeFeed
}
