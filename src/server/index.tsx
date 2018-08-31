import * as path from 'path'
import * as bodyParser from 'body-parser'
import * as logger from 'morgan'
import * as express from 'express'
import { Request, Response, NextFunction } from 'express'

import router from './router'
import { Posts } from '../shared/utils';

export default function factory(posts: Posts) {
  const mode = process.env.NODE_ENV

  const app = express()
  // Apply middleware stack
  app.use(mode == 'production' ? logger('common') : logger('dev'))
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json())

  if(mode == 'production'){
    app.use((req, res, next) => {
      if(req.secure) {
        next()
      } else {
        res.redirect(`https://${req.headers.host}${req.url}`)  // Promote to HTTPS
      }
    })
  }

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
