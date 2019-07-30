import * as React from "react";
import { Link } from "react-router-dom";
import { Context } from "../containers";
import { RequestError } from "../http";
import Date from "./Date";
import Error from "./Error";
import Spinner from "./Spinner";
import Tags from "./Tags";

/*
A tag may be supplied (by React Router) if the user has chosen to filter posts by tag.
Additionally, if the component is server rendered, then we supply posts in advance ysing React's context API.
*/
type Props = {
  tag?: string;
  context?: {
    data: PostStub[],
  };
  get(url: string): Promise<PostStub[]>;
};

type State = {
  posts: PostStub[];
  loading: boolean;
  error: RequestError;
};

const PostStub: React.SFC<PostStub>
  = ({ title, slug, wordCount, created, tags }) => (
    <li className="post">
      <Link to={`/posts/${slug}`} className="nav-item">
        <h1>{title}</h1>
      </Link>
      <p className="meta">
        <Date timestamp={created} />
        {" · "}<Tags tags={tags}/>
        {" · "}{wordCount} {wordCount !== 1 ? "words" : "word"}
      </p>
    </li>
  );

class Posts extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    /*
    On the server posts are supplied using React's Context API,
    but on the client a deferred render occurs and this DOM must match that rendered on the server.
    To ensure this happens we need to supply the data through the window too.

    Otherwise the render must be caused by internal navigation, in which case the window will be clean due to (1)
    */
    let posts;
    if (__isBrowser__) {
      posts = (window as any).__INITIAL_DATA__;
      delete (window as any).__INITIAL_DATA__;   // (1)
    } else {
      posts = this.props.context.data;
    }

    this.state = {
      posts,
      error: null,
      loading: false,
    };

    this.fetchPosts = this.fetchPosts.bind(this);
  }

  /*
  Fetch posts when component mounts (not called on server),
  but not when React's deferred first render occurs.
  */
  public componentDidMount() {
    if (this.state.posts == null) {
      const { tag } = this.props;
      this.fetchPosts(tag);
    }
  }

  /*
  Fetch posts afresh if filtering by another tag.
  */
  public componentDidUpdate(prevProps: Props, _: State) {
    if (prevProps.tag !== this.props.tag) {
      const { tag } = this.props;
      this.fetchPosts(tag);
    }
  }

  public render() {
    const { posts, loading, error } = this.state;
    const { tag } = this.props;
    if (error) {
      return(
        <Error>
          There was an error fetching the posts. Please try again later.
        </Error>
      );
    }
    if (loading || posts == null) {
      return <Spinner />;
    }
    if (posts.length === 0) {
      return(
        <Error>
          {`There aren't any posts ${tag ? `under ${tag}` : "yet"}. Please come back later.`}
        </Error>
      );
    }

    return (
      <ul id="posts">
        {posts.map(post => <PostStub key={post.slug} {...post}/>)}
      </ul>
    );
  }

  private fetchPosts(tag?: string): void {
    const url = `/api/posts${tag === undefined ? "" : `?tag=${tag}`}`;
    this.setState({loading: true}, () =>
      this.props.get(url).then(posts =>
        this.setState({posts, loading: false}),
      ).catch(error =>
        this.setState({error, loading: false}),
      ),
    );
  }
}

const Wrapped: React.SFC<Props> = props => (
  <Context.PostStub.Consumer>
    {posts => <Posts {...props} context={{data: posts}} />}
  </Context.PostStub.Consumer>
);

export default Wrapped;
