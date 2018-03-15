import * as React from 'react';
import { Link } from 'react-router-dom';
import Tags from './Tags';
import { parseDate, get, NetworkError } from '../utils';

type Post = {
  title: string,
  slug: string,
  wordCount: number,
  tags: string[],
  created: number
}

type Props = {
  posts?: Post[],
  tag?: string,
}

type State = {
  posts: Post[],
  loading: boolean,
  error: NetworkError
}

const PostStub: React.SFC<Post> 
  = ({ title, slug, wordCount, created, tags }) => (
    <li className='post'>
      <Link to={`/posts/${slug}`}><h2>{title}</h2></Link>
      <p>
        Posted on {parseDate(created)}&nbsp;&middot;&nbsp; in <Tags tags={tags}/>&nbsp;&middot;&nbsp;
        {wordCount} {wordCount != 1 ? 'words' : 'word'}
      </p>
    </li>
  )

export function withTag(Component: React.ComponentClass<{tag?: string}>) { 
  return (props: {location: Location}) => {
    const { location } = props
    const query = new URLSearchParams(location.search)
    const tag = query.get('tag')
    return tag != null  ? <Component tag={tag}/> : <Component/>
  }
}

class Posts extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    const { posts } = props
    
    this.state = {
      posts,
      error: null,
      loading: false
    }
  }

  componentDidMount() {
    const { posts } = this.props
    if(posts == null) {
      this.setState({loading: true})

      const { tag } = this.props
      this.fetchPosts(tag).then(posts => 
        this.setState({posts, loading: false})
      ).catch(err => 
        this.setState({error: err.message, loading: false})
      )
    }
  }

  componentDidUpdate(prevProps: Props, _: State) {
    if(prevProps.tag != this.props.tag) {
      this.setState({loading: true})
      const { tag } = this.props
      this.fetchPosts(tag).then(posts => 
        this.setState({posts, loading: false})
      ).catch(error => 
        this.setState({error, loading: false})
      )
    }
  }

  private fetchPosts(tag: string): Promise<Post[]> {
    const url = tag == undefined ? '/api/posts' : `/api/posts?tag=${tag}`
    return get(url)
  }

  render() {
    const { posts, loading, error } = this.state
    if(loading || posts == null) {
      return <div>Loading...</div>
    }
    if(error) {
      return <div>There was an error fetching the posts.</div>
    }

    return (
      <ul>
        {posts.map((post, i) => <PostStub key={i} {...post}/>)}
      </ul>
    )
  }
}

export default Posts;
