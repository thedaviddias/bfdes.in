import * as path from 'path'
import * as bodyParser from 'body-parser'
import * as logger from 'morgan'
import * as express from 'express'
import { Request, Response, NextFunction } from 'express'
import { renderToString } from 'react-dom/server'
import * as React from 'react'
import { matchPath } from 'react-router-dom'

import App from '../shared/containers/App'
import router from './router'
import { Posts } from '../shared/utils';

export default function factory(posts: Posts) {
  const app = express()

  if(process.env.NODE_ENV == 'development') {
    app.use(logger('dev'))
  }

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json())
  app.use(express.static(path.resolve('dist')))

  app.use('/', router)

  // Error handler
  type NetworkError = {status?: number} & Error;

  app.use((err: NetworkError, req: Request, res: Response, next: NextFunction) => {
    res.status(err.status || 500);  // Server error if no status
    console.error(err.stack);
    res.json({
        error: {
            message: (err.status == 500) ? '500: Internal Server error' : err.message
        }
    });
  });

  app.set('posts', posts)
  return app
}
