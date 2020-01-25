import { mount, shallow } from "enzyme";
import * as React from "react";
import { MemoryRouter } from "react-router-dom";

import { PostOr404 } from "shared/components";
import { Context } from "shared/containers";
import { withSlug } from "shared/hocs";
import { RequestError } from "shared/http";

test("withSlug", () => {
  const slug = "my-first-post";
  const Component = withSlug(PostOr404);
  const match = {
    params: { slug },
    isExact: true,
    path: "/posts/:slug",
    url: `/posts/${slug}`
  };
  const wrapper = shallow(<Component match={match} />);
  expect(wrapper.prop("slug")).toBe(slug);
});

describe("<PostOr404 />", () => {
  const post = {
    title: "My first post",
    slug: "my-first-post",
    summary: "Lorem ipsum",
    body: "Lorem ipsum delorum sit amet",
    wordCount: 5,
    tags: ["Algorithms", "Java"],
    created: 1523401200000
  };

  describe("<PostOr404 /> on server", () => {
    beforeAll(() => {
      (global as any).__isBrowser__ = false;
    });

    it("displays post", () => {
      const wrapper = mount(
        <MemoryRouter>
          <Context.Post.Provider value={post}>
            <PostOr404 get={jest.fn()} slug="test" />
          </Context.Post.Provider>
        </MemoryRouter>
      );
      expect(wrapper.find(".post")).toHaveLength(1);
    });
  });

  describe("<PostOr404 /> on client", () => {
    beforeAll(() => {
      (global as any).__isBrowser__ = true;
    });

    it("fetches the correct post", () => {
      const { slug } = post;
      const mockPromise = Promise.resolve(post);
      const get = jest.fn(_ => mockPromise);

      mount(
        <MemoryRouter>
          <PostOr404 slug={slug} get={get} />
        </MemoryRouter>
      );
      return mockPromise.then(() => {
        expect(get).toHaveBeenCalledWith(`/api/posts/${slug}`);
      });
    });

    it("displays post", () => {
      const mockPromise = Promise.resolve(post);
      const get = jest.fn(_ => mockPromise);

      const wrapper = mount(
        <MemoryRouter>
          <PostOr404 get={get} slug="test" />
        </MemoryRouter>
      );
      return mockPromise.then(() => {
        expect(wrapper.update().find(".post")).toHaveLength(1);
      });
    });

    it("displays <NoMatch /> when post does not exist", () => {
      const err = new RequestError(404, "404: No post with that slug");
      const mockPromise = Promise.reject(err);
      const get = jest.fn(_ => mockPromise);

      const wrapper = mount(
        <MemoryRouter>
          <PostOr404 get={get} slug="test" />
        </MemoryRouter>
      );
      return mockPromise
        .then(() => {})
        .catch(() => {
          expect(wrapper.update().find(".fourOhFour")).toHaveLength(1);
        });
    });

    it("displays error message for failed request", () => {
      const mockPromise = Promise.reject(new Error());
      const get = jest.fn(_ => mockPromise);

      const wrapper = mount(
        <MemoryRouter>
          <PostOr404 get={get} slug="test" />
        </MemoryRouter>
      );
      return mockPromise
        .then(() => {})
        .catch(() => {
          expect(wrapper.update().find(".error")).toHaveLength(1);
        });
    });
  });
});
