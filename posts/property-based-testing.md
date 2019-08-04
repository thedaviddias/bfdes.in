---
title: Property-based testing
tags: Testing
created: 2018-10-15
summary: An introduction to property-based testing and its applications in standard library algorithm validation
---

Today we discuss what property-based testing entails and why it is used in software development.

In addition, we test a sample algorithm comprehensively -- without and then with the aid of a library.

Scala is used as an expository language. It is fundamentally a functional programming language that retains some imperative features. We use them to show property-based testing is compatible with imperative code. Knowledge of Scala is not needed to follow this post, but it could help.

The final code is hosted on GitHub as a [gist](https://gist.github.com/bfdes/88f3292aa2d23e619714bee4221799d8) for reference.

## What is property-based testing?

Property-based testing involves providing a set of properties for the function or method under test. Effectively we define a specification that our implementation should adhere to.

Contrast this with the usual approach, where we provide *examples* which hold.
This may be satisfactory when we are testing simple business logic: 

> "**it** redirects unauthenticated user to login".

But not it is not necessarily sufficient when our outcomes are not binary:

> "**it** always returns a uniformly distributed random integer".

Property-based testing has its origins in functional programming, where data is modelled immutably and functions are pure. Specifying properties then has a direct correspondence to the way axioms are used to construct proofs of correctness in maths.

Consider the addition operation on integers. What conditions does it meet?

* Associativity:

  ```math
  \left( i + j \right) + k = i + \left( j + k \right) \space \forall \space i, j, k \in \mathbb{Z}
  ```
* Identity:

  ```math
  i + 0 = 0 + i = i \space \forall \space i \in \mathbb{Z}
  ```
* Commutativity:

  ```math
  i + j  = j + i \space \forall \space i, j \in \mathbb{Z}
  ```

The first two properties guarantee integers form a [Monad](https://en.wikipedia.org/wiki/Monad) on addition.

Property-based testing can be deployed to check algorithms that effect mutable data too.
We use it to test an implementation of MergeSort. 

## MergeSort

This implementation of MergeSort is transcribed to Scala from [Algorithms](https://algs4.cs.princeton.edu/home) by Sedgewick and Wayne.

It consists of two subroutines:
1. Split the array in two, recursively sorting each partition
2. Merge the sorted partitions

```scala
object Sorting {
  def mergeSort[T: ClassTag](a: Array[T])(implicit o: Ordering[T]): Unit = {
    val aux = new Array[T](a.length)  // Use a common auxiliary array

    // Sort the subsequence [l, h]
    def sort(l: Int, h: Int): Unit = {
      if(l < h) {
        val m = l + (h-l) / 2  // Account for integer overflow
        sort(l, m)
        sort(m+1, h)
        if(o.gt(a(m), a(m+1))) {
          merge(l, m, h)  // Only merge if [l, h] is not in order
        }
      }
    }

    // Merge the sorted subsequences [l, m] and (m, h]
    def merge(l: Int, m: Int, h: Int): Unit = {
      for(i <- l until h+1){
        aux(i) = a(i)
      }

      var i = l
      var j = m + 1
      for(k <- l until h+1) {
        if(i > m) {
          a(k) = aux(j)
          j += 1
        } else if(j > h) {
          a(k) = aux(i)
          i += 1
        } else if(o.lt(aux(j), aux(i))) {
          a(k) = aux(j)
          j += 1
        } else {
          a(k) = aux(i)
          i += 1
        }  // n.b. Stable implementation of the algorithm
      }
    }
    sort(0, a.length-1)  // Run the routine on the whole array
  }
}
```

There are a few idiosyncrasies of Scala in the above code that merit explanation:
* The `object` keyword is used to define [singleton objects](https://docs.scala-lang.org/tour/singleton-objects.html); we use it as a namespace 
* The `ClassTag` [mechanism](https://docs.scala-lang.org/overviews/reflection/typetags-manifests.html) accounts for JVM type-erasure
* Scala's `Ordering` object wraps over Java's `Comparator`
* A parameter marked as `implicit` will be looked for in scope if it is not provided by the caller
* Identifiers marked with `val` cannot be reassigned to, but those marked with `var` can.

We also provide a (pure) function to verify an array is sorted with respect to an `Ordering`:

```scala
def isSorted[T](a: Array[T])(implicit o: Ordering[T]): Boolean = {
  val indices = 0 until a.length-1
  val shifted = 1 until a.length
  indices.zip(shifted)
    .forall { case (i, j) => o.lteq(a(i), a(j)) }
}
```

Again we address the use of a couple of esoteric language features:
* The compiler promotes `Int` to `RichInt` so we may use the `until` method
* `until` creates a `Range` object for iteration; it is called in an [infix fashion](https://docs.scala-lang.org/style/method-invocation.html)
* We pass a pattern-matching anonymous function to `forall`

### Testing

A sorting funciton can be fully descibed by two properties:

1. it must permute its **input** to form its **output**,

   ```math
   \left(a_i \mid i \in I \right) = \left(a'_i \mid i \in I \right)
   ```

2. it must totally-order its input to form its output (the comparer defines the total-ordering)

  ```math
  a'_i \leq a'_j \space \forall \space i, j \in I \space \text{such that} \space i < j
  ```

We describe arrays as a [family](https://math.stackexchange.com/a/361530), and the primed elements belong to the permuted array.

Here is one strategy to programmatically generate integer array samples to verify the above:

* Progressively generate arrays of increasing size (up to a maximum)
* Large arrays encode exponentially more states, so generate more samples of these

In fact an array of size `n` will encode `math.pow(10, n)` states.

```scala
def arrays: Stream[Array[Int]] = {
  def sample(size: Int): Array[Int] =
    Array.fill(size)(rnd.nextInt())

  def samples(size: Int): Stream[Array[Int]] =
    Stream.fill(math.pow(2, size))(sample(size))

  Stream.range(0, maxSize).flatMap(samples)
}  // `maxSize` and `rnd` are set on the class
```

Note:
* The use of `Stream` means we only generate as many samples as we need
* We have struck a balance between getting representative samples and getting quick test feedback
* The second arguments of `Array.fill` and `Stream.fill` are evaluated [by-name](https://docs.scala-lang.org/tour/by-name-parameters.html)

We also need a utility to put the keys of an array in a histogram to verify property (2):

```scala
def histogram(a: Array[Int]): Map[Int, Int] = 
  a.foldLeft(Map.empty[Int, Int]) { (m, key) =>
    val count = m.getOrElse(key, 1)
    m + (key -> count)
  }
```

Using [ScalaTest](http://www.scalatest.org) as the test runner, the test-code ends up being quite lean.

```scala
class SortingTest extends FlatSpec {
  val rnd = new Random()
  val maxSize = 20

  // Context manager to give tests access to sample arrays
  def withFixture(testCode: Array[Int] => Boolean): Unit = {
    val maybeFailed = arrays.find(a => !testCode(a))
    maybeFailed.foreach(a =>
      fail(a.mkString("[", ", ", "]"))
    )
  }

  "mergeSort" should "produce a sorted array" in withFixture { array =>
    mergeSort(array)
    isSorted(array)
  }

  it should "rearrange keys" in withFixture { array =>
    val before = histogram(array)
    mergeSort(array)
    val after = histogram(array)
    before == after
  }
}
```

Again, a couple of language-specific features are employed that we should be aware of:
* We exploit the fact `Option` is a container type to write succinct code to fail the test
* `withFixture` is invoked in such a way that the method call looks like a control abstraction

The strategy in use to generate samples does not adequately cover the situation where arrays to sort are saturated with duplicate keys. Additionally, the tests fail to verify that our implementation of MergeSort is stable. Both shortcomings can be addressed with extra code, but it is cleaner to do so with ScalaCheck.

### Testing with ScalaCheck

[ScalaCheck](https://www.scalacheck.org) is a library designed to aid property-based testing. It is inspired by Haskell's QuickCheck.

To use ScalaCheck we need to be aware of abstract data types it exports:
* `Gen[T]` is a monad that encodes all the information necessary to produce samples of type `T`. 
* `Prop` is a type responsible for verifying a property by sampling a generator passed to it

Here is the (naïve) strategy for sample generation, re-written to support ScalaCheck:

```scala
def unsaturated: Gen[Array[Int]] =
  Gen.containerOf[Array, Int](Gen.posNum)
```

Note that ScalaCheck will decide the maximum sample size to use when running the test.

To test cases where duplicate keys are common we modify the generator that creates keys to limit itself to choose from the range `[0, sqrt(size))`, where the `size` is that of the array being filled. 

```scala
def saturated: Gen[Array[Int]] = {
  // One possible way of saturating the array with duplicate keys
  val sized = Gen.sized(s => Gen.choose(0, Math.sqrt(s).toInt))
  Gen.containerOf[Array, Int](sized)
}
```

A stable sorting algorithm is one that ensures that any two keys which compare equally maintain their relative positions in the array. To test `mergeSort` is stable we create arrays loaded with tuples, sorting them by the second element in the tuple *and then* the first. We should find that the mutated array should be sorted with respect to a compound order which orders the tuples by comparing first elements and, if necessary, breaks ties on the second element. (Actually, this is the default ordering for tuples in Scala.)

Here is the resulting test code, without the utility methods listed above:

```scala
object SortingSpecification extends Properties("mergeSort") {
  type Pair = (Int, Int)  // a type alias

  def pairs: Gen[Array[Pair]] = {
    val n = Gen.choose(0, 5)
    val pair = for {
      i <- n
      j <- n
    } yield (i, j)  // Syntax sugar for n.flatMap(i => n.map(j => (i, j)))
    Gen.containerOf[Array, Pair](pair)
  }

  property("isSorted") = Prop.forAll(unsaturated) { a =>
    mergeSort(a)
    isSorted(a)
  }

  property("keys") = Prop.forAll(unsaturated) { a =>
    val before = histogram(a)
    mergeSort(a)
    val after = histogram(a)
    before == after
  }

  property("isStable") = Prop.forAll(pairs) { a =>
    val byI = Ordering.by[Pair, Int](_._1)
    val byJ = Ordering.by[Pair, Int](_._2)

    mergeSort(a)(classTag[Pair], byJ)
    mergeSort(a)(classTag[Pair], byI)
    isSorted(a)  // Verify the array is sorted w.r.t. to the default ordering for tuples
  }
}
```

By using ScalaCheck we have traded some transparency for the ability to abstract away the details of test case generation. ScalaCheck can also perform [test case minimisation](https://github.com/rickynils/scalacheck/blob/master/doc/UserGuide.md#test-case-minimisation), which is useful for debugging.

## Further reading

MergeSort is an interesting algorithm because its worst-case performance matches the theoretical minimum. QuickSort is an algorithm that is *in practice* faster than MergeSort, but it is not stable. This is why system sorts typically use a variant of MergeSort for sorting reference types, and QuickSort for primitives. Sedgewick and Wayne discuss this in more detail.

If you want more insight into how ScalaCheck works it would be worth looking at the book [Functional Programming in Scala](https://www.manning.com/books/functional-programming-in-scala). The eight-chapter walks the reader through designing such a library. 
