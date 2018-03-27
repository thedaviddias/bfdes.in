import * as React from 'react';

import { 
  Redirect,
  Route,
  Switch
} from 'react-router-dom';

import styled, { injectGlobal } from 'styled-components'

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

injectGlobal`
  html, body {
    margin: 0;
    height: 100%;

    --dark: #202020;
    --grey: #333;
    --light: #767676;
    --white: #fff;
    --blue: #4078c0;
    
    font-family: 'Roboto', sans-serif;
    line-height: 1.5;
    font-size: 14px;
    font-size: 1vw;
    color: var(--grey);
  }

  #root {
    display: grid;
    height: 100%;
    grid-template-columns: 20% 80%;
    grid-template-rows: auto;
    grid-template-areas: "sidebar content";
  }
`

const Wrapper = styled.div`
  padding: 4em;
`

class App extends React.Component {
  render() {
    return (
      <>
        <Route path='/' component={Sidebar} />
        <Wrapper id="content">
          <Switch>
            {routes.map(({ path, exact, component: Component, ...rest}, i) => 
              <Route key={i} path={path} exact={exact} render={props => <Component {...props} {...rest} />}/>
            )}
          </Switch>
        </Wrapper>
      </>
    )
  }
}

export default App
