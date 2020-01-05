---
title: Hello World!
tags: React SSR
created: 2018-07-22
summary: Brief overview and comparison of various modern approaches of creating websites
---

After writing and then re-writing a blogging engine I thought I’d finally get round to publishing a blogpost.

Depending on your point of view [reinventing the wheel](https://www.gatsbyjs.org) can be a learning experience, or downright stupid. I thought what better way to start blogging than by, uh, documenting my experience.

## Server-side rendering

### Background

For those unfamiliar with web programming, there are currently three distinct ways to create websites:

* Serve a directory of HTML, CSS and images using a webserver like [NGiNX](https://www.nginx.com) or [IIS](https://www.iis.net).
  Typically programs called static site generators, such as [Jekyll](https://jekyllrb.com), are used to generate resources from markup. Rarely is it necessary to write HTML by hand.

* Use an MVC framework like [Django](https://www.djangoproject.com) to serve pages generated dynamically from templates.
  Requests will contain query or payload data to interact with the database and populate templates.

* Serve the same page for every route with a bundle of JavaScript that manipulates the [DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model) to facilitate rich interaction, and the [History API](https://developer.mozilla.org/en-US/docs/Web/API/History) to simulate browsing. Such Single Page Applications are usually created with frameworks like [Angular](https://angular.io) and [React](https://reactjs.org). SPA code almost always needs to consume content from an API server.

Static resources are easier to cache and static websites are more amenable to search engine optimization. In practice most [modern websites](https://netflix.com) are built using a combination of approaches because they need to support dynamic content and load efficiently.

### Isomorphic apps

Isomorphic applications are SPA-like websites that can 'run' on both server and web browser. This blog is built as an isomorphic app, using React components:

* The app server runs in a [Node.js](https://nodejs.org) environment, and each controller renders the relevant 'page'.
  In this scenario, React is effectively used as a templating engine.

* Client code uses the same top-level app component but wraps it in a router.
  The router enables the frontend code to manipulate the aforementioned History API.

Rendering the first page requested on the server reduces the apparent time taken to paint it. Note that SSR doesn't come for free: the server is under more load unless a caching strategy is employed.

This is the backend code responsible for generating the current page:

```jsx
// router.jsx
router.get('/posts/:slug', (req, res) => {
  // ... //
  const stream = renderToNodeStream(
    // Use of a static router to inform App.jsx which component to render,
    // and use of React's Context API to provide the post data
    <StaticRouter location={req.url} context={{}}>
      <Context.Post.Provider value={data}>
        <App />
      </Context.Post.Provider>
    </StaticRouter>
  )
  // Write the header, which includes the path to client JavaScript
  res.write(`<!DOCTYPE html><html lang="en"><head>${header(data)}</head><body><div id="root">`)
  stream.pipe(res, {end: false})
  // Terminate the response with the rest of the HTML
  stream.on('end', () => res.end('</div></body></html>'))
})
```

On the client JavaScript takes over, enabling rapid navigation between various ‘pages’ of the website. [React Router](https://github.com/ReactTraining/react-router) is responsible for the transitions between these views:

```jsx
// App.jsx
class App extends React.Component {
  render() {
    return (
      <>
        <Route path='/' component={Sidebar} />
        <Wrapper id="content">
          // Declarative API in React Router v4
          <Switch>
            <Route exact path='/' render={() => <Redirect to="/posts" />} />
            <Route exact path='/about' component={About} />
            <Route exact path='/posts' component={Posts} />
            <Route exact path='/posts/:slug' component={PostOr404} />
            <Route component={NoMatch} />
          </Switch>
        </Wrapper>
      </>
    )
  }
}
```

Recall that a `StaticRouter` instance in the controllers informs `App` which component it should render. But on the browser the router reads from and writes to the History API using a `BrowserRouter`:

```jsx
// browser/index.jsx
hydrate(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root')
);
```

## Build process

[Webpack](https://webpack.js.org/) is used as the module bundler. Two Webpack configurations are used to generate:
* client-side code and other assets under dist/static
* server-side code -- dist/server.js

By convention source code is stored according to whether it is shared or not:

```
client/
shared/
server/
```

## Publishing posts

Markup is versioned like source code. In this sense, the publishing mechanism is similar to that of Jekyll:
* Posts written in [Markdown](https://github.github.com/gfm/) are committed alongside code
* At build-time a custom Webpack loader bundles all the entries into the server code
* At runtime transformed entries are loaded into memory and queried on demand

Code snippets can be entered inline or in fenced code blocks: 

```javascript
marked.setOptions({
  renderer: new marked.Renderer(),
  highlight: (code, lang) => {
    if (typeof lang === "undefined") {
      return code;
    } else if (lang === "math") {
      return katex.renderToString(code);
    } else {
      return hljs.highlight(lang, code).value;
    }
  },
});
```

Highlighting is carried out by highlight.js, but delegated to katex.js for code marked as ‘math’. Both these tools tag the HTML strings they generate with classes that are targeted by CSS loaded on the client.

### Development

During development, Webpack watches the files and rebuilds the server and browser bundles on code change. Server-side code is run under [Nodemon](https://nodemon.io), so that the server can restart after recompilation.

### Production

For the production build, Webpack minifies code and carries out [tree-shaking](https://webpack.js.org/guides/tree-shaking/). This time the server-side code is run under a process manager so that the app can restart with the machine it runs on. NGiNX is used to serve static assets, but other requests are proxied to the Node.js app.

## Further reading

If you are thinking about writing a blog, consider using a static site generator to create your website.

However, keep in mind that they sacrifice the dynamism afforded by a hybrid solution. For example, if you wish to filter posts by tag then you will end up generating as many pages as you have tags.

If you want to learn more about the nuances of server-side rendering in React please take a look at Tyler McGinnis' [blog post](https://tylermcginnis.com/react-router-server-rendering). And if you wish to write in TypeScript take a look at [my repo](https://github.com/bfdes/bfdes.in) as well.
