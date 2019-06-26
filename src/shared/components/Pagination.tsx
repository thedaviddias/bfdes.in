import * as React from 'react'
import { Link } from 'react-router-dom'

type Props = {
  previous?: string,
  next?: string
}

const PaginationLink: React.SFC<{to: string}> = props => (
  <span className='pagination-item'>
    <Link to={props.to}>{props.children}</Link> 
  </span>
)

const Pagination: React.SFC<Props> = ({ previous, next }) => (
  <div className='pagination'>
    {previous && (
      <PaginationLink to={previous}>
        Previous
      </PaginationLink>
    )}
    {next && (
      <PaginationLink to={next}>
        Next
      </PaginationLink>
    )}
  </div>
)

export default Pagination
