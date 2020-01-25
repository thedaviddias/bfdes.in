import * as React from "react";
import { Link } from "react-router-dom";

const Tag: React.SFC<{ name: string }> = ({ name }) => (
  <Link to={`/posts?tag=${name}`}>{name}</Link>
);

const Tags: React.SFC<{ tags: string[] }> = ({ tags }) => (
  <span>
    {tags
      .map(name => <Tag key={name} name={name} />)
      .reduce((acc, tag) => [...acc, " # ", tag], [])}
  </span>
);

export default Tags;
