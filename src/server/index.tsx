import * as bodyParser from "body-parser";
import * as compression from "compression";
import * as express from "express";
import { NextFunction, Request, Response } from "express";
import * as logger from "morgan";
import * as path from "path";

import DB from "../shared/db";
import router from "./router";

export default function(posts: Post[], mode: string = "test") {
  const app = express();

  // Apply middleware stack:
  // i) logger
  switch (mode) {
    case "production":
      app.use(logger("common"));
    case "development":
      app.use(logger("dev"));
  }

  // ii) request parser
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  // ii) static server w/ gzip compression
  app.use(compression());
  app.use("/static", express.static(path.resolve("dist", "static")));

  // iii) router
  app.use("/", router);

  // Error handler
  type RequestError = {status?: number} & Error;

  app.use((err: RequestError, req: Request, res: Response, next: NextFunction) => {
    res.status(err.status || 500);  // Server error if no status
    console.error(err.stack);
    const message = (err.status === 500)
      ? "500: Internal Server error"
      : `${err.status}: ${err.message}`;
    res.json({
        error: {
            message,
        },
    });
  });

  // Spin-up the db
  app.set("DB", new DB(posts));

  return app;
}
