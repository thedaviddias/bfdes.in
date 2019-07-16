import * as React from "react";
import { match } from "react-router";

type Props = {
  slug?: string;
};

export default function(Component: React.SFC<Props>) {
  return (props: {match: match<{slug: string}>}) => {
    const { match, ...rest } = props;
    const { slug } = match.params;
    return <Component slug={slug} {...rest}/>;
  };
}
