---
title: "MapReduce Explained Simply"
description: "How map and reduce scale batch processing across machines."
author: "Systems Notes"
inspiredBy: "Dean & Ghemawat (2004)"
date: "2004-12-01"
---

## Core idea

MapReduce separates user logic from distributed execution. You define map/reduce, the runtime handles partitioning, scheduling, shuffle, and retries.

## Map phase

Map reads input records and emits key/value pairs in parallel.

```tsx
function map(docId, text) {
  for (const word of tokenize(text)) emit(word, 1);
}
```

## Shuffle

All values for the same key are grouped and moved to reducers. This is often the most expensive phase.

## Reduce phase

Reducers aggregate grouped values.

```tsx
function reduce(word, counts) {
  emit(word, sum(counts));
}
```
