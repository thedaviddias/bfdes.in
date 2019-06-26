import * as React from 'react'
import { parseQuery } from '../utils'

type QueryParams = {
  tag?: string,
  offset?: number,
  limit?: number
}

function tryParse(number: string): number {
  if(number == undefined) {
    return undefined
  }
  return parseInt(number)
}

export default function(Component: React.SFC<QueryParams>) { 
  return function(props: {location: Location}) {
    const { location, ...rest } = props  
    const { tag, offset, limit } = parseQuery(location.search)
    return <Component
      tag={tag}
      offset={tryParse(offset)}
      limit={tryParse(limit)}
      {...rest}
    />
  }
}