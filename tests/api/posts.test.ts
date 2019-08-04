import express from "server";
import * as request from "supertest";

const summary = "Lorem ipsum";
const body = "Lorem ipsum delorum sit amet";
const wordCount = 5;

const posts = [{
  title: "My first post",
  slug: "my-first-post",
  summary,
  body,
  created: 1523401300000,
  tags: ["Algorithms", "Java"],
  wordCount,
}, {
  title: "My second post",
  slug: "my-second-post",
  summary,
  body,
  created: 1523487600000,
  tags: ["Java"],
  wordCount,
}];

const app = express(posts, "test");

describe("GET /", () => {
  test("root request redirected to /posts", () =>
    request(app)
      .get("/")
      .expect(302)
      .expect("Location", "/posts"),
  );
});

describe("GET /api/posts", () => {
  test("all posts returned", () =>
    request(app)
      .get("/api/posts")
      .expect(200)
      .then(res => {
        expect(res.body.length).toBe(posts.length);
      }),
  );

  test("posts filtered by tag correctly", () => {
    const tag = "Algorithms";
    const filtered = posts.filter(p => p.tags.includes(tag));
    return request(app)
      .get(`/api/posts?tag=${tag}`)
      .expect(200)
      .then(res =>
        expect(res.body.length).toBe(filtered.length),
      );
  });

  test("posts returned in sorted order", () => {
    const sorted = posts.sort((a, b) => b.created - a.created);
    return request(app)
      .get("/api/posts")
      .expect(200)
      .then(res =>
        expect(res.body).toEqual(sorted),
      );
  });
});

describe("GET /feed.rss", () => {
  test("posts returned in feed", () =>
    request(app)
      .get("/feed.rss")
      .expect(200)
      .then(res => {
        const tag = /\<item\>/g;
        const count = (res.text.match(tag) || []).length;
        return expect(count).toBe(posts.length);
      }),
  );
});
