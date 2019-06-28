import * as React from 'react';
import Post from './Post';
import Error from '../Error';
import NoMatch from '../NoMatch';
import Spinner from '../Spinner';
import { RequestError } from '../../http';
import { Context } from '../../containers';

type Props = {
  get(url: string): Promise<Post>,
  slug?: string,
  context?: {
    data: Post
  }
}

type State = {
  post: Post,
  loading: boolean,
  error: RequestError,
}

class PostOr404 extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    let post
    if(__isBrowser__) {
      post = (window as any).__INITIAL_DATA__
      delete (window as any).__INITIAL_DATA__
    } else {
      post = this.props.context.data
    }

    this.state = {
      post,
      error: null,
      loading: false
    }

    this.fetchPost = this.fetchPost.bind(this)
  }

  componentDidMount() {
    if(!this.state.post) {
      const { slug } = this.props
      this.fetchPost(slug)
    }
  }

  componentDidUpdate(prevProps: Props, _: State) {
    if(prevProps.slug != this.props.slug) {
      const { slug } = this.props
      this.fetchPost(slug)
    }
  }

  private fetchPost(slug: string): void {
    const url = `/api/posts/${slug}`
    this.setState({loading: true}, () =>
      this.props.get(url).then(post => 
        this.setState({post, loading: false})
      ).catch(error => 
        this.setState({error, loading: false})
      )
    )
  }

  render() {
    const { post, error, loading } = this.state
    if(error && error.status == 404) {
      return <NoMatch />
    }
    if(error) {
      return (
        <Error>
          There was an error fetching the post. Please try again later.
        </Error>
      )
    }
    if(loading || post == null) {
      return <Spinner />
    }
    return <Post {...post} />
  }
}

const Wrapped: React.SFC<Props> = props => (
  <Context.Post.Consumer>
    {post => <PostOr404 {...props} context={{data: post}} />}
  </Context.Post.Consumer>
)

export default Wrapped;
