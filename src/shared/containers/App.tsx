import * as React from 'react';

import { 
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
import { withSlug } from '../components/PostOr404'

import routes from '../routes'

class App extends React.Component {
  render() {
    return [
      <Route path='/' component={Sidebar} />,
      <div className='container'>
        <Switch>
          {routes.map(({ path, exact, component: Component, ...rest}, i) => 
            <Route key={i} path={path} exact={exact} render={props => <Component {...props} {...rest} />}/>
          )}
        </Switch>
      </div>
    ]
  }
}

export default App
