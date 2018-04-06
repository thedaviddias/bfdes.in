import * as React from 'react'
import { Link, MemoryRouter } from 'react-router-dom'
import { configure, shallow, mount, render } from 'enzyme'
import * as Adapter from 'enzyme-adapter-react-16'

import { PostOr404 } from '../../src/shared/components/'
import Spinner from '../../src/shared/components/Spinner'

const mockPost = {
  title: 'My first post',
  body: 'Lorem ipsum delorum sit amet',
  wordCount: 5,
  tags: ['Algorithms', 'Java'],
  created: 1523401200000
}

jest.mock('../../src/shared/utils', () => ({
  parseDate: require.requireActual('../../src/shared/utils').parseDate,
  delay: require.requireActual('../../src/shared/utils').delay,
  get: jest.fn((url: string) => Promise.resolve(mockPost))
}))

beforeAll(() => {
  configure({adapter: new Adapter()})
})

describe('<PostOr404 />', () => {
  describe('<PostOr404 /> on server', () => {
    beforeAll(() => {
      (global as any).__isBrowser__ = false
    })

    it('displays post on server', () => {
      const wrapper = mount(
        <MemoryRouter>
          <PostOr404 staticContext={{data: mockPost}}/>
        </MemoryRouter>
      )
      expect(wrapper.find('.post')).toHaveLength(1)
    })
  })
})
