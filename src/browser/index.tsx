import * as React from "react";
import { hydrate } from "react-dom";
import { BrowserRouter } from "react-router-dom";
import * as Containers from "shared/containers";
import { withClient } from "shared/hocs";
import { get } from "shared/http";

import "./main.css";

const App = withClient(Containers.App, get);

hydrate(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById("root")
);
