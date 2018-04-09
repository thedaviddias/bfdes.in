import * as React from 'react'
import { Link, MemoryRouter } from 'react-router-dom'
import { configure, shallow, mount } from 'enzyme'
import * as Adapter from 'enzyme-adapter-react-16'

import { Posts } from '../../src/shared/components'
import Spinner from '../../src/shared/components/Spinner'

const mockPosts = [{
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

// It is not possible to mock named exports, so we mock the whole module and 
// then unmock other utilities used by the component
jest.mock('../../src/shared/utils', () => ({
  parseDate: require.requireActual('../../src/shared/utils').parseDate,
  delay: require.requireActual('../../src/shared/utils').delay,
  get: jest.fn((url: string) => Promise.resolve(mockPosts))
}))

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
          <Posts staticContext={{data: mockPosts}}/>
        </MemoryRouter>
      )
      expect(wrapper.find('.post')).toHaveLength(2)
    })
  })

  describe('<Posts /> on client', () => {
    beforeAll(() => {
      (global as any).__isBrowser__ = true
    })

    it('displays loading spinner', () => {
      const wrapper = shallow(<Posts />)
      expect(wrapper.find(Spinner)).toHaveLength(1)
    })

    it('displays posts', () => {
      const wrapper = mount(
        <MemoryRouter>
          <Posts />
        </MemoryRouter>
      )
      console.log(wrapper.text())
      // expect(wrapper.find('.post')).toHaveLength(2)
    })

    
  })
})
