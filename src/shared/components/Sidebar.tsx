import * as React from 'react';
import { NavLink } from 'react-router-dom';

export default () => (
  <aside id='sidebar'>
    <img className='avatar' src={require('../images/avatar.jpg')}></img>
    <div className='nav'>
      <NavLink to='/posts' activeClassName='active'><h2>Blog</h2></NavLink>
      <NavLink to='/about' activeClassName='active'><h2>About</h2></NavLink>
    </div>
  </aside>
)
