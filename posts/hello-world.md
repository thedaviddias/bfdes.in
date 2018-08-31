# ----
title: Hello World!
tags: React SSR
created: 2018-07-22
# ----

After writing and then re-writing a blogging engine I thought I’d finally get round to publishing a blogpost.

Depending on your point of view [reinventing the wheel](https://www.gatsbyjs.org) can be a learning experience, or downright stupid.
I thought what better way to start blogging than by, uh, documenting my experience.

## Server-side rendering

### Background

For those unfamiliar with web programming, there are currently three distinct ways to create websites:

* Serve a directory of HTML, CSS and images using a webserver like [NGiNX](https://www.nginx.com) or [IIS](https://www.iis.net).
  Typically programs called static site generators (e.g. [Jekyll](https://jekyllrb.com)) are used to create these sites.

* Use an MVC framework like [Django](https://www.djangoproject.com) to serve pages generated dynamically from templates.
  Requests will contain query or payload data to interact with the database and populate templates.

* Serve the same page for every route with a bundle of JS that manipulates the [History API](https://developer.mozilla.org/en-US/docs/Web/API/History).
  Such Single Page Applications are usually created with frameworks like [Angular](https://angular.io) and [React](https://reactjs.org).
  SPA code almost always needs to consume content from an API server.

Of course in practice most websites are built using a combination of approaches.

### Isomorphic apps

Isomorphic applications are SPA-like websites that can 'run' on both client and server.
This blog is built as an isomorphic app, using React components:

* The appserver runs in a Node environment, and each controller renders the relevant component.
  In this context React is effectively used as a template generating function.

* Client code uses the same top-level App component, but wraps it in a router.
  The router enables the frontend code to manipulate the aforementioned History API.

Rendering the first page requested in advance reduces the apprent time to first paint.
It is also a form of SEO: webcrawlers find it easier to parse and index plain HTML.

This is the backend code responsible for generating the current page:

```tsx
// router.tsx
router.get('/posts/:slug', (req, res) => {
  // ... //
  const jsx = sheet.collectStyles(
    // Use of a static router to inform App.tsx which cpt. to render
    <StaticRouter location={req.url} context={{}}>
      // Use of React's Context API to provide view data
      <Context.Post.Provider value={data}>
        <App />
      </Context.Post.Provider>
    </StaticRouter>
  )
  const stream =
    sheet.interleaveWithNodeStream(renderToNodeStream(jsx))
  // Write the header, which includes the path to client JS
  res.write(
    `<html>
      <head>${headerFor(data)}</head>
      <body>
        <div id="root">
    `)
  stream.pipe(res, {end: false})
  // Terminate the response with the rest of the HTML
  stream.on('end', () => res.end('</div></body></html>'))
})
```

Note that streaming markup reduces the actual time for first paint.

Then client JS takes over, enabling rapid navigation between various ‘pages’ of the website.
[React Router](https://github.com/ReactTraining/react-router) is responsible for the transitions between these views:

```tsx
// App.tsx
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
            <Route exact path='/posts' component={withTag(Posts)} />
            <Route exact path='/posts/:slug' component={withSlug(PostOr404)} />
            <Route component={NoMatch} />
          </Switch>
        </Wrapper>
      </>
    )
  }
}
```

Recall that we use a static router in the controllers to inform App which component it should render.
But on the browser the router reads from and writes to the History API to enable navigation:

```tsx
// browser/index.tsx
hydrate(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root')
);
```

## Build process

[Webpack](https://webpack.js.org/) is used to transpile TypeScipt and TSX to JavaScript, and to resolve imports.
Two Webpack configurations are used to generate:
* Client side code, targeting browsers, and other assets under dist/static
* Server side code -- dist/server.js

By convention we store relevant files according to whether they are shared or not:

```
client/
shared/
server/
```

### Development

During development Webpack watches the files and rebuilds on code change.
Appserver code is run under Nodemon so the server restarts during recompilation and as posts change.

### Production

For the production build Webpack minifies code and carries out [tree-shaking](https://webpack.js.org/guides/tree-shaking/).
This time the appserver is run under a process manager so that it can restart with the machine it runs on.
Generally a webserver like NGiNX is used to serve static assets and proxy requests to the appserver.

## Publishing posts

The publishing mechanism is similar to that of Jekyll; posts written in [markdown](https://github.github.com/gfm/) are commited with code.
As the server boots it parses all these files and renders them into an object that can be queried on demand.

Code snippets can be entered inline or in fenced code blocks: 

```javascript
marked.setOptions({
  renderer: new marked.Renderer(),
  // ... //
  highlight: (code, lang) => {
    if(typeof lang == 'undefined') {
      return code
    } else if(lang == 'math') {
      return katex.renderToString(code)
    } else {
      return hljs.highlightAuto(code).value
    }
  }
})
```

Highlighting is carried out by highlight.js, but delegated to katex.js for code marked as ‘math’.
Both these tools tag the HTML they generate with classes that are targeted by CSS loaded on the client.

## Further reading

If you are thinking about writing a blog or creating documentation consider using [Gatsby.js](https://www.gatsbyjs.org) or [Next.js](https://nextjs.org).

However, keep in mind that they sacrifice the dynamism afforded by a hybrid solution.
e.g. if you wish to filter posts by tag then you will end up generating as many pages as you have tags.

If you want to learn more about server-side rendering please take a look at [this](https://tylermcginnis.com/react-router-server-rendering/) blog post.
And if you wish to write in TypeScript take a look at [my repo](https://github.com/bfdes/bfdes.in) as well.