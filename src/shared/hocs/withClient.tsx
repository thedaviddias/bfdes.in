import * as React from "react";

interface Props<P> {
  get(url: string, signal: AbortSignal): Promise<P>;
}

export default function <P>(
  Component: React.FC<Props<P>>,
  get: (url: string, signal: AbortSignal) => Promise<P>
) {
  return function WithClient(
    rest: Record<string, unknown>
  ): React.ReactElement {
    return <Component get={get} {...rest} />;
  };
}
