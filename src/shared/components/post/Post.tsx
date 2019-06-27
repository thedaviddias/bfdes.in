import * as React from 'react'
import Tags from '../Tags'
import { parseDate } from '../../utils'

const Post: React.SFC<Post>
  = ({title, body, created, tags, wordCount}) => (
    <div className='post'>
      <h1>{title}</h1>
      <p className='meta'>
        {parseDate(created)}
        {' · '}<Tags tags={tags}/>
        {' · '}{wordCount} {wordCount != 1 ? ' words' : ' word'}
      </p>
      <div dangerouslySetInnerHTML={{__html: body}}/>
    </div>
  )

export default Post
