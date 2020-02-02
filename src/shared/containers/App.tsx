import * as React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { About, NoMatch, Sidebar } from "../components/";
import * as Components from "../components";
import { withSlug, withTag, withClient } from "../hocs";

const App: React.FC = () => {
  const PostOr404 = withSlug(withClient(Components.PostOr404));
  const Posts = withTag(withClient(Components.Posts));
  return (
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
          <Route path="/posts/:slug">
            <PostOr404 />
          </Route>
          <Route path="/posts">
            <Posts />
          </Route>
          <Route>
            <NoMatch />
          </Route>
        </Switch>
      </div>
    </>
  );
};

export default App;
