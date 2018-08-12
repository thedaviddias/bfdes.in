import * as React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { configure, shallow, mount } from 'enzyme'
const Adapter = require('enzyme-adapter-react-16')

import Tags from '../../src/shared/components/Tags'

beforeAll(() => {
  configure({adapter: new Adapter()})
})

describe('<Tags />', () => {
  it('renders empty span for a post with no tags', () => {
    // Edge case
    const wrapper = shallow(<Tags tags={[]} />)
    expect(wrapper.find('Tag')).toHaveLength(0)
  })

  it('renders a single tag', () => {
    // Edge case
    const wrapper = shallow(<Tags tags={['Algorithms']} />)
    expect(wrapper.find('Tag')).toHaveLength(1)
  })

  it('renders multiple tags', () => {
    const wrapper = shallow(<Tags tags={['Algorithms', 'Python']} />)
    expect(wrapper.find('Tag')).toHaveLength(2)
  })

  test('<Tag /> navigates to correct route when clicked', () => {
    const wrapper = mount(
      <MemoryRouter>
        <Tags tags={['Algorithms', 'Python']}/>
      </MemoryRouter>
    );
    expect(wrapper
      .find('Link')
      .first()
      .props().to
    ).toBe('/posts?tag=Algorithms')
  })
})
