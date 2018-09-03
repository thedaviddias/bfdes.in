import * as React from 'react';

import { 
  Route,
  Switch,
  Redirect
} from 'react-router-dom';

import {
  Sidebar,
  About,
  PostOr404,
  Posts,
  NoMatch
} from '../components/';

import { withTag } from '../components/Posts'
import { withSlug } from '../components/PostOr404'

class App extends React.Component {
  render() {
    return (
      <>
        <Route path='/' component={Sidebar} />
        <div id="content">
          <Switch>
            <Route exact path='/' render={() => <Redirect to="/posts" />} />
            <Route exact path='/about' component={About} />
            <Route exact path='/posts' component={withTag(Posts)} />
            <Route exact path='/posts/:slug' component={withSlug(PostOr404)} />
            <Route component={NoMatch} />
          </Switch>
        </div>
      </>
    )
  }
}

export default App
