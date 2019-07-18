import * as request from "supertest";
import express from "../../src/server";

const body = "Lorem ipsum delorum sit amet";
const wordCount = 5;

const posts = [{
  title: "My first post",
  slug: "my-first-post",
  body,
  created: 1523401300000,
  tags: ["Algorithms", "Java"],
  wordCount,
}, {
  title: "My second post",
  slug: "my-second-post",
  body,
  created: 1523487600000,
  tags: ["Java"],
  wordCount,
}];

const app = express(posts, "test");

describe("GET /posts", () => {
  test("all posts returned for GET /posts", () =>
    request(app)
      .get("/api/posts")
      .expect(200)
      .then(res => {
        expect(res.body.length).toBe(posts.length);
      }),
  );

  test("posts filtered by tag correctly", () => {
    const tag = "Algorithms";
    const filtered = posts.filter((p) => p.tags.includes(tag));
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
