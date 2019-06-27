import * as React from 'react'
import { parseQuery } from '../utils'

type QueryParams = {
  tag?: string,
  offset?: number,
  limit?: number
}

function tryParse(number: string, defaultValue: number): number {
  if(number == undefined) {
    return defaultValue
  }
  return parseInt(number)
}

export default function(Component: React.SFC<QueryParams>) { 
  return function(props: {location: Location}) {
    const { location, ...rest } = props  
    const { tag, offset, limit } = parseQuery(location.search)
    return <Component
      tag={tag}
      offset={tryParse(offset, 0)}
      limit={tryParse(limit, __pagingRate__)}
      {...rest}
    />
  }
}