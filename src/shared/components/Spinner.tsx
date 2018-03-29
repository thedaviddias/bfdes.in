import * as React from 'react'
import styled from 'styled-components'

const Spinner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    width: 5rem;
    height: 5rem;
  }
`

export default () => (
  <Spinner className='spinner'>
    <img src={require('../images/loading.svg')}></img>
  </Spinner>
)
