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
    height: 100%;
  }
`

const Wrapper = styled.div`
  display: grid
  grid-template-columns: 20vw auto;
  padding: 4em;

  div, ul {
    grid-column-start: 2;
  }
`

class App extends React.Component {
  render() {
    return (
      <>
        <Route path='/' component={Sidebar} />
        <Wrapper id="content">
          <Switch>
            <Route path='/' exact component={Posts} />
            <Route path='/about' exact component={About} />
            <Route path='/posts' exact component={withTag(Posts)} />
            <Route path='/posts/:slug' exact component={withSlug(PostOr404)} />
            <Route component={NoMatch} />
          </Switch>
        </Wrapper>
      </>
    )
  }
}

export default App
