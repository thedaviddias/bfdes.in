import * as React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { configure, mount } from 'enzyme'
const Adapter = require('enzyme-adapter-react-16')

import { Posts } from '../../src/shared/components'
import { Context } from '../../src/shared/containers';

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
const get = jest.fn(_ => mockPromise)

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
          <Context.PostStub.Provider value={fixture}>
            <Posts get={jest.fn()} />
          </Context.PostStub.Provider>
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
      const wrapper = mount(
        <MemoryRouter>
          <Posts get={get} />
        </MemoryRouter>
      )
      return mockPromise.then(() => {
        expect(wrapper.update().find('.post')).toHaveLength(2)
      })
    })

    it('fetches posts with the correct tag', () => {
      mount(
        <MemoryRouter>
          <Posts tag='Algorithms' get={get} />
        </MemoryRouter>
      )
      return mockPromise.then(() => {
        expect(get).toHaveBeenCalledWith('/api/posts?tag=Algorithms')
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
