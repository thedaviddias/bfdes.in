# bfdes.in

Source for my personal blog, built using React SSR and written in TypeScript.

The Blog is edited by supplying Jekyll-like Markdown documents in a posts directory beneath the root. When the server boots all the documents are parsed into an in-memory object that can be queried.

### Usage:

#### Installation

Run ```yarn install``` within the root directory.

#### Local development

Run ```yarn build:dev``` which uses Webpack in watch mode to compile the TS source for both the frontend and the backend.

Then (also) run ```yarn serve:dev``` which uses Nodemon to serve the app on port 8080.
There is no dev server with hot reload facility because the point of SSR app development is to observe the static and traditional render.

#### Testing
TODO

#### Deployment

TODO
