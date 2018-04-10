# ----
title: My first post
tags: Algorithms Python
created: 2018-03-11
# ----
This blogging engine reads Markdown source files and renders them using marked.js.
Inline code looks like ```print("Hello World")```.
Block level code (GFM fenced code block) with sytax highlighting is also possible

```python
def factorial(n):
  if(n == 0) {
    return 1
  }
  return n*factorial(n-1)
```
by way of highlight.js.

The engine can also render a subset of LaTeX. Such markup should be delimited with \`\`\`math and \`\`\`.
LaTeX rendering is implemented by passing the content of fenced code blocks with 'math' dialect through KaTex renderer.
Although this means it is not possible to inline LaTeX markup within Markdown, the simpler solution is more robust.

```math
x = \dfrac{ -b \pm \sqrt{ b^2 - 4ac } }{ 2a }
```
