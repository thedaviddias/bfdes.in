import * as React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { About, NoMatch, PostOr404, Posts, Sidebar } from "../components/";
import { withSlug, withTag, withClient } from "../hocs";

const App: React.FC = () => (
  <>
    <Route path="/" component={Sidebar} />
    <div id="content">
      <Switch>
        <Redirect exact from="/" to="/posts" />
        <Route exact path="/about" component={About} />
        <Route exact path="/posts" component={withTag(withClient(Posts))} />
        <Route
          exact
          path="/posts/:slug"
          component={withSlug(withClient(PostOr404))}
        />
        <Route component={NoMatch} />
      </Switch>
    </div>
  </>
);

export default App;
