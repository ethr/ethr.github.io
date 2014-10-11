---
layout: post
title: C program that prints itself
---
Was discussing this in the office the other day, quickly worked out how it could
be done using the # operator for macro arguments. The problem is that GCC
removes line feeds so all the source code appears on one line.

{% highlight c %}
#include "stdio.h"

char* getCodeAsString();

#define PRINT_CODE( CODE ) \
CODE \
char* getCodeAsString() { \
  return #CODE; \
}

PRINT_CODE (
  int main() {
    printf("%s\n", getCodeAsString());
  }
)
{% endhighlight %}
