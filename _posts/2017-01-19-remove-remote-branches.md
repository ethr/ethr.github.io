---
layout: post
title: Git delete remote branches
---

```bash
#!/bin/bash
xargs -a <( git branch -r | grep origin/private/je | sed -e "s/origin\///" ) sh -c 'for arg in $@; do read -p "Delete remote branch \"$arg\"?  " yN; case $yN in [Yy]*) git push origin --delete $arg; esac ; done'
```
