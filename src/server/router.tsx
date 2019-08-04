import { Router } from "express";
import * as React from "react";
import { renderToNodeStream } from "react-dom/server";
import { StaticRouter } from "react-router";

import { App, Context } from "shared/containers";
import DB from "shared/db";
import { get } from "shared/http";

const header = (initialData: any) =>
  `
    <meta charset="utf8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Personal blog">
    <meta name="author" content="Bruno Fernandes">
    <title>bfdes.in</title>
    <link href=${require("../shared/images/favicon.png")} rel="icon">
    <link href="/static/styles/main.css" rel="stylesheet">
    <script src='/static/javascripts/bundle.js' defer></script>
    <script>window.__INITIAL_DATA__ = ${JSON.stringify(initialData)}</script>
  `;

export default function(db: DB) {
  const router = Router();

  // GET / is an alias for GET /posts
  router.get("/", (_, res) => {
    res.redirect("/posts");
  });

  // GET /posts?tag=<tag>
  router.get("/posts", (req, res) => {
    const { tag } = req.query;
    const posts = db.all(tag);

    const stream = renderToNodeStream(
      <StaticRouter location={req.url} context={{}}>
        <Context.PostStub.Provider value={posts}>
          <App get={get} />
        </Context.PostStub.Provider>
      </StaticRouter>,
    );

    res.write(`<!DOCTYPE html><html lang="en"><head>${header(posts)}</head><body><div id="root">`);
    stream.pipe(res, {end: false});
    stream.on("end", () => res.end("</div></body></html>"));
  });

  // GET /posts/<slug>
  router.get("/posts/:slug", (req, res) => {
    const { slug } = req.params;
    const postOrNone = db.get(slug);

    const stream = renderToNodeStream(
      <StaticRouter location={req.url} context={{}}>
        <Context.Post.Provider value={postOrNone}>
          <App get={get} />
        </Context.Post.Provider>
      </StaticRouter>,
    );

    res.write(`<!DOCTYPE html><html lang="en"><head>${header(postOrNone)}</head><body><div id="root">`);
    stream.pipe(res, {end: false});
    stream.on("end", () => res.end("</div></body></html>"));
  });

  // GET /api/posts?tag=<tag>
  // Fetch the posts in chronological order and filter by tag if supplied
  router.get("/api/posts", (req, res) => {
    const { tag } = req.query;
    const posts = db.all(tag);
    res.status(200).json(posts);
  });

  // GET /api/posts/<slug>
  // Fetch a single post; these are uniquely identfied by their slugs
  router.get("/api/posts/:slug", (req, res) => {
    const { slug } = req.params;
    const postOrNone = db.get(slug);
    if (postOrNone) {
      res.status(200).json(postOrNone);
    } else {
      res.status(404).json({
        error: {
          message: "404: No post with that slug",
        },
      });
    }
  });

  // GET /feed.rss
  router.get("/feed.rss", (req, res) => {
    const recentPosts = db.all().slice(0, 10);
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
              <description>${post.summary}</description>
              <link>${url}</link>
              <guid>${url}</guid>
              <pubDate>${date.toUTCString()}</pubDate>
            </item>`
          );
        }).join("")}
      </channel>
    </rss>`.replace(/\>\s+\</g, "><");  // Get rid of newlines between sets of tags
    res.status(200);
    res.type("application/xml");
    res.send(markup);
  });

  // 404 handler
  router.get("*", (req, res) => {
    const stream = renderToNodeStream(
      <StaticRouter location={req.url} context={{}}>
        <App get={get} />
      </StaticRouter>,
    );
    res.status(404);
    res.write(`<!DOCTYPE html><html lang="en"><head>${header(null)}</head><body><div id="root">`);
    stream.pipe(res, {end: false});
    stream.on("end", () => res.end("</div></body></html>"));
  });
  return router;
}
