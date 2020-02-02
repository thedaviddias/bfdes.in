import { Router } from "express";
import * as React from "react";
import { renderToNodeStream } from "react-dom/server";
import { StaticRouter } from "react-router";
import { parse } from "url";

import { App, Context } from "shared/containers";
import DB from "shared/DB";
import { Favicon } from "shared/images";
import { node, Attributes } from "./xml";
import Params from "shared/Params";

const header = (initialData: InitialData): string =>
  `
    <meta charset="utf8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="theme-color" content="#202020">
    <meta name="description" content="Personal blog">
    <meta name="author" content="Bruno Fernandes">
    <title>bfdes.in</title>
    <link href=${Favicon} rel="icon">
    <link href="/static/styles/main.css" rel="stylesheet">
    <script src='/static/javascripts/bundle.js' defer></script>
    <script>window.__INITIAL_DATA__ = ${JSON.stringify(initialData)}</script>
  `;

export default function(db: DB): Router {
  const router = Router();

  // GET / is an alias for GET /posts
  router.get("/", (_, res) => {
    res.redirect("/posts");
  });

  // GET /posts?offset=<offset>&limit=<limit>&tag=<tag>
  router.get("/posts", (req, res) => {
    const queryString = parse(req.url).search;
    const { limit, offset, tag } = Params.fromString(queryString);
    const posts = db.list(limit, offset, tag);

    const stream = renderToNodeStream(
      <StaticRouter location={req.url} context={{}}>
        <Context.Posts.Provider value={posts}>
          <App />
        </Context.Posts.Provider>
      </StaticRouter>
    );
    if (posts.length == 0 && queryString) {
      res.redirect("/posts"); // Rollover
    }

    res.write(
      `<!DOCTYPE html><html lang="en"><head>${header(
        posts
      )}</head><body><div id="root">`
    );
    stream.pipe(res, { end: false });
    stream.on("end", () => res.end("</div></body></html>"));
  });

  // GET /posts/<slug>
  router.get("/posts/:slug", (req, res) => {
    const { slug } = req.params;
    const postOrNone = db.get(slug);

    const stream = renderToNodeStream(
      <StaticRouter location={req.url} context={{}}>
        <Context.Post.Provider value={postOrNone}>
          <App />
        </Context.Post.Provider>
      </StaticRouter>
    );
    res.status(postOrNone ? 200 : 404);
    res.write(
      `<!DOCTYPE html><html lang="en"><head>${header(
        postOrNone
      )}</head><body><div id="root">`
    );
    stream.pipe(res, { end: false });
    stream.on("end", () => res.end("</div></body></html>"));
  });

  // GET /api/posts?offset=<offset>&limit=<limit>&tag=<tag>
  // Fetch the posts in chronological order and filter by tag if supplied
  router.get("/api/posts", (req, res) => {
    const queryString = parse(req.url).search;
    const { limit, offset, tag } = Params.fromString(queryString);
    const posts = db.list(limit, offset, tag);
    res.json(posts);
  });

  // GET /api/posts/<slug>
  // Fetch a single post; these are uniquely identfied by their slugs
  router.get("/api/posts/:slug", (req, res) => {
    const { slug } = req.params;
    const postOrNone = db.get(slug);
    if (postOrNone) {
      res.json(postOrNone);
    } else {
      res.status(404).json({
        error: {
          message: "404: No post with that slug"
        }
      });
    }
  });

  // GET /feed.rss
  router.get("/feed.rss", (_, res) => {
    const recentPosts = db.list();
    const title = node("title", "bfdes.in");
    const link = node("link", "https://www.bfdes.in");
    const description = node("description", "Programming and Technology blog");
    const items = recentPosts.map(({ created, slug, title, summary }) => {
      const date = new Date(created);
      const url = `https://www.bfdes.in/posts/${slug}`;
      return node("item", [
        node("title", title),
        node("author", "Bruno Fernandes"),
        node("description", summary),
        node("link", url),
        node("guid", url),
        node("pubDate", date.toUTCString())
      ]);
    });
    const channel = node("channel", [title, link, description, ...items]);
    const rss = node("rss", [channel], new Attributes([["version", "1.0"]]));
    const prolog = `<?xml version="1.0" encoding="utf-8"?>`;
    res.type("application/xml");
    res.send(`${prolog}${rss.render()}`);
  });

  // 404 handler
  router.get("*", (req, res) => {
    const stream = renderToNodeStream(
      <StaticRouter location={req.url} context={{}}>
        <App />
      </StaticRouter>
    );
    res.status(404);
    res.write(
      `<!DOCTYPE html><html lang="en"><head>${header(
        null
      )}</head><body><div id="root">`
    );
    stream.pipe(res, { end: false });
    stream.on("end", () => res.end("</div></body></html>"));
  });
  return router;
}
