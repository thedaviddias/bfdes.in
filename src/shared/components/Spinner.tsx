import * as React from "react";
import Loading from "../images/loading.svg";

const Spinner: React.FC = () => (
  <div className="spinner">
    <img src={Loading} />
  </div>
);

export default Spinner;
