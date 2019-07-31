import * as React from "react";

import {
  Redirect,
  Route,
  Switch,
} from "react-router-dom";

import {
  About,
  NoMatch,
  PostOr404,
  Posts,
  Sidebar,
} from "../components/";

import {
  withHTTPClient,
  withSlug,
  withTag,
} from "../hocs";

export default () => (
  <>
    <Route path="/" component={Sidebar} />
    <div id="content">
      <Switch>
        <Route exact path="/" render={() => <Redirect to="/posts" />} />
        <Route exact path="/about" component={About} />
        <Route exact path="/posts" component={withTag(withHTTPClient(Posts))} />
        <Route exact path="/posts/:slug" component={withSlug(withHTTPClient(PostOr404))} />
        <Route component={NoMatch} />
      </Switch>
    </div>
  </>
);
