# [bfdes.in](https://www.bfdes.in)

[![Build Status](https://travis-ci.org/bfdes/bfdes.in.svg?branch=master)](https://travis-ci.org/bfdes/bfdes.in)

Source for my personal blog, built using React SSR and written in TypeScript.

The Blog is edited by supplying Jekyll-like Markdown documents in a posts directory beneath the root.

When the server boots all the documents are parsed into an object that can be queried.

### Requirements:

- Node 8.10.0
- Yarn 1.3.2 or greater

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

There is no dev server with hot reload facility because the point of SSR app development is to observe the static and traditional render.

#### Testing

Run `yarn test:watch` to run the tests using Jest in watch mode. Travis CI will also run this test suite for every code push to master.

### Deployment:

#### Heroku

Deployment via Heroku should be straightforward owing to the changes in the 'heroku' branch.

Fork this repo and clone the aforementioned branch, setting up Heroku deployment pipelines to listen for a code push.

#### Bare metal or VM

Running `yarn build:prod` generates two built bundles i) client code ii) server-side code.

- Configure your webserver to serve the client bundle under /static
- Run the server script under a Node.js process manager with a path to the folder containing posts.

  Since Webpack [cannot bundle certain server-side dependencies](https://github.com/webpack/webpack/issues/1576), you will need to install dependencies specified in package.json before running any code.
