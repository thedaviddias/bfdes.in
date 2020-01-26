import * as React from "react";

type Props = {
  children: string;
};

function Error(props: Props): React.ReactElement {
  return (
    <div className="error">
      <h1>Error</h1>
      <div>{props.children}</div>
    </div>
  );
}

export default Error;
