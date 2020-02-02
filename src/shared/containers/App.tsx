import * as React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { About, NoMatch, Sidebar } from "../components/";
import * as Components from "../components";
import { withSlug, withTag, withClient } from "../hocs";

type Props = {
  get<P>(url: string): Promise<P>;
};

const App: React.FC<Props> = ({ get }: Props) => {
  const PostOr404 = withSlug(withClient(get)(Components.PostOr404));
  const Posts = withTag(withClient(get)(Components.Posts));
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
