import * as React from 'react';
import { match } from 'react-router-dom';
import Tags from './Tags';
import NoMatch from './NoMatch';
import { parseDate, NetworkError, get } from '../utils';

declare const __isBrowser__: boolean  // Injected by Webpack to indicate whether we are running JS on the client

const Post: React.SFC<Post>
  = ({title, body, created, tags}) => (
    <div className='post'>
      <h2>{title}</h2>
      <p>Posted on {parseDate(created)}&nbsp;&middot;&nbsp; in <Tags tags={tags}/></p>
      <p dangerouslySetInnerHTML={{__html: body}}/>
    </div>
  )

type Post = {
  title: string,
  body: string,
  created: number,
  tags: string[]
}

type Props = {
  slug?: string,
  staticContext?: {
    data: Post
  }
}

type State = {
  post: Post,
  loading: boolean,
  error: NetworkError,
}

export function withSlug(Component: React.ComponentClass<{slug?: string}>) { 
  return (props: {match: match<{slug: string}>}) => {
    const { match, ...rest } = props
    const { slug } = props.match.params
    return <Component slug={slug} {...rest}/>
  }
}

class PostOr404 extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    const post = __isBrowser__ ? null : this.props.staticContext.data

    this.state = {
      post,
      error: null,
      loading: false
    }

    this.fetchPost = this.fetchPost.bind(this)
  }

  componentDidMount() {
    const { slug } = this.props
    this.fetchPost(slug)
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
      get(url).then(post => 
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
    if(loading || post == null) {
      return <div>Loading...</div>
    }
    
    if(error) {
      return <div>There was an error fetching the post.</div>
    }
    return <Post {...post} />
  }
}

export default PostOr404;
