import * as React from "react";
import { Link } from "react-router-dom";

type Props = {
  next?: string;
  children: string;
};

const PaginationLink: React.SFC<Props> = ({ next, children }) => (
  <span className="pagination-item">
    {next ? (
      <Link to={`/posts/${next}`}>{children}</Link>
    ) : (
      <span>{children}</span>
    )}
  </span>
);

export default PaginationLink;
