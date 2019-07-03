import { configure, mount } from "enzyme";
import * as React from "react";
import { MemoryRouter } from "react-router-dom";
const Adapter = require("enzyme-adapter-react-16");

import { PostOr404 } from "../../src/shared/components";
import { Context } from "../../src/shared/containers";
import { RequestError } from "../../src/shared/http";

const post = {
  title: "My first post",
  slug: "my-first-post",
  body: "Lorem ipsum delorum sit amet",
  wordCount: 5,
  tags: ["Algorithms", "Java"],
  created: 1523401200000,
};

const mockPromise = Promise.resolve(post);
const get = jest.fn((_) => mockPromise);

beforeAll(() => {
  configure({adapter: new Adapter()});
});

describe("<PostOr404 />", () => {
  describe("<PostOr404 /> on server", () => {
    beforeAll(() => {
      (global as any).__isBrowser__ = false;
    });

    it("displays post", () => {
      const wrapper = mount(
        <MemoryRouter>
          <Context.Post.Provider value={post}>
            <PostOr404 get={jest.fn()} />
          </Context.Post.Provider>
        </MemoryRouter>,
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
      mount(
        <MemoryRouter>
          <PostOr404 slug={slug} get={get} />
        </MemoryRouter>,
      );
      return mockPromise.then(() => {
        expect(get).toHaveBeenCalledWith(`/api/posts/${slug}`);
      });
    });

    it("displays post", () => {
      const wrapper = mount(
        <MemoryRouter>
          <PostOr404 get={get} />
        </MemoryRouter>,
      );
      return mockPromise.then(() => {
        expect(wrapper.update().find(".post")).toHaveLength(1);
      });
    });

    it("displays <NoMatch /> when post does not exist", () => {
      const mockPromise = Promise.reject(new RequestError(404, "404: No post with that slug"));
      const get = jest.fn((_) => mockPromise);

      const wrapper = mount(
        <MemoryRouter>
          <PostOr404 get={get}/>
        </MemoryRouter>,
      );
      return mockPromise
        .then(() => {})
        .catch(() => {
          expect(wrapper.update().find(".fourOhFour")).toHaveLength(1);
        });
    });

    it("displays error message for failed request", () => {
      const mockPromise = Promise.reject(new Error());
      const get = jest.fn((_) => mockPromise);

      const wrapper = mount(
        <MemoryRouter>
          <PostOr404 get={get} />
        </MemoryRouter>,
      );
      return mockPromise
        .then(() => {})
        .catch(() => {
          expect(wrapper.update().find(".error")).toHaveLength(1);
        });
    });
  });
});
