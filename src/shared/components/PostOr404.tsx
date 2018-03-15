import * as React from 'react';
import { match } from 'react-router-dom';
import Tags from './Tags';
import NoMatch from './NoMatch';
import { parseDate, NetworkError, get } from '../utils';

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
  match?: match<{slug: string}>,
  post?: Post
}

type State = {
  post: Post,
  error: NetworkError,
  loading: boolean
}

class PostOr404 extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    const { post } = props
    this.state = {
      post,
      error: null,
      loading: false
    }
  }

  componentDidMount() {
    const { post } = this.props
    const { slug } = this.props.match.params
    if(post == null) {
      this.setState({loading: true})
      get(slug).then(post => 
        this.setState({post, loading: false})
      ).catch(error =>
        this.setState({error, loading: false})
      )
    }
  }

  componentDidUpdate(prevProps: Props, _: State) {
    const { slug } = this.props.match.params
    const prevSlug = prevProps.match.params.slug
    if(slug != prevSlug) {
      this.setState({loading: true})
      get(slug).then(post =>
        this.setState({post, loading: false})
      ).catch(error =>
        this.setState({error, loading: false})
      )
    }
  }

  render() {
    const { post, error, loading } = this.state 

    if(loading || !post) {
      return <div>Loading...</div>
    }
    if(error && error.status == 404) {
      return <NoMatch />
    }
    if(error) {
      return <div>There was an error fetching the post.</div>
    }
    return <Post {...post} />
  }
}



export default PostOr404;
