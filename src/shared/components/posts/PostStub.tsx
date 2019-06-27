import * as React from 'react'
import { Link } from 'react-router-dom'
import Tags from '../Tags'
import { parseDate } from '../../utils'

const PostStub: React.SFC<PostStub> 
  = ({ title, slug, wordCount, created, tags }) => (
    <li className='post'>
      <Link to={`/posts/${slug}`} className='nav-item'><h1>{title}</h1></Link>
      <p className='meta'>
        {parseDate(created)}
        {' · '}<Tags tags={tags}/>
        {' · '}{wordCount} {wordCount != 1 ? 'words' : 'word'}
      </p>
    </li>
  )

export default PostStub
