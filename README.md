# bfdes.in

[![Build Status](https://travis-ci.org/bfdes/bfdes.in.svg?branch=master)](https://travis-ci.org/bfdes/bfdes.in)

Source for my personal blog, built using React SSR and written in TypeScript.

The Blog is edited by supplying Jekyll-like Markdown documents in a posts directory beneath the root. When the server boots all the documents are parsed into an object that can be queried.

### Requirements:

- Node 8.10.0
- Yarn 1.3.2 or greater

### Usage:

#### Installation

Run ```yarn install``` within the root directory.

#### Local development

Run ```yarn build:dev```. Uses Webpack in watch mode to compile the TS source for both the frontend and the backend.

Then (also) run ```yarn serve:dev``` to serve the app on port 8080 using Nodemon.
There is no dev server with hot reload facility because the point of SSR app development is to observe the static and traditional render.

#### Testing

Run ```yarn test:watch``` to run the tests using Jest in watch mode. Travis CI will run this same test suite for every code push to master.

### Deployment:

TODO
