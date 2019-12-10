---
title: Create-A-Class
tags: Optimization
created: 2019-12-05
summary: Applying combinatorial optimization to competitive multiplayer video game strategy 
---

This post is about combinatorial optimization around the weapon modification system present in the multiplayer component of the recently released Call Of Duty game “Modern Warfare”, and not Object-Oriented programming, as the title would otherwise imply.

For those who are not aware, in Call Of Duty players are pit against each other in deathmatch or objective capture gamemodes. Being a first-person shooter, good gunplay and weapon customisation is an important part of the competitive multiplayer experience.

Modern Warfare takes weapon customisation a step further than its predecessors, enabling players to extensively modify weapons to suit their tastes in [Gunsmith](https://blog.activision.com/call-of-duty/2019-09/A-Deeper-Look-at-Modern-Warfare-Customization). Due to the large permutation of possible setups, I wondered whether it would be possible to predict the optimal modifications for a weapon given knowledge about the preferred playstyle of a player.

## Gunsmith

In the game world each weapon has a set of base attributes that determine how it handles. 
These include, but are not limited to, the range of the weapon, its damage and the recoil it imparts.

In Gunsmith players can modify upto five different places of a weapon. For the sake of gameplay balance, generally each attachment or modification improves some attributes and worsens others. 

The problem boils down to an economic one: maximising the player’s [utility](https://www.investopedia.com/terms/u/utility.asp) subject to cost constraints.

## Player Utility

In this model utility `U` is a multi-valued function of the weapon attributes, represented as a vector `x`. We observe that the model should have the following properties:

* Each attribute `x[i]` contributes independently to an increase in utility

  ```math
  U(\mathbf{x}) = \displaystyle\sum_i U_i(x_i)
  ```  

* For a given attribute, larger values are always preferred to smaller ones

  ```math
  \dfrac{\partial U}{\partial x_i} = \dfrac{\partial U_i}{\partial x_i} > 0 \ \forall \ i
  ```

The attribute vector itself is comprised of a base term and the sum of attachment contributions. Denote the presence of the j-th attachment in the i-th slot by a boolean variable. Then we can write

```math
\mathbf{x} = \mathbf{x_0} + \displaystyle\sum_i^m \displaystyle\sum_j^{n_i} \mathbf{\Delta x}_{ij}x'_{ij}, \ \text{where} \ x'_{ij} = \begin{cases}
   1 &\text{if present} \\
   0 &\text{if not present}
\end{cases}
```

Apart from the integrality constraint, there are two other limits to state:

* Gameplay mechanics mean we are restricted to making five modifications

  ```math
  \displaystyle\sum_i^m \displaystyle\sum_j^{n_i} x'_{ij} \leq 5
  ```

* We cannot make more than one modification in the same place

  ```math
  \displaystyle\sum_j^{n_i} x'_{ij} \leq 1 \ \forall \ i \in \{0, ... , m\}
  ```

To get further we need to propose a form for utility, our objective function. Composing it from a weighted sum of attribute contributions is a simple and intuitive model. More importantly, it will allow us to transform the problem into more tractable one later. 

```math
\begin{aligned}
  U(\mathbf{x}) &= \displaystyle\sum_i U_i(x_i) \\
                &= \displaystyle\sum_i u_ix_i \ \text{where} \ u_i > 0 \ \forall \ i \\
                &= \mathbf{u} \cdot \mathbf{x}
\end{aligned}
```

Apart from assuming a particular utility model, some other approximations are made implicitly:

1. We assume the player is willing to take the time to unlock all weapon modifications. Otherwise we would need to optimize their utility at every unlock level to obtain a family of solutions for the problem. 

2. Making a modification in one slot does not prevent another modification from being made in another slot, unless it will exceed the total number of possible modifications. In reality this is not the case -- one cannot attach a muzzle brake to a weapon fitted with an integral suppressor, for example.

3. Some modifications imbue characteristics that cannot be modelled in weapon stats. For instance, using .300 Blackout ammunition removes the tracers that give away a shooter’s position.

## The Knapsack Problem

Observe that maximising the original objective `U` is the same as maximising a transformed one `U'`:

```math
\begin{aligned}
  U'             &= U(\mathbf{x}) - \mathbf{u} \cdot \mathbf{x_0} \\
                 &= \mathbf{u} \cdot \left(\displaystyle\sum_i^m \displaystyle\sum_j^{n_i} \mathbf{\Delta x}_{ij} x'_{ij} \right) \\
                 &= \displaystyle\sum_i^m \displaystyle\sum_j^{n_i} x'_{ij} \times \mathbf{u} \cdot \mathbf{\Delta x}_{ij} \\
                 &= \displaystyle\sum_i^m \displaystyle\sum_j^{n_i} P_{ij} x'_{ij}
\end{aligned}
``` 

The optimization problem reduces to a variant of the [Multiple-Choice Knapsack Problem](https://doi.org/10.1016/0377-2217%2895%2900015-I) where i) the "prices" `P[i][j]` may be real valued, but ii) all the "objects" have a common weight of 1. This significant simplification enables us to devise a more straightforward algorithm than that reported in papers:

1. Sort the modifications in descending order of price `P[i][j]`
2. While modification slots are still available, select the next modification `(i, j)` provided:
   * its slot `i` is vacant
   * its price `P[i][j]` is positive

The runtime of this algorithm is dominated by the sorting, which can be done in linearithmic time. The memory usage is linear in the number of available modifications. The following Python code implements this algorithm, and incorporates a couple of practical improvements:

```python
class Attachment:
  def __init__(self, values):
    self.values = values

  def price(self, coeffecients):
    total = 0
    for coeffecient, price in zip(coeffecients, self.values):
      total += coeffecient * price
    return total

class Slot:
  def __init__(self, available_attachments = []):
    self.available_attachments = available_attachments

class Weapon:
  def __init__(self, slots = []):
    self.slots = slots

def knapsack(coefficients):
  def by_price(triple):
    (_, _, price) = triple
    return price

  def attachments(weapon):
    with_price = []
    for slot in weapon.slots:
      for attachment in slot.available_attachments:
        price = attachment.price(coefficients)
        # Disregard attachments with negative prices at the outset
        if price > 0:
          # Cache the computed price for sorting later
          with_price.append((slot, attachment, price)) 

    with_price.sort(key=by_price, reverse=True)

    filled_slots = set()
    chosen_attachments = set()
    i = 0

    while len(chosen_attachments) < 5 and i < len(with_price):
      (slot, attachment, _) = with_price[i]
      if not slot in filled_slots:
        chosen_attachments.add(attachment)
        filled_slots.add(slot)
      i += 1
    
    return chosen_attachments

  return attachments
```

## Loadouts and Classes

So far we know how to find the best loadout for a *given* weapon (and playstyle). We can go further and determine the best loadout for all weapon and attachment permutations.

Observe that attachment choice is tied solely to weapon choice. We can decompose the problem by i) maximising utility for every weapon independently, and ii) comparing utility values. Using a scan at this level is efficient only because there are a limited number of weapons in-game (about 30).

A **class** is typically comprised of:
* A long gun
* A sidearm
* Two pieces of explosive or tactical equipment
* Three Perks

Optimizing on the class-level is more of an art than a science, so we avoid it.

## Model correctness

It is difficult to verify the usefulness of applying utility-theory in this context mainly because of the lack of in-game weapon data. At the time of writing this article, most information reported online has been obtained experimentally and is far from being exhaustive. 

I believe the biggest assumption we have made comes from ranking attachments by their contribution to quantitative attributes alone. For example, weapon optics clearly aid most players in acquiring a target quickly due to the clear sight picture they provide. However, the weapon statistics would suggest they simply reduce aim-down-sight time.

