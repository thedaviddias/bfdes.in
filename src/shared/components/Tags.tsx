import * as React from "react";
import { Link } from "react-router-dom";

type Tag = {
  value: string;
};

const Tag: React.FC<Tag> = (props: Tag) => {
  const { value } = props;
  return <Link to={`/posts?tag=${value}`}>{value}</Link>;
};

type Tags = {
  tags: string[];
};

const Tags: React.FC<Tags> = (props: Tags) => (
  <span>
    {props.tags
      .map(tag => <Tag key={tag} value={tag} />)
      .reduce((acc, tag) => [...acc, " # ", tag], [])}
  </span>
);

export default Tags;
