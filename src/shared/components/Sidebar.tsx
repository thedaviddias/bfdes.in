import * as React from 'react';
import { NavLink } from 'react-router-dom';

const avatar = require('../images/avatar.jpg')
const github = require('../images/github.png')
const rss = require('../images/rss.png')

export default () => (
  <aside id='sidebar'>
    <img className='avatar' src={avatar} alt='Profile photo' />
    <div id='nav'>
      <NavLink to='/posts' className='nav-item' activeClassName='active'>
        <h2>Blog</h2>
      </NavLink>
      <NavLink to='/about' className='nav-item' activeClassName='active'>
        <h2>About</h2>
      </NavLink>
    </div>
    <div id='social'>
      <a href='https://www.github.com/bfdes' className='nav-item'>
        <img className='badge' src={github} alt='GitHub link' />
      </a>
      <a href='/static/feed.rss' className='nav-item'>
        <img className='badge' src={rss} alt='RSS link' />
      </a>
    </div>
  </aside>
)
