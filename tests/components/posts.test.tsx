import { mount, shallow } from "enzyme";
import * as React from "react";
import { MemoryRouter } from "react-router-dom";

import { Posts } from "shared/components";
import { Context } from "shared/containers";
import { withTag } from "shared/hocs";
import { RequestError } from "shared/http";

const posts = [{
  title: "My first post",
  slug: "my-first-post",
  created: 1523401200000,
  tags: ["Algorithms", "Java"],
  wordCount: 5,
}, {
  title: "My second post",
  slug: "my-second-post",
  created: 1523487600000,
  tags: ["Java"],
  wordCount: 5,
}];

const mockPromise = Promise.resolve(posts);
const get = jest.fn(_ => mockPromise);

test("withTag", () => {
  const tag = "Python";
  const Component = withTag(Posts);
  const location = {
    search: `?tag=${tag}`,
  };
  const wrapper = shallow(
    <Component location={location} />,
  );
  expect(wrapper.prop("tag")).toBe(tag);
});

describe("<Posts />", () => {
  describe("<Posts /> on server", () => {
    beforeAll(() => {
      (global as any).__isBrowser__ = false;
    });

    it("displays posts", () => {
      const wrapper = mount(
        <MemoryRouter>
          <Context.PostStub.Provider value={posts}>
            <Posts get={jest.fn()} />
          </Context.PostStub.Provider>
        </MemoryRouter>,
      );
      expect(wrapper.find(".post")).toHaveLength(posts.length);
    });

    it("asks the reader to return", () => {
      const wrapper = mount(
        <MemoryRouter>
          <Context.PostStub.Provider value={[]}>
            <Posts get={jest.fn()} />
          </Context.PostStub.Provider>
        </MemoryRouter>,
      );
      expect(wrapper.find(".error")).toHaveLength(1);
    });
  });

  describe("<Posts /> on client", () => {
    beforeAll(() => {
      (global as any).__isBrowser__ = true;
    });

    it("displays posts", () => {
      const wrapper = mount(
        <MemoryRouter>
          <Posts get={get} />
        </MemoryRouter>,
      );
      return mockPromise.then(() => {
        expect(wrapper.update().find(".post")).toHaveLength(posts.length);
      });
    });

    it("asks the reader to return", () => {
      const mockPromise = Promise.resolve([]);
      const get = jest.fn(_ => mockPromise);
      const wrapper = mount(
        <MemoryRouter>
          <Posts get={get} />
        </MemoryRouter>,
      );
      return mockPromise.then(() => {
        expect(wrapper.update().find(".error")).toHaveLength(1);
      });
    });

    it("fetches posts with the correct tag", () => {
      const tag = "Algorithms";
      mount(
        <MemoryRouter>
          <Posts tag={tag} get={get} />
        </MemoryRouter>,
      );
      return mockPromise.then(() => {
        expect(get).toHaveBeenCalledWith(`/api/posts?tag=${tag}`);
      });
    });

    it("displays error message for failed request", () => {
      const mockPromise = Promise.reject(new RequestError(500, "Server Error"));
      const get = jest.fn(_ => mockPromise);

      const wrapper = mount(
        <MemoryRouter>
          <Posts get={get} />
        </MemoryRouter>,
      );
      return mockPromise
        .then(() => {})
        .catch(() => {
          expect(wrapper.update().find(".error")).toHaveLength(1);
        });  // Ref. : https://github.com/airbnb/enzyme/issues/450#issuecomment-341244926
    });
  });
});
