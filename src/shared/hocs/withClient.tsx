import * as React from "react";

interface Props<P> {
  get(url: string): Promise<P>;
}

export default function<P>(get: (url: string) => Promise<P>) {
  return function(Component: React.SFC<Props<P>>) {
    return function WithClient(rest: object): React.ReactElement {
      return <Component get={get} {...rest} />;
    };
  };
}
