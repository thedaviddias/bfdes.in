import * as React from "react";
import { useParams } from "react-router";

type Props = {
  slug: string;
};

type Params = {
  slug: string;
};

export default function (Component: React.FC<Props>) {
  return function WithSlug(rest: Record<string, unknown>): React.ReactElement {
    const { slug } = useParams<Params>();
    return <Component slug={slug} {...rest} />;
  };
}
