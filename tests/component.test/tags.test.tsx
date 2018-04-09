import * as React from 'react'
import { Link, MemoryRouter } from 'react-router-dom'
import { configure, shallow, mount } from 'enzyme'
import * as Adapter from 'enzyme-adapter-react-16'

import Tags from '../../src/shared/components/Tags'

beforeAll(() => {
  configure({adapter: new Adapter()})
})

describe('<Tags />', () => {
  it('renders empty span for a post with no tags', () => {
    const wrapper = shallow(<Tags tags={[]} />)
    expect(wrapper.find('span').text()).toBe('')
  })

  it('renders a single tag', () => {
    const wrapper = shallow(<Tags tags={['Algorithms']} />)
    expect(wrapper.find('span').text()).toBe(' # <Tag />')
  })

  it('renders multiple tags', () => {
    const wrapper = shallow(<Tags tags={['Algorithms', 'Python']} />)
    expect(wrapper.find('span').text()).toBe(' # <Tag /> # <Tag />')
  })

  test('<Tag /> navigates to correct route when clicked', () => {
    const wrapper = mount(
      <MemoryRouter>
        <Tags tags={['Algorithms', 'Python']}/>
      </MemoryRouter>
    );
    expect(wrapper
      .find(Link)
      .first()
      .props().to
    ).toBe('/posts?tag=Algorithms')
  })
})