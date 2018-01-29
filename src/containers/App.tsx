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

import { withTag } from '../components/Posts'

class App extends React.Component {
  render() {
    return (
      <Router>
        <div className='container'>
          <Route path='/' component={Sidebar}/>
          <Switch>
            <Route path='/' exact render={() => <Posts limit={5}/>}/>
            <Route path='/about' exact component={About}/>
            <Route path='/posts/:slug' exact component={PostOr404}/>
            <Route path='/posts' component={withTag(Posts)}/>
            <Route component={NoMatch}/>
          </Switch>
        </div>
      </Router>
    )
  }
}

export default App
