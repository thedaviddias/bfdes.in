import * as React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { configure, mount } from 'enzyme'
const Adapter = require('enzyme-adapter-react-16')

import { Posts } from '../../src/shared/components'

type Post = {
  title: string,
  slug: string,
  wordCount: number,
  tags: string[]
  created: number
}

const fixture = [{
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

const mockPromise = Promise.resolve(fixture);

// It is not possible to mock named exports, so we mock the whole module and then unmock other utilities used by the component...
jest.mock('../../src/shared/utils', () => ({
  parseDate: require.requireActual('../../src/shared/utils').parseDate,
  delay: (promise: Promise<any>, interval: number) => promise,
  get: jest.fn()
}))

import { get } from '../../src/shared/utils'
import { PostsContext } from '../../src/shared/containers';

beforeAll(() => {
  configure({adapter: new Adapter()})
})

describe('<Posts />', () => {
  describe('<Posts /> on server', () => {
    beforeAll(() => {
      (global as any).__isBrowser__ = false
    })

    it('displays posts', () => {
      const wrapper = mount(
        <MemoryRouter>
          <PostsContext.Provider value={fixture}>
            <Posts />
          </PostsContext.Provider>
        </MemoryRouter>
      )
      expect(wrapper.find('.post')).toHaveLength(2)
    })
  })

  describe('<Posts /> on client', () => {
    beforeAll(() => {
      (global as any).__isBrowser__ = true
    })

    it('displays posts', () => {
      // n.b. Slightly concerned about race conditions here
      (get as jest.Mock<Promise<Post[]>>).mockReturnValue(mockPromise)
    
      const wrapper = mount(
        <MemoryRouter>
          <Posts />
        </MemoryRouter>
      )
      return mockPromise.then(() => {
        expect(wrapper.update().find('.post')).toHaveLength(2)
      })
    })

    it('fetches posts with the correct tag', () => {
      (get as jest.Mock<Promise<Post[]>>).mockReturnValue(mockPromise)

      const wrapper = mount(
        <MemoryRouter>
          <Posts tag='Algorithms' />
        </MemoryRouter>
      )
      // Unfortunately we have no option but to share the mock function across tests because of the way mocks are hoisted in Jest.
      // Hence this test is only accurate if no other test attempts to prime Posts with a tag of "Algorithms".
      return mockPromise.then(() => {
        expect(get).toHaveBeenCalledWith('/api/posts?tag=Algorithms')
      })
    })

    it('displays error message for failed request', () => {
      const mockPromise = Promise.reject(new Error);  // In reality we would get an instance of NetworkError but it doesn't matter here.
      (get as jest.Mock<Promise<Post[]>>).mockReturnValue(mockPromise)

      const wrapper = mount(
        <MemoryRouter>
          <Posts />
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
