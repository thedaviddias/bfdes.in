import * as React from "react";
import { get } from "../http";

interface Props<P> {
  get(url: string): Promise<P>;
}

export default function<P>(Component: React.SFC<Props<P>>) {
  return function WithClient(rest: object): React.ReactElement {
    return <Component get={get} {...rest} />;
  };
}
