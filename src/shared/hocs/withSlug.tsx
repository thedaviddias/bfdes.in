import * as React from "react";
import { match } from "react-router";

type Slug = {
  slug?: string;
};

type Match = {
  match: match<Slug>;
};

export default function(Component: React.SFC<Slug>): React.SFC<Match> {
  const WithSlug: React.FC<Match> = (props: Match) => {
    const { match, ...rest } = props;
    const { slug } = match.params;
    return <Component slug={slug} {...rest} />;
  };
  return WithSlug;
}
