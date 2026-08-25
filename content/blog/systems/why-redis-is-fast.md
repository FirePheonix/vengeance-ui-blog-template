---
title: Why Redis Is Fast
description: 'In-memory data, focused primitives, and event-loop simplicity.'
author: Infrastructure
inspiredBy: Redis design notes
date: '2015-06-01'
vengeance:
  syncId: 5303873c-47eb-45c7-9da0-89e4cdda376a
  obsidianPath: Blogs/systems/why-redis-is-fast.md
  lastSyncedAt: '2026-08-25T21:24:37.371Z'
  source: vengeance
---

## Memory first

Redis keeps the active data set in RAM, removing disk latency from the hot path.

## Event loop

A mostly single-threaded execution model avoids lock contention for core operations.

```tsx
while (true) {
  const events = waitForSockets();
  for (const event of events) executeCommand(event);
}
```

## Tradeoffs

Heavy commands can block progress, memory is finite, and persistence/replication choices affect behavior under failure. For latency intuition behind those tradeoffs, see [Latency Numbers Every Developer Should Know](/systems/latency-numbers-every-dev-should-know).
