import app from "server/app";
import * as request from "supertest";

const summary = "Lorem ipsum";
const body = "Lorem ipsum delorum sit amet";
const created = 1523401300000;
const wordCount = 5;

const posts = [
  {
    title: "My first post",
    slug: "my-first-post",
    summary,
    body,
    created,
    tags: ["Algorithms", "Java"],
    wordCount
  },
  {
    title: "My second post",
    slug: "my-second-post",
    summary,
    body,
    created,
    tags: ["Java"],
    wordCount
  },
  {
    title: "My third post",
    slug: "my-third-post",
    summary,
    body,
    created,
    tags: ["Python"],
    wordCount
  }
];

const server = app(posts, "test");

describe("GET /api/posts/:slug", () => {
  test("post can be fetched by slug", () => {
    const post = posts[0];
    return request(server)
      .get(`/api/posts/${post.slug}`)
      .expect(200);
  });

  test("404 response returned for non-existent post", () =>
    request(server)
      .get("/api/posts/my-fourth-post")
      .expect(404)
      .then(res =>
        expect(res.body).toEqual({
          error: {
            message: "404: No post with that slug"
          }
        })
      ));

  test("posts are paged", () => {
    const [first, second, third] = posts;
    return Promise.all([
      request(server)
        .get(`/api/posts/${first.slug}`)
        .expect(200)
        .then(res =>
          expect(res.body).toEqual({
            ...first,
            previous: second.slug
          })
        ),
      request(server)
        .get(`/api/posts/${second.slug}`)
        .expect(200)
        .then(res =>
          expect(res.body).toEqual({
            ...second,
            previous: third.slug,
            next: first.slug
          })
        ),
      request(server)
        .get(`/api/posts/${third.slug}`)
        .expect(200)
        .then(res =>
          expect(res.body).toEqual({
            ...third,
            next: second.slug
          })
        )
    ]);
  });
});

describe("GET /posts/:slug", () => {
  beforeAll(() => {
    global.__isBrowser__ = false;
  });

  test("post can be fetched by slug", () => {
    const post = posts[0];
    return request(server)
      .get(`/posts/${post.slug}`)
      .expect(200);
  });

  test("404 response returned for non-existent post", () =>
    request(server)
      .get("/posts/my-fourth-post")
      .expect(404));
});
