import * as React from "react";
import { useParams } from "react-router";

type Props = {
  slug: string;
};

export default function (Component: React.FC<Props>) {
  return function WithSlug(rest: object): React.ReactElement {
    const { slug } = useParams();
    return <Component slug={slug} {...rest} />;
  };
}
