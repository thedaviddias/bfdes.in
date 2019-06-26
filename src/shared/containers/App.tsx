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

import {
  withSlug,
  withQueryParams,
  withHTTPClient
} from '../hocs';

export default () => (
  <>
    <Route path='/' component={Sidebar} />
    <div id="content">
      <Switch>
        <Route exact path='/' render={() => <Redirect to="/posts" />} />
        <Route exact path='/about' component={About} />
        <Route exact path='/posts' component={withQueryParams(withHTTPClient(Posts))} />
        <Route exact path='/posts/:slug' component={withSlug(withHTTPClient(PostOr404))} />
        <Route component={NoMatch} />
      </Switch>
    </div>
  </>
)
