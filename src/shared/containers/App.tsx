import * as React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { About, NoMatch, PostOr404, Posts, Sidebar } from "../components/";
import { withSlug, withTag, withClient } from "../hocs";

const App: React.FC = () => (
  <>
    <Route path="/">
      <Sidebar />
    </Route>
    <div id="content">
      <Switch>
        <Redirect exact from="/" to="/posts" />
        <Route path="/about">
          <About />
        </Route>
        <Route
          path="/posts/:slug"
          component={withSlug(withClient(PostOr404))}
        />
        <Route path="/posts" component={withTag(withClient(Posts))} />
        <Route path="*">
          <NoMatch />
        </Route>
      </Switch>
    </div>
  </>
);

export default App;
