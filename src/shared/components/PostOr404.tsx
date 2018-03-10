import * as React from 'react';
import { match } from 'react-router-dom';
import Tags from './Tags';
import NoMatch from './NoMatch';
import { parseDate } from '../utils';

type IPost = {
  title: string;
  body: string;
  wordCount?: number;
  created: number;
  tags: string[] 
}

const posts: {[s: string]: IPost} = {} // Represented as slug -> {title, body, wordCount, created, tags}

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
