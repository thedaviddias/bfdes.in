# bfdes.in

[![Build Status](https://travis-ci.org/bfdes/bfdes.in.svg?branch=master)](https://travis-ci.org/bfdes/bfdes.in)

Source for my personal blog, built using React SSR and written in TypeScript.

The Blog is edited by supplying Jekyll-like Markdown documents in a posts directory beneath the root.

When the server boots all the documents are parsed into an object that can be queried.

### Requirements:

* Node 8.x
* Yarn 1.5.x

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

Travis CI will also run this test suite for every code push to master.

### Deployment:

#### Heroku

Fork this repo and set up Heroku deployment pipelines to listen for a code push.

#### Bare metal or VM

Running `yarn build:prod` generates two built bundles i) client code ii) server-side code.

* Run the server bundle under a Node.js process manager with a path to the folder containing posts.
* Optional: Configure your webserver to serve dist/static under /, and proxy other requests to Express  

### Known issues:

* Building the app will generate a couple of warnings:
  * 'bundle.js exceeds the recommended size'

    Ordinarily this would be an issue, but we are streaming the first page for a fast paint, so it is not so bad.
  * From bundling Express: 'the request of a dependency is an expression'

    Bundling server-side modules with Webpack has [always been problematic](https://github.com/webpack/webpack-dev-server/issues/212).
