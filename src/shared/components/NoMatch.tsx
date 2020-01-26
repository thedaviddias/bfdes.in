import * as React from "react";

function NoMatch(): React.ReactElement {
  return (
    <div className="fourOhFour">
      <h1>404: Not Found</h1>
      <p>Hmm it looks like you{"'"}re in the wrong place.</p>
    </div>
  );
}

export default NoMatch;
