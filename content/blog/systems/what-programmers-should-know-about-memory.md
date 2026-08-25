---
title: What Programmers Should Know About Memory
description: Why cache behavior dominates many real-world performance outcomes.
author: Performance
inspiredBy: Ulrich Drepper (2007)
date: '2007-11-21'
vengeance:
  syncId: cbda9151-f57d-4c5a-8f8d-b53ec697c8cb
  obsidianPath: Blogs/systems/what-programmers-should-know-about-memory.md
  lastSyncedAt: '2026-08-25T21:24:37.369Z'
  source: vengeance
---

## Memory hierarchy

Registers, caches, RAM, and storage have very different latency and bandwidth. Algorithms that ignore locality pay large runtime costs.

## Locality

- Temporal locality: reuse data soon
- Spatial locality: access nearby addresses
- Sequential access helps prefetchers

## Example

```tsx
// cache-friendly
for (let r = 0; r < rows; r++)
  for (let c = 0; c < cols; c++) sum += matrix[r][c];

// cache-hostile
for (let c = 0; c < cols; c++)
  for (let r = 0; r < rows; r++) sum += matrix[r][c];
```

For broader latency context, pair this with [Latency Numbers Every Developer Should Know](/systems/latency-numbers-every-dev-should-know).
