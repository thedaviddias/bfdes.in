import * as React from 'react';

import { 
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch
} from 'react-router-dom';

import {
  Sidebar,
  About,
  PostOr404,
  Posts,
  NoMatch
} from '../components/';

class App extends React.Component {
  render() {
    return (
      <Router>
        <div className='container'>
          <Route path='/' component={Sidebar}/>
          <Switch>
            <Route path='/' exact component={Posts}/>
            <Route path='/about' exact component={About}/>
            <Route path='/posts/:slug' exact component={PostOr404}/>
            <Route path='/posts' component={Posts}/>
            <Route component={NoMatch}/>
          </Switch>
        </div>
      </Router>
    )
  }
}

export default App
