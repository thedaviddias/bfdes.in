# ----
title: Monte Carlo to Las Vegas
tags: Algorithms API
created: 2019-06-15
# ----

## Background

The Monte Carlo class of algorithms are those which we can guarantee terminate in finite time but which may produce an incorrect result now and then. A Las Vegas algorithm on the other hand is guaranteed to produce a correct result, but we might only be able to obtain a probabilistic measure of its runtime.

In certain cases it is possible to formulate a Las Vegas variant from the Monte Carlo variant of an algorithm.

The Rabin Karp substring search algorithm has this property. Suppose substring search algorithms are exposed as functions `f` that accept substrings `p` and return search functions for the text `t`:

```math
f : p \mapsto t \mapsto i,
\ \text{where} \ i =
\begin{cases}
  -1 &\text{if not found} \\
   i \in I &\text{if found}
\end{cases}
```

The goal is to enable the client to write Las Vegas variant `las_vegas` in terms of the Monte Carlo variant `monte_carlo` (alias for `f`) in order to maintain a lean API.

## Rabin-Karp

The Rabin Karp algorithm attempts to find the target pattern by computing a rolling hash of successive substrings. In the Monte Carlo variant we return the index that defines the first substring with a hash matching that of the pattern -- if one exists.

```python
def rabin_karp(pattern):
  # Monte Carlo variant of Rabin Karp

  r = 256  # Search over ASCII characters
  q = 997  # Large prime number
  m = len(pattern)

  def hash(s):
    # Hash the first m characters of s
    h = 0
    for c in s[:m]:
      h = (h * r + ord(c)) % q
    return h
  
  pattern_hash = hash(pattern)

  def search(text):
    # Compare the rolling hash to the pattern hash
    text_hash = hash(text)
    n = len(text)
    if text_hash == pattern_hash:
      return 0

    # Precompute r^(m-1) % q for use in removing leading digit
    R = 1
    for _ in range(1, m):
      R = (r * R) % q

    for i in range(m, n):
      # Remove contribution from the leading digit
      text_hash = (text_hash + q - R * ord(text[i-m]) % q) % q
      # And add contribution from trailing digit  
      text_hash = (text_hash * r + ord(text[i])) % q   
      if text_hash == pattern_hash:
        return i - m + 1
    return -1  # Not found
  
  return search
```

The Las Vegas variant additionally performs an equality check if the hashes match before returning. But this is equivalent to modifying the Monte Carlo variant to call itself on the remaining portion of text if the equality check fails, viz:

```python
def las_vegas(pattern):
  original = monte_carlo(pattern)
  m = len(pattern)
  def search(text, start=0):
    i = original(text[start:])
    if i == -1:
      return -1
    if pattern == text[start+i:start+i+m]:
      return start+i
    return search(text, start+i+1)
  
  return search
```

There are a couple of perfomance and memory usage penalties to be mindful of:

* When working in a language that does not come with a tail-call optimizing compiler an (iterative) implementation written from scratch could stop the algorithm consuming too many stack frames.
* Calling the original search function repeatedly will force recomputation of the factor responsible for removing the leading digit. This can be avoided by writing the implementation from scratch, as above.

## Further reading

The Rabin Karp implementation is taken from Algorithms II by Sedgewick and Wayne.

[This article](https://yourbasic.org/algorithms/las-vegas/) provides an excellent explanation of the difference between Monte Carlo and Las Vegas algorithms, and also makes a distinction between a Monte Carlo algorithm and a Monte Carlo simulation. 
