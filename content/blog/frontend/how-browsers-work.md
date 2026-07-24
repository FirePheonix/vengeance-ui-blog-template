---
title: "How Browsers Work"
description: "From response bytes to painted pixels."
author: "Web Platform"
inspiredBy: "Browser internals essays"
date: "2011-08-01"
---

## Navigation

The browser resolves DNS, opens transport, streams HTML, and starts parsing before the full response arrives.

## Render tree

DOM and CSSOM combine into a render tree for visible elements. Scripts can block parsing unless deferred.

## Layout paint composite

- Layout computes geometry
- Paint fills pixels
- Composite merges layers

### Performance hint

Prefer transform/opacity animation and profile with real tools instead of guessing.
