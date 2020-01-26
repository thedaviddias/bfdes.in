import * as React from "react";
import Loading from "../images/loading.svg";

function Spinner(): React.ReactElement {
  return (
    <div className="spinner">
      <img src={Loading} />
    </div>
  );
}

export default Spinner;
