---
layout: post
title: Git delete remote branches
---

This one-liner will grab all the remote git branches matching a particular regex and prompt the user about whether to delete them or not. Answer with a word starting with 'y' will delete the remote branch.

```bash
#!/bin/bash
xargs -a <( git branch -r | grep INSERT_SEARCH | sed -e "s/origin\///" ) sh -c 'for arg in $@; do read -p "Delete remote branch \"$arg\"?  " yN; case $yN in [Yy]*) git push origin --delete $arg; esac ; done'
```
