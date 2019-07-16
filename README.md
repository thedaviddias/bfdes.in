# bfdes.in

[![CircleCI](https://circleci.com/gh/bfdes/bfdes.in.svg?style=svg)](https://circleci.com/gh/bfdes/bfdes.in)
[![Codecov](https://codecov.io/gh/bfdes/bfdes.in/branch/master/graph/badge.svg)](https://codecov.io/gh/bfdes/bfdes.in)

Source for my personal blog, built using React SSR and written in TypeScript.

The Blog is edited by supplying Jekyll-like Markdown documents in a posts directory beneath the root.

When the server boots all the documents are parsed into an object that can be queried.

### Requirements:

* Node 10.x
* Yarn 1.10.x

### Usage:

#### Installation

Run `yarn install` within the root directory.

#### Local development

Run `yarn build:dev`. Uses Webpack in watch mode to compile the TS source for both the frontend and the backend.

Write any posts you wish to display in a 'posts' folder under the root directory. The format is

```
# ----
title: <TITLE>
tags: <TAG1> <TAG2>
created: <YEAR>-<MONTH>-<DAY>
# ----
<BODY IN MARKDOWN>
```
and the name of the markdown file should correspond to the slug of its post.

Then (also) run `yarn serve:dev` to serve the app on port 8080 using Nodemon.

#### Testing

Run `yarn test:watch` to run the tests using Jest in watch mode.

Circle CI will also run this test suite for every code push to master.

### Deployment:

Running `yarn build:prod` generates two bundles
* Client code under the /static folder
* A single file of server-side code

Run the server-side code using Node.js, and optionally configure a webserver to serve assets under /static.

You may also wish to run multiple instances of the app and use your webserver as a load balancer.

### Known issues:

* From bundling Express: 'the request of a dependency is an expression'

  Bundling server-side modules with Webpack has [always been problematic](https://github.com/expressjs/express/issues/2832).
