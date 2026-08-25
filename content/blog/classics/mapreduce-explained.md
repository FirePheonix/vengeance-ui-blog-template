---
title: MapReduce Explained Simply
description: How map and reduce scale batch processing across machines.
author: Systems Notes
inspiredBy: Dean & Ghemawat (2004)
date: '2004-12-01'
vengeance:
  syncId: 5511585f-dc05-46ab-8c4d-9f855013a780
  obsidianPath: Blogs/classics/mapreduce-explained.md
  lastSyncedAt: '2026-08-25T21:24:37.345Z'
  source: vengeance
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

For consistency tradeoffs in distributed pipelines, see [CAP Theorem in Practice](/classics/cap-theorem-in-practice).
