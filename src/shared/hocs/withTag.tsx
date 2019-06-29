import * as React from 'react'
import { parseQuery } from '../parsers'

type Props = {
  tag?: string,
}

export default function(Component: React.SFC<Props>) { 
  return function(props: {location: Location}) {
    const { location, ...rest } = props  
    const { tag } = parseQuery(location.search)
    return <Component tag={tag} {...rest} />
  }
}
