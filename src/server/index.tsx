import * as path from 'path'
import * as bodyParser from 'body-parser'
import * as logger from 'morgan'
import * as express from 'express'
import { Request, Response, NextFunction } from 'express'

import router from './router'
import { Posts } from '../shared/utils';

export default function factory(posts: Posts) {
  const app = express()

  if(process.env.NODE_ENV == 'development') {
    app.use(logger('dev'))
  }

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json())
  app.use(express.static(path.resolve('dist', 'static')))

  app.use('/', router)

  // Error handler
  type NetworkError = {status?: number} & Error;

  app.use((err: NetworkError, req: Request, res: Response, next: NextFunction) => {
    res.status(err.status || 500);  // Server error if no status
    console.error(err.stack);
    res.json({
        error: {
            message: (err.status == 500) ? '500: Internal Server error' : `${err.status}: ${err.message}`
        }
    });
  });

  app.set('posts', posts)
  return app
}
