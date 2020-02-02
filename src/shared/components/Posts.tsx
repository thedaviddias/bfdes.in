import * as React from "react";
import { Link } from "react-router-dom";
import { Context } from "shared/containers";
import { RequestError } from "shared/http";
import Date from "./Date";
import Error from "./Error";
import Spinner from "./Spinner";
import Tags from "./Tags";
import Params from "shared/Params";
import PaginationLink from "./PaginationLink";

const PostStub: React.FC<PostStub> = (props: PostStub) => {
  const { title, slug, wordCount, created, tags } = props;
  return (
    <li className="post">
      <Link to={`/posts/${slug}`} className="nav-item">
        <h1>{title}</h1>
      </Link>
      <p className="meta">
        <Date timestamp={created} />
        {" · "}
        <Tags tags={tags} />
        {" · "}
        {wordCount} {wordCount !== 1 ? "words" : "word"}
      </p>
    </li>
  );
};

/*
A tag may be supplied (by React Router) if the user has chosen to filter posts by tag.
Additionally, if the component is server rendered, then we supply posts in advance ysing React's context API.
*/
type Props = {
  params: Params;
  context?: {
    data: PostStub[];
  };
  get(url: string): Promise<PostStub[]>;
};

type State = {
  posts: PostStub[];
  loading: boolean;
  error: RequestError;
};

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
      posts = window.__INITIAL_DATA__ as PostStub[];
      delete window.__INITIAL_DATA__; // (1)
    } else {
      posts = this.props.context.data;
    }

    this.state = {
      posts,
      error: null,
      loading: false
    };

    this.fetchPosts = this.fetchPosts.bind(this);
  }

  /*
  Fetch posts when component mounts (not called on server),
  but not when React's deferred first render occurs.
  */
  public componentDidMount(): void {
    if (this.state.posts == null) {
      const { params } = this.props;
      this.fetchPosts(params);
    }
  }

  /*
  Fetch posts afresh if filtering by another tag.
  */
  public componentDidUpdate(prevProps: Props): void {
    const { params } = this.props;
    const { posts } = this.state;
    if (prevProps.params !== params) {
      this.fetchPosts(params);
    } else if (posts.length == 0) {
      this.fetchPosts(new Params());
    }
  }

  public render(): React.ReactElement {
    const { posts, loading, error } = this.state;
    if (error) {
      return (
        <Error>
          There was an error fetching the posts. Please try again later.
        </Error>
      );
    }
    if (loading || posts == null) {
      return <Spinner />;
    }

    return (
      <>
        <ul id="posts">
          {posts.map(post => (
            <PostStub key={post.slug} {...post} />
          ))}
        </ul>
        <div className="pagination">
          <PaginationLink next={previous}>Previous</PaginationLink>
          <PaginationLink next={next}>Next</PaginationLink>
        </div>
      </>
    );
  }

  private fetchPosts(params: Params): void {
    const url = `/api/posts${params}`;
    this.setState({ loading: true }, () =>
      this.props
        .get(url)
        .then(posts => this.setState({ posts, loading: false }))
        .catch(error => this.setState({ error, loading: false }))
    );
  }
}

const Wrapped: React.FC<Props> = (props: Props) => {
  const WithPosts: React.FC<PostStub[]> = (data: PostStub[]) => (
    <Posts {...props} context={{ data }} />
  );
  return <Context.Posts.Consumer>{WithPosts}</Context.Posts.Consumer>;
};

export default Wrapped;
