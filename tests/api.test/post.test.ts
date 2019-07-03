import * as request from "supertest";
import factory from "../../src/server";

const posts = [{
  title: "My first post",
  slug: "my-first-post",
  body: "Lorem ipsum delorum sit amet",
  created: 1523401300000,
  tags: ["Algorithms", "Java"],
  wordCount: 5,
}, {
  title: "My second post",
  slug: "my-second-post",
  body: "Lorem ipsum delorum sit amet",
  created: 1523401300000,
  tags: ["Java"],
  wordCount: 5,
}, {
  title: "My third post",
  slug: "my-third-post",
  body: "Lorem ipsum delorum sit amet",
  created: 1523401300000,
  tags: ["Python"],
  wordCount: 5,
}];

const app = factory(posts);

describe("GET /posts/:slug", () => {
  test("post can be fetched by slug", () => {
    const post = posts[0];
    request(app)
      .get(`/api/posts/${post.slug}`)
      .expect(200);
  });

  test("404 response returned for non-existent post", () =>
    request(app)
      .get("/api/posts/my-fourth-post")
      .expect(404)
      .then((res) =>
        expect(res.body).toEqual({
          error: {
            message: "404: No post with that slug",
          },
        }),
      ),
  );

  test("posts are paged", () => {
    const [first, second, third] = posts;
    request(app)
      .get(`/api/posts/${first.slug}`)
      .expect(200)
      .then((res) =>
        expect(res.body).toEqual({
          ...first,
          next: second.slug,
        }),
      );
    request(app)
      .get(`/api/posts/${second.slug}`)
      .expect(200)
      .then((res) =>
        expect(res.body).toEqual({
          ...second,
          previous: first.slug,
          next: third.slug,
        }),
      );
    request(app)
      .get(`/api/posts/${third.slug}`)
      .expect(200)
      .then((res) =>
        expect(res.body).toEqual({
          ...third,
          previous: second.slug,
        }),
      );
  });
});
