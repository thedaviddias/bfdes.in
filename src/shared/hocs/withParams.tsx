import * as React from "react";
import { useLocation } from "react-router-dom";
import Params from "shared/Params";

type Props = {
  params: Params;
};

export default function(Component: React.FC<Props>) {
  return function WithTag(rest: object): React.ReactElement {
    const location = useLocation();
    const params = Params.fromString(location.search);
    return <Component params={params} {...rest} />;
  };
}
