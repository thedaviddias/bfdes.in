import * as React from 'react';
import { NavLink } from 'react-router-dom';

export default () => (
  <aside id='sidebar'>
    <img className='avatar' src={require('../images/avatar.jpg')} alt='Profile photo'></img>
    <div id='nav'>
      <NavLink to='/posts' className='nav-item' activeClassName='active'><h2>Blog</h2></NavLink>
      <NavLink to='/about' className='nav-item' activeClassName='active'><h2>About</h2></NavLink>
    </div>
  </aside>
)
