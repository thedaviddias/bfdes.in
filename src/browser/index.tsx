import * as React from "react";
import { hydrate } from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "../shared/containers/App";
import { get } from "../shared/http";

import "./main.css";

hydrate(
  <BrowserRouter>
    <App get={get} />
  </BrowserRouter>,
  document.getElementById("root")
);
