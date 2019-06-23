import * as React from 'react';
import { Link } from 'react-router-dom';
import Spinner from './Spinner';
import Tags from './Tags';
import { get, RequestError } from '../http'
import { parseDate, parseQuery, PostStub } from '../utils';
import { Context } from '../containers';

declare const __isBrowser__: boolean  // Injected by Webpack to indicate whether we are running JS on the client

/*
A tag may be supplied (by React Router) if the user has chosen to filter posts by tag.
Additionally, if the component is server rendered, then we supply posts in advance ysing React's context API.
*/
type Props = {
  tag?: string,
  context?: {
    data: PostStub[]
  }
}

type State = {
  posts: PostStub[],
  loading: boolean,
  error: RequestError
}

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

/** HOC to parse and supply the tag from React Router */
export function withTag(Component: React.SFC<{tag?: string}>) { 
  return (props: {location: Location}) => {
    const { location, ...rest } = props  
    const { tag } = parseQuery(location.search)
    return tag != undefined ? <Component tag={tag} {...rest} /> : <Component {...rest} />
  }
}

class Posts extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    /*
    On the server posts are supplied using React's Context API,
    but on the client a deferred render occurs and this DOM must match that rendered on the server.
    To ensure this happens we need to supply the data through the window too.

    Otherwise the render must be caused by internal navigation, in which case the window will be clean due to (1)
    */
    let posts
    if(__isBrowser__) {
      posts = (window as any).__INITIAL_DATA__
      delete (window as any).__INITIAL_DATA__   // (1)
    } else {
      posts = this.props.context.data
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
    if(this.state.posts == null) {
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
      get(url).then(posts =>
        this.setState({posts, loading: false})
      ).catch(error =>
        this.setState({error, loading: false})
      )
    )
  }

  render() {
    const { posts, loading, error } = this.state
    if(error) {
      return (
        <div className='error'>
          <h1>Error</h1>
          <div>There was an error fetching the posts.</div>
        </div>
      )
    }
    if(loading || posts == null) {
      return <Spinner />
    }

    return (
      <ul id='posts'>
        {posts.map(post => <PostStub key={post.slug} {...post}/>)}
      </ul>
    )
  }
}

const Wrapped: React.SFC<{tag?: string}> = (props) => (
  <Context.PostStub.Consumer>
    {(posts) => <Posts tag={props.tag} context={{data: posts}} />}
  </Context.PostStub.Consumer>
)

export default Wrapped
