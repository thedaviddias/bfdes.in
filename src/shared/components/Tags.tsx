import * as React from "react";
import { Link } from "react-router-dom";

type Tag = {
  value: string;
};

function Tag(props: Tag): React.ReactElement {
  const { value } = props;
  return (
    <Link to={`/posts?tag=${value}`}>
      {value}
    </Link>
  );
}

type Tags = {
  tags: string[];
};

function Tags(props: Tags): React.ReactElement {
  return (
    <span>
      {props.tags
        .map(tag => <Tag key={tag} value={tag} />)
        .reduce((acc, tag) => [...acc, " # ", tag], [])}
    </span>
  );
}

export default Tags;
