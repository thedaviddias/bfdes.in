import * as React from 'react';
import Error from './Error'
import PostStub from './PostStub'
import PaginationLink from './PaginationLink'
import Spinner from '../Spinner';
import { RequestError } from '../../http'
import { Context } from '../../containers';
import { Redirect } from 'react-router';

/*
A tag may be supplied (by React Router) if the user has chosen to filter posts by tag.
Additionally, if the component is server rendered, then we supply posts in advance ysing React's context API.
*/
type Props = {
  get(url: string): Promise<Post[]>,
  tag?: string,
  offset?: number,
  limit?: number,
  context?: {
    data: PostStub[]
  }
}

type State = {
  posts: PostStub[],
  loading: boolean,
  error: RequestError
}

const pagingRate = __pagingRate__

function url(tag: string, offset: number, limit: number): string {
  return `/api/posts?offset=${offset}&limit=${limit}${tag == undefined ? '' : `&tag=${tag}`}`
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
      const { tag, offset, limit } = this.props
      this.fetchPosts(tag, offset, limit)
    }
  }

  /*
  Fetch posts afresh if filtering by another tag.
  */
  componentDidUpdate(prevProps: Props, _: State) {
    if(prevProps.tag != this.props.tag) {
      const { tag, offset, limit } = this.props
      this.fetchPosts(tag, offset, limit)
    }
  }

  private fetchPosts(
    tag?: string,
    offset: number = 0,
    limit: number = pagingRate
  ): void {
    const endpoint = url(tag, offset, limit)
    this.setState({loading: true}, () => 
      this.props.get(endpoint).then(posts =>
        this.setState({posts, loading: false})
      ).catch(error =>
        this.setState({error, loading: false})
      )
    )
  }

  render() {
    const { posts, loading, error } = this.state
    if(error) {
      return <Error />
    }
    if(loading || posts == null) {
      return <Spinner />
    }
    // Tag might not be defined at this point, but the offset and limit will be
    const { tag, offset, limit } = this.props

    if(posts.length == 0) {
      return <Redirect to={url(tag, 0, pagingRate)}/>
    }

    return (
      <>
        <ul id='posts'>
          {posts.map(post => <PostStub key={post.slug} {...post}/>)}
        </ul>
        <div className='pagination'>
          <PaginationLink
            disabled={offset < limit}
            to={url(tag, offset-limit, limit)}
          >
            Previous
          </PaginationLink>
          <PaginationLink
            disabled={posts.length < limit}
            to={url(tag, offset+limit, limit)}
          >
            Next
          </PaginationLink>
        </div>
      </>
    )
  }
}

const Wrapped: React.SFC<Props> = props => (
  <Context.PostStub.Consumer>
    {posts => <Posts {...props} context={{data: posts}} />}
  </Context.PostStub.Consumer>
)

export default Wrapped
