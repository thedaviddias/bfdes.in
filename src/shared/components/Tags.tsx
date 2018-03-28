import * as React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components'

const StyledLink = styled(Link)`
  color: var(--blue);
  &:hover, &:focus {
    text-decoration: underline
  }
  &:after {
    text-decoration: none
  }
`

const Tag: React.SFC<{name: string}> = ({ name }) => <StyledLink to={`/posts?tag=${name}`}>{name}</StyledLink>

const Tags: React.SFC<{tags: string[]}> = ({ tags }) => (
  <span>
    {
      tags.map((name, i) => 
        <Tag key={i} name={name}/>
      ).reduce((acc, tag) => 
        [...acc, ' # ', tag], []
      )
    }
  </span>
)

export default Tags
