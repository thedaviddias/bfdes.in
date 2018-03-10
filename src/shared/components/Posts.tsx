import * as React from 'react';
import { Link } from 'react-router-dom';
import Tags from './Tags';
import { parseDate } from '../utils';

type IPost = {
  title: string;
  body: string;
  slug: string;
  wordCount: number;
  created: number;
  tags: string[]
}

const posts: IPost[] = []
  .map(pair => {
    const slug = pair[0]
    const rest = pair[1]
    return {slug: slug, ...rest}
  })
  .sort((prev, curr) => curr.created-prev.created)  // Posts in chronological order

const PostStub: React.SFC<{title: string, slug: string, wordCount: number, created: number, tags: string[]}> 
  = ({ title, slug, wordCount, created, tags }) => (
    <li className='post'>
      <Link to={`/posts/${slug}`}><h2>{title}</h2></Link>
      <p>
        Posted on {parseDate(created)}&nbsp;&middot;&nbsp; in <Tags tags={tags}/>&nbsp;&middot;&nbsp;
        {wordCount} {wordCount != 1 ? 'words' : 'word'}
      </p>
    </li>
  )

export function withTag<P extends {tag?: string}>(Component: React.SFC<P>) { 
  return (props: {location: Location}) => {
    const { location } = props
    const query = new URLSearchParams(location.search)
    const tag = query.get('tag')
    return tag != null  ? <Component tag={tag}/> : <Component/>
  }
}

const Posts: React.SFC<{limit?: number, tag?: string}> = ({ limit, tag }) => {
  const filtered = tag == undefined ? posts : posts.filter(post => post.tags.indexOf(tag) != -1)
  const sliced = limit == undefined ? filtered : filtered.slice(0, limit)
  return (
    <div>
      <ul>
        {
          sliced.map((post, i) => {
            const { body, ...rest } = post;
            return <PostStub key={i} {...rest}/>
          })
        }
      </ul>
    </div>
  )
}

export default Posts;
