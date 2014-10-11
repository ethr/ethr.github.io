---
layout: post
title: Steinhaus-Johnson-Trotter permutation algorithm
---
The [Steinhaus-Johnson-Trotter](http://en.wikipedia.org/wiki/Steinhaus%E2%80%93Johnson%E2%80%93Trotter_algorithm) algorithm is a way of creating a set of
permutations by swapping two adjacent items at a time. The program
below follows *Even's speed up* where items have a direction
associated with them. The Johnson algorithm can be implemented
recursively but I'm not totally sure how this is done.

In the program below, a list of numbers is given in data[] - these
could represent indexes in an array/vector etc... Each number has a
direction represented by the sign of the number. Negative means *move
left*, positive means *move right*. On each iteration step, the
largest mobile integer is select - mobile meaning that its move is
possible. A negative number in data[0] can not move in its desired
direction for example. If a number is the largest but is not mobile,
its sign is reversed so it starts moving in the other direction.

{% highlight cpp %}
#include <cstdio>
#include <cmath>
#include <algorithm>

size_t factorial(size_t n) {
  if (n == 1) {
    return 1;
  } else {
    return n*factorial(n-1);
  }
}

void allPerm() {
  int data[] = {-1,-2,-3,-4};
  const size_t data_len = 4;
  printf("Perm: %d %d %d %d\n", abs(data[0]), abs(data[1]),
      abs(data[2]), abs(data[3]));
  for (size_t i = 1; i < factorial(data_len); i++) {
    int largestIndex = -1;
    for (size_t j = 0; j  < data_len; j++) {
      bool isMobile = false;
      if (j == 0) {
        isMobile = data[j] > 0 && abs(data[j]) > abs(data[j+1]);
      } else if (j == data_len -1) {
        isMobile = data[j] < 0 && abs(data[j-1]) < abs(data[j]);
      } else {
        size_t adj = j;
        if (data[j] < 0) {
          adj -= 1;
        } else {
          adj += 1;
        }
        isMobile = abs(data[adj]) < abs(data[j]);
      }
      if (isMobile && (largestIndex==-1 || (abs(data[j]) >
              abs(data[largestIndex])))) {
        largestIndex = j;
      } else if (!isMobile && (largestIndex==-1 || (abs(data[j]) > 
              abs(data[largestIndex])))) {
        data[j] = data[j]*-1;
      }
    }
    size_t adj = largestIndex;
    if (data[largestIndex] < 0) {
      adj -= 1;
    } else {
      adj += 1;
    }
    std::swap(data[adj], data[largestIndex]);
    printf("Perm: %d %d %d %d\n", abs(data[0]), abs(data[1]), 
        abs(data[2]), abs(data[3]));
  }
}

int main() {
  allPerm();
}
{% endhighlight %}

The output of the program is shown below. Notice how the largest
number, 4, crosses across the output columns. For two adjacent rows it
halts because it fails the mobile test, giving an opportunity for the
smaller numbers to move around. I believe this is how the recursive
algorithm could be implemented although I'm not 100% sure.

    Perm: 1 2 3 4
    Perm: 1 2 4 3
    Perm: 1 4 2 3
    Perm: 4 1 2 3
    Perm: 4 1 3 2
    Perm: 1 4 3 2
    Perm: 1 3 4 2
    Perm: 1 3 2 4
    Perm: 3 1 2 4
    Perm: 3 1 4 2
    Perm: 3 4 1 2
    Perm: 4 3 1 2
    Perm: 4 3 2 1
    Perm: 3 4 2 1
    Perm: 3 2 4 1
    Perm: 3 2 1 4
    Perm: 2 3 1 4
    Perm: 2 3 4 1
    Perm: 2 4 3 1
    Perm: 4 2 3 1
    Perm: 4 3 2 1
    Perm: 3 4 2 1
    Perm: 3 2 4 1
    Perm: 3 2 1 4
