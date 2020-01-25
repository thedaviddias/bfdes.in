import * as React from "react";

type Props = {
  children: string;
};

const Error: React.SFC<Props> = ({ children }) => (
  <div className="error">
    <h1>Error</h1>
    <div>{children}</div>
  </div>
);

export default Error;
