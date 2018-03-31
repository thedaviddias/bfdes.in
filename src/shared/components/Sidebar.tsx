import * as React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components'

const Sidebar = styled.aside`
  background-color: var(--dark);

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  img {
    width: 10rem;
    height: 10rem;
  }

  .nav {
    text-align: center;
    a {
      display: block
    }
  }
`
const StyledLink = styled(Link)`
  text-decoration: none;
  color: var(--white);
  &:hover, &:focus {
    text-decoration: bold
  }
  &:after {
    text-decoration: none
  }
`

export default () => (
  <Sidebar id='sidebar'>
    <img src={require('../images/avatar.jpg')}></img>
    <div className='nav'>
      <StyledLink to='/posts'><h2>Blog</h2></StyledLink>
      <StyledLink to='/about'><h2>About</h2></StyledLink>
    </div>
  </Sidebar>
)
