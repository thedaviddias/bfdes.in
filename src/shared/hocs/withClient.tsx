import * as React from "react";
import { get } from "shared/http";

interface Props<P> {
  get(url: string, signal: AbortSignal): Promise<P>;
}

export default function <P>(Component: React.FC<Props<P>>) {
  return function WithClient(
    rest: Record<string, unknown>
  ): React.ReactElement {
    return <Component get={get} {...rest} />;
  };
}
