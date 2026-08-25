---
title: Latency Numbers Every Developer Should Know
description: Practical intuition for network and storage costs.
author: Performance
inspiredBy: Distributed systems fundamentals
date: '2019-08-12'
vengeance:
  syncId: 3e56e49b-b465-407e-910b-784b95c7b33c
  obsidianPath: Blogs/systems/latency-numbers-every-dev-should-know.md
  lastSyncedAt: '2026-08-25T21:24:37.365Z'
  source: vengeance
---

## Why this matters

Most architecture mistakes come from bad latency intuition.

## Typical hierarchy

- CPU cache: nanoseconds
- RAM: tens to hundreds of nanoseconds
- SSD: microseconds to milliseconds
- Network: milliseconds

## Design implication

Batch round trips and avoid synchronous chatty boundaries. [Why Redis Is Fast](/systems/why-redis-is-fast) is a concrete example of designing around those costs.
