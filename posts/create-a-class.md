---
title: Create-A-Class
tags: Optimisation
created: 2019-12-05
summary: Applying combinatorial optimisation to competitive multiplayer video game strategy 
---

This post is about combinatorial optimisation around the weapon modification system present in the multiplayer component of the recently released Call Of Duty game “Modern Warfare”, and not Object-Oriented programming, as the title would otherwise imply.

For those who are not aware, in Call Of Duty, players are pit against each other in deathmatch or objective capture game modes. Being a first-person shooter, good gunplay and weapon customisation is an important part of the competitive multiplayer experience.

Modern Warfare takes weapon customisation a step further than its predecessors, enabling players to modify weapons to suit their tastes extensively in [Gunsmith](https://blog.activision.com/call-of-duty/2019-09/A-Deeper-Look-at-Modern-Warfare-Customization).  I wondered whether it would be possible to determine the optimal modifications for a weapon without inspecting every permutation of attachments.

## Gunsmith

In the game world, each weapon has a set of base attributes that determine how it handles. 
These include, but are not limited to, the range of the weapon, its damage and the recoil it imparts.

In Gunsmith, players can modify up to five different places of a weapon. For the sake of gameplay balance, generally, each attachment or modification improves some attributes and worsens others. 

This optimisation problem mirrors a microeconomic one. Effectively, we seek to maximise a player’s [utility](https://www.investopedia.com/terms/u/utility.asp) subject to cost constraints imposed by game mechanics.

## Player Utility

In this model, utility `U` is a multi-valued function of the weapon attributes, represented as a vector `x`. Game mechanics dictate that the model should have the following properties:

* Each attribute `x[i]` contributes independently to an increase in utility

  ```math
  U(\mathbf{x}) = \displaystyle\sum_i U_i(x_i)
  ```  

* For a given attribute, larger values are always preferred to smaller ones

  ```math
  \dfrac{\partial U}{\partial x_i} = \dfrac{\partial U_i}{\partial x_i} > 0 \ \forall \ i
  ```

The attribute vector itself comprises of a base term and the sum of attachment contributions. If we denote the presence of the j-th attachment in the i-th slot by a boolean variable, we can then write

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
  \displaystyle\sum_j^{n_i} x'_{ij} \leq 1 \ \forall \ i
  ```

To get further, we need to propose a form for utility, our objective function. Composing it from a weighted sum of attribute contributions is a simple and intuitive model. More importantly, it will allow us to transform the problem into more tractable one later. 

```math
\begin{aligned}
  U(\mathbf{x}) &= \displaystyle\sum_i U_i(x_i) \\
                &= \displaystyle\sum_i u_ix_i \ \text{where} \ u_i > 0 \ \forall \ i \\
                &= \mathbf{u} \cdot \mathbf{x}
\end{aligned}
```

## The Real World

Apart from assuming a particular utility model that applies for every player, we have made some other approximations implicitly:

1. We expect that a player following this article is motivated enough to unlock all weapon modifications. Otherwise, we would need to optimise their utility at every weapon level to obtain a family of solutions. Although this is trivial to do, it complicates the notation used to describe the problem.

2. Modifications can be made independently of each other, and their effects on weapon attributes are also independent. In reality, this is not always the case -- one cannot attach a muzzle brake to a weapon fitted with an integral suppressor, for example.

3. All modifications imbue characteristics that can be modelled as changes to weapon attributes. For instance, Blackout ammunition, which removes the tracers that give away a player's position, can be accounted for by introducing a boolean component in the weapon attribute vector.

Of these, the second assumption is the hardest one to reconcile with our model. It is rare for one modification to prevent another from being made entirely, but there are suspicions that their contributions to weapon attribute changes are not additive.

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

Thus the optimisation problem reduces to a variant of the Multiple-Choice Knapsack Problem where each "price" `P[i][j]` may be real-valued, but all the "objects" have the same weight -- 1.

This simplification, courtesy of the problem domain, enables us to devise a more straightforward algorithm than that reported in research papers, such as that of [Bednarczuk E. (2018)](https://doi.org/10.1007/s10589-018-9988-z) and [Pisinger D. (1995)](https://doi.org/10.1016/0377-2217%2895%2900015-I).

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

    for (slot, attachment, _) in with_price:
      if len(chosen_attachments) > 5:
        break
      if not slot in filled_slots:
        chosen_attachments.add(attachment)
        filled_slots.add(slot)
    
    return chosen_attachments

  return attachments
```

## Loadouts and Classes

So far, the algorithm we have devised finds the best **loadout** for a playstyle, *given* a weapon. We can do better and determine the best loadout for all weapon and attachment permutations.

Observe that attachment choice is tied solely to weapon choice. So we can decompose the problem by:
1. maximising utility for every weapon independently (as before), and,
2. finding the weapon in this set with the largest utility.

Such an algorithm is efficient only because there are a limited number of weapons in-game (about 30).

A **class** is typically comprised of:
* A long gun
* A sidearm
* Two pieces of explosive or tactical equipment
* Three Perks

Optimising on the class-level is more of an art than a science. For this reason, it is not worth attempting.

## Model correctness

It is difficult to verify the usefulness of applying utility-theory in this context mainly because of the lack of in-game weapon data. At the time of writing this article, most weapon data [reported online](https://www.reddit.com/r/modernwarfare/comments/dslu8z/modern_warfare_2019_weapon_damage_guide_excel) has been obtained experimentally and is far from being exhaustive. 

Additionally, to a small degree, it is thought that modifications do not have independent effects, which makes it harder to derive raw weapon data from experiments.

