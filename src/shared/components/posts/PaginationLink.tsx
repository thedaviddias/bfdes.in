import * as React from 'react'
import { Link } from 'react-router-dom'

type Props = {
  disabled: boolean,
  to?: string
}

const PaginationLink: React.SFC<Props>
  = ({ to, disabled, children }) => (
    <Link
      className={`pagination-item ${disabled ? 'disabled' : ''}`}
      to={to}
    >
      {children}
    </Link> 
  )

export default PaginationLink
