import * as React from 'react';
import { Link } from 'react-router-dom';
import Tags from './Tags';
import { parseDate, parseQuery, get, NetworkError } from '../utils';

declare const __isBrowser__: boolean  // Injected by Webpack to indicate whether we are running JS on the client

type Post = {
  title: string,
  slug: string,
  wordCount: number,
  tags: string[],
  created: number
}

/*
A tag may be supplied (by React Router) if the user has chosen to filter posts by tag.
Additionally, if the component is server rendered, then we supply posts in advance through static context.
*/
type Props = {
  tag?: string,
  staticContext?: {
    data: Post[]
  }
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
        {parseDate(created)}&nbsp;&middot;&nbsp;
        <Tags tags={tags}/>&nbsp;&middot;&nbsp;
        {wordCount} {wordCount != 1 ? 'words' : 'word'}
      </p>
    </li>
  )
/** HOC to parse and supply the tag from React Router */
export function withTag(Component: React.ComponentClass<{tag?: string}>) { 
  return (props: {location: Location}) => {
    const { location, ...rest } = props  
    const { tag } = parseQuery(location.search)

    // Also pass on the rest of the parameters, which include static context
    return tag != undefined ? <Component tag={tag} {...rest}/> : <Component {...rest}/>
  }
}

class Posts extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    // Initial set of posts are supplied in advance on the server
    const posts = __isBrowser__ ? null : this.props.staticContext.data

    this.state = {
      posts,
      error: null,
      loading: false
    }

    this.fetchPosts = this.fetchPosts.bind(this)
  }

  /*
  Fetch posts when component mounts (not called on server).
  */
  componentDidMount() {
    console.log(`Called on ${__isBrowser__ ? 'browser' : 'server'}`)
    const { tag } = this.props
    this.fetchPosts(tag)
  }

  /*
  Fetch posts afresh if filtering by another tag.
  */
  componentDidUpdate(prevProps: Props, _: State) {
    if(prevProps.tag != this.props.tag) {
      const { tag } = this.props
      this.fetchPosts(tag)
    }
  }

  private fetchPosts(tag: string): void {
    const url = tag == undefined ? '/api/posts' : `/api/posts?tag=${tag}`
    this.setState({loading: true}, () => 
      get(url).then(posts => 
        this.setState({posts, loading: false})
      ).catch(error => 
        this.setState({error, loading: false})
      )
    )
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
