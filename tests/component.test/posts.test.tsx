import * as React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { configure, mount } from 'enzyme'
const Adapter = require('enzyme-adapter-react-16')

import { Posts } from '../../src/shared/components'
import { Context } from '../../src/shared/containers';

const posts = [{
  title: 'My first post',
  slug: 'my-first-post',
  created: 1523401200000,
  tags: ['Algorithms', 'Java'],
  wordCount: 5
}, {
  title: 'My second post',
  slug: 'my-second-post',
  created: 1523487600000,
  tags: ['Java'],
  wordCount: 5
}]

const mockPromise = Promise.resolve(posts);
const get = jest.fn(_ => mockPromise)

beforeAll(() => {
  configure({adapter: new Adapter()})
})

describe('<Posts />', () => {
  beforeAll(() => {
    (global as any).__pagingRate__ = 5
  })
  describe('<Posts /> on server', () => {
    beforeAll(() => {
      (global as any).__isBrowser__ = false
    })

    it('displays posts', () => {
      const wrapper = mount(
        <MemoryRouter>
          <Context.PostStub.Provider value={posts}>
            <Posts get={jest.fn()} />
          </Context.PostStub.Provider>
        </MemoryRouter>
      )
      expect(wrapper.find('.post')).toHaveLength(posts.length)
    })
  })

  describe('<Posts /> on client', () => {
    beforeAll(() => {
      (global as any).__isBrowser__ = true
    })

    it('displays posts', () => {    
      const wrapper = mount(
        <MemoryRouter>
          <Posts get={get} />
        </MemoryRouter>
      )
      return mockPromise.then(() => {
        expect(wrapper.update().find('.post')).toHaveLength(posts.length)
      })
    })

    it('fetches posts with the correct tag', () => {
      const tag = 'Algorithms'
      mount(
        <MemoryRouter>
          <Posts tag={tag} get={get} />
        </MemoryRouter>
      )
      return mockPromise.then(() => {
        expect(get).toHaveBeenCalledWith(`/api/posts?tag=${tag}`)
      })
    })

    it('displays error message for failed request', () => {
      const mockPromise = Promise.reject(new Error);  // In reality we would get an instance of NetworkError but it doesn't matter here.
      const get = jest.fn(_ => mockPromise)

      const wrapper = mount(
        <MemoryRouter>
          <Posts get={get} />
        </MemoryRouter>
      )
      return mockPromise
        .then(() => {})
        .catch(() => {
          expect(wrapper.update().find('.error')).toHaveLength(1)
        })  // Ref. : https://github.com/airbnb/enzyme/issues/450#issuecomment-341244926
    })
  })
})
