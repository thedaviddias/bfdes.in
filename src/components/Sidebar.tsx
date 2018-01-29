import * as React from 'react';
import { Link } from 'react-router-dom';

export default () => (
  <div className='sidebar'>
    <img></img>
    <ul>
      <li><Link to='/about'><h3>About</h3></Link></li>
      <li><Link to='/posts'><h3>Archive</h3></Link></li>
    </ul>
  </div>
)
