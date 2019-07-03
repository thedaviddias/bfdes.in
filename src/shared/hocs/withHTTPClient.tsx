import * as React from "react";
import { get } from "../http";

type Props = {
  get(url: string): Promise<any>;
};

export default function(Component: React.SFC<Props>) {
  return (props: any) => <Component get={get} {...props}/>;
}
