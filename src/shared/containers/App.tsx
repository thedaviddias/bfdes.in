import * as React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { About, NoMatch, PostOr404, Posts, Sidebar } from "../components/";
import { withSlug, withTag } from "../hocs";

type Props = {
  get<P>(url: string): Promise<P>;
};

function App(props: Props): React.ReactElement {
  const { get } = props;
  function withClient(Component: React.SFC<Props | object>) {
    return function WithClient(rest: object): React.ReactElement {
      if (Component instanceof Posts) {
        return <Component get={get} {...rest} />;
      }
      if (Component instanceof PostOr404) {
        return <Component get={get} {...rest} />;
      }
    };
  }
  return (
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
}

export default App;
