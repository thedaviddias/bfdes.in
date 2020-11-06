import * as React from "react";
import { Route, Switch } from "react-router-dom";
import { About, NoMatch, Sidebar } from "../components";
import * as Components from "../components";
import { withSlug, withTag, withClient } from "../hocs";

type Props = {
  get<P>(url: string, signal: AbortSignal): Promise<P>;
};

const App: React.FC<Props> = ({ get }: Props) => {
  const PostOr404 = withSlug(withClient(Components.PostOr404, get));
  const Posts = withTag(withClient(Components.Posts, get));
  return (
    <>
      <Route path="/">
        <Sidebar />
      </Route>
      <div id="content">
        <Switch>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/posts/:slug">
            <PostOr404 />
          </Route>
          <Route exact path={["/", "/posts"]}>
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
