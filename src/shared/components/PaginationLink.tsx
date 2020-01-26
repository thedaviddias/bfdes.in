import * as React from "react";
import { Link } from "react-router-dom";

type Props = {
  next?: string;
  children: string;
};

function PaginationLink(props: Props): React.ReactElement {
  const { next, children } = props;
  return (
    <span className="pagination-item">
      {next ? (
        <Link to={`/posts/${next}`}>{children}</Link>
      ) : (
        <span>{children}</span>
      )}
    </span>
  );
}

export default PaginationLink;
