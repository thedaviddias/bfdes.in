import * as React from 'react'
import { parseQuery } from '../utils'

export default function(Component: React.SFC<{tag?: string}>) { 
  return function(props: {location: Location}) {
    const { location, ...rest } = props  
    const { tag } = parseQuery(location.search)
    return tag != undefined ? <Component tag={tag} {...rest} /> : <Component {...rest} />
  }
}