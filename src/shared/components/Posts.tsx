import * as React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Spinner from './Spinner';
import Tags from './Tags';
import { parseDate, parseQuery, get, delay, NetworkError } from '../utils';

declare const __isBrowser__: boolean  // Injected by Webpack to indicate whether we are running JS on the client

type Post = {
  title: string,
  slug: string,
  wordCount: number,
  tags: string[],
  created: number
}

const StyledLink = styled(Link)`
  text-decoration: none;
  color: var(--dark);
  &:hover, &:focus {
    text-decoration: bold
  }
  &:after {
    text-decoration: none
  }
`

const UL = styled.ul`
  list-style-type: none;
  padding: 0;

  li {
    padding: 0;
    margin: 0;
  }
`

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
      <StyledLink to={`/posts/${slug}`}><h1>{title}</h1></StyledLink>
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

    /*
    On the server posts are supplied through static context,
    but on the client a deferred render occurs and this DOM must match that rendered on the server.
    To ensure this happens we need to supply the data through the window too.

    Otherwise the render must be caused by internal navigation, in which case the window will be clean due to (1)
    */
    let posts
    if(__isBrowser__) {
      posts = (window as any).__INITIAL_DATA__
      delete (window as any).__INITIAL_DATA__   // (1)
    } else {
      posts = this.props.staticContext.data
    }

    this.state = {
      posts,
      error: null,
      loading: false
    }

    this.fetchPosts = this.fetchPosts.bind(this)
  }

  /*
  Fetch posts when component mounts (not called on server),
  but not when React's deferred first render occurs.
  */
  componentDidMount() {
    if(!this.state.posts) {
      const { tag } = this.props
      this.fetchPosts(tag)
    }
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
      delay(get(url), 250).then(posts => 
        this.setState({posts, loading: false})
      ).catch(error => 
        this.setState({error, loading: false})
      )
    )
  }

  render() {
    const { posts, loading, error } = this.state
    if(loading || posts == null) {
      return <Spinner />
    }
    if(error) {
      return (
        <div className='error'>
          <h1>Error</h1>
          <div>There was an error fetching the posts.</div>
        </div>
      )
    }

    return (
      <UL>
        {posts.map((post, i) => <PostStub key={i} {...post}/>)}
      </UL>
    )
  }
}

export default Posts;
