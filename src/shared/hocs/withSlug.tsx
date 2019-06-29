import *  as React from 'react'
import { match } from 'react-router'

export default function(Component: React.SFC<{slug?: string}>) { 
  return function(props: {match: match<{slug: string}>}) {
    const { match, ...rest } = props
    const { slug } = props.match.params
    return <Component slug={slug} {...rest}/>
  }
}
