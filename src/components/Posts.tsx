import * as React from 'react';
import { Link } from 'react-router-dom';
import Tags from './Tags';

export interface IPost {
  title: string;
  body: string;
  wordCount: number;
  created: string;
  tags: string[]
}

export interface IPosts {[s: string]: IPost}

const posts: IPosts = require('../posts')  // Posts as a map of slug -> {title, body, created, tags}

const PostStub: React.SFC<{title: string, slug: string, wordCount: number, created: string, tags: string[]}> 
  = ({ title, slug, wordCount, created, tags }) => (
    <li className='post'>
      <Link to={`/posts/${slug}`}><h2>{title}</h2></Link>
      <p>
        Posted on {created}&nbsp;&middot;&nbsp; in <Tags tags={tags}/>&nbsp;&middot;&nbsp;
        {wordCount} {wordCount != 1 ? 'words' : 'word'}
      </p>
    </li>
  )

const Posts: React.SFC<{location: Location}> = ({ location }) => {
  const query = new URLSearchParams(location.search)
  const tag = query.get('tag')
  const filteredPosts = Object.keys(posts).map(slug => {
    return {...posts[slug], slug: slug}
  }).filter(post => tag == null || post.tags.indexOf(tag) != -1)

  return (
    <div>
      <ul>
        {
          filteredPosts.map((post, i)=> {
            const { body, ...rest } = post;
            return <PostStub key={i} {...rest} />
          })
        }
      </ul>
    </div>
  )
}

export default Posts;
