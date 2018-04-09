import * as React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { configure, shallow, mount } from 'enzyme'
import * as Adapter from 'enzyme-adapter-react-16'

import { PostOr404 } from '../../src/shared/components'

type Post = {
  title: string,
  body: string,
  wordCount: number,
  tags: string[],
  created: number
}

const fixture = {
  title: 'My first post',
  body: 'Lorem ipsum delorum sit amet',
  wordCount: 5,
  tags: ['Algorithms', 'Java'],
  created: 1523401200000
}

const mockPromise = Promise.resolve(fixture)

jest.mock('../../src/shared/utils', () => ({
  parseDate: require.requireActual('../../src/shared/utils').parseDate,
  NetworkError: require.requireActual('../../src/shared/utils').NetworkError,
  delay: (promise: Promise<any>, interval: number) => promise,
  get: jest.fn()
}))

import { get, NetworkError } from '../../src/shared/utils'

beforeAll(() => {
  configure({adapter: new Adapter()})
})

describe('<PostOr404 />', () => {
  describe('<PostOr404 /> on server', () => {
    beforeAll(() => {
      (global as any).__isBrowser__ = false
    })

    it('displays post', () => {
      const wrapper = mount(
        <MemoryRouter>
          <PostOr404 staticContext={{data: fixture}}/>
        </MemoryRouter>
      )
      expect(wrapper.find('.post')).toHaveLength(1)
    })
  })

  describe('<PostOr404 /> on client', () => {
    beforeAll(() => {
      (global as any).__isBrowser__ = true
    })

    it('fetches the correct post', () => {
      (get as jest.Mock<Promise<Post>>).mockReturnValue(mockPromise)
      
      const wrapper = mount(
        <MemoryRouter>
          <PostOr404 slug='my-first-post'/>
        </MemoryRouter>
      )
      return mockPromise.then(() => {
        expect(get).toHaveBeenCalledWith('/api/posts/my-first-post')
      })
    })

    it('displays post', () => {
      (get as jest.Mock<Promise<Post>>).mockReturnValue(mockPromise)

      const wrapper = mount(
        <MemoryRouter>
          <PostOr404 />
        </MemoryRouter>
      )
      return mockPromise.then(() => {
        expect(wrapper.update().find('.post')).toHaveLength(1)
      })
    })

    it('displays <NoMatch /> when post does not exist', () => {
      const mockPromise = Promise.reject(new NetworkError(404, "404: No post with that slug"));
      (get as jest.Mock<Promise<Post>>).mockReturnValue(mockPromise)

      const wrapper = mount(
        <MemoryRouter>
          <PostOr404 />
        </MemoryRouter>
      )
      return mockPromise
        .then(() => {})
        .catch(() => {
          expect(wrapper.update().find('.fourOhFour')).toHaveLength(1)
        })
    })
    
    it('displays error message for failed request', () => {
      const mockPromise = Promise.reject(new Error);
      (get as jest.Mock<Promise<Post>>).mockReturnValue(mockPromise)

      const wrapper = mount(
        <MemoryRouter>
          <PostOr404 />
        </MemoryRouter>
      )
      return mockPromise
        .then(() => {})
        .catch(() => {
          expect(wrapper.update().find('.error')).toHaveLength(1)
        })
    })
  })
})
