import * as React from 'react';
import { match } from 'react-router-dom';
import { IPosts } from './Posts';
import Tags from './Tags';
import NoMatch from './NoMatch';
import { parseDate } from '../utils';

const posts: IPosts = require('../posts')

const Post: React.SFC<{title: string, body: string, created: number, tags: string[]}>
  = ({title, body, created, tags}) => (
    <div className='post'>
      <h2>{title}</h2>
      <p>Posted on {parseDate(created)}&nbsp;&middot;&nbsp; in <Tags tags={tags}/></p>
      <p dangerouslySetInnerHTML={{__html: body}}/>
    </div>
  )

const PostOr404: React.SFC<{match: match<{slug: string}>}> = ({ match }) => {
  const { slug } = match.params
  return posts[slug] !== undefined ?  <Post {...posts[slug]} /> : <NoMatch />
}

export default PostOr404;
