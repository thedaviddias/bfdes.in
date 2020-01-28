import app from "server/app";
import * as request from "supertest";

const summary = "Lorem ipsum";
const body = "Lorem ipsum delorum sit amet";
const wordCount = 5;

const posts = [
  {
    title: "My first post",
    slug: "my-first-post",
    summary,
    body,
    created: 1523401300000,
    tags: ["Algorithms", "Java"],
    wordCount
  },
  {
    title: "My second post",
    slug: "my-second-post",
    summary,
    body,
    created: 1523487600000,
    tags: ["Java"],
    wordCount
  }
];

const server = app(posts, "test");

describe("GET /", () => {
  test("root request redirected to /posts", () =>
    request(server)
      .get("/")
      .expect(302)
      .expect("Location", "/posts"));
});

describe("GET /api/posts", () => {
  test("all posts returned", () =>
    request(server)
      .get("/api/posts")
      .expect(200)
      .then(res => {
        expect(res.body.length).toBe(posts.length);
      }));

  test("posts filtered by tag", () => {
    const tag = "Algorithms";
    const filtered = posts.filter(p => p.tags.includes(tag));
    return request(server)
      .get(`/api/posts?tag=${tag}`)
      .expect(200)
      .then(res => expect(res.body.length).toBe(filtered.length));
  });

  test("posts returned in sorted order", () => {
    const sorted = posts
      .map(({ body, ...stub }) => stub)
      .sort((p, q) => q.created - p.created);
    return request(server)
      .get("/api/posts")
      .expect(200)
      .then(res => expect(res.body).toEqual(sorted));
  });
});

describe("GET /posts", () => {
  beforeAll(() => {
    global.__isBrowser__ = false;
  });
  test("all posts returned", () =>
    request(server)
      .get("/posts")
      .expect(200));

  test("posts filtered by tag", () => {
    const tag = "Algorithms";
    const filtered = posts.filter(p => p.tags.includes(tag));
    return request(server)
      .get(`/posts?tag=${tag}`)
      .expect(200)
      .then(res => {
        const elem = /<li class="post">/g;
        const count = (res.text.match(elem) || []).length;
        return expect(count).toBe(filtered.length);
      });
  });
});

describe("GET /feed.rss", () => {
  test("posts returned in feed", () =>
    request(server)
      .get("/feed.rss")
      .expect(200)
      .then(res => {
        const elem = /<item>/g;
        const count = (res.text.match(elem) || []).length;
        return expect(count).toBe(posts.length);
      }));
});
