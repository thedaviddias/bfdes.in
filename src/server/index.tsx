import * as express from 'express'
import { Request, Response, NextFunction } from 'express'
import * as path from 'path'
import * as bodyParser from 'body-parser'
import * as loggger from 'morgan'
import { renderToString } from 'react-dom/server'
import * as React from 'react'

import App from '../shared/containers/App'

const app = express()

if(process.env.NODE_ENV == 'development') {
  app.use(loggger('dev'))
}
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(express.static(path.resolve('dist')))

app.get('*', (req, res, next) => {
  const markup = renderToString(
    <App />
  )
  res.send(`
    <html>
      <head>
        <title>BFdes blog</title>
      </head>
      <body>
        <div id="root">${markup}</div>
      </body>
    </html>
  `)
})

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

module.exports = app
