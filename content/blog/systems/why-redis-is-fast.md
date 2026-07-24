---
title: "Why Redis Is Fast"
description: "In-memory data, focused primitives, and event-loop simplicity."
author: "Infrastructure"
inspiredBy: "Redis design notes"
date: "2015-06-01"
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

Heavy commands can block progress, memory is finite, and persistence/replication choices affect behavior under failure.
