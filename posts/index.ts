import { parse } from "path";

const context = require.context(".", false, /\.md$/);

export default context.keys().map(filePath => {
  const slug = parse(filePath).name;
  const post = context(filePath);
  return { ...post, slug };
});
