---
title: React Render Performance Checklist
description: Find and fix unnecessary renders in real screens.
author: React Notes
inspiredBy: Profiling workflows
date: '2024-04-03'
vengeance:
  syncId: 4ce753e7-b6dc-40eb-a924-1ddff088c2c6
  obsidianPath: Blogs/frontend/react-render-performance-checklist.md
  lastSyncedAt: '2026-08-25T21:24:37.360Z'
  source: vengeance
---

## Measure first

Use React Profiler to find expensive commit paths.

## Stabilize references

Memoize callbacks and derived values when they trigger broad re-renders.

## Reduce tree churn

Move heavy components lower in the tree and avoid top-level state fan-out. Pair this with [A Complete Guide to useEffect](/frontend/complete-guide-useeffect) when effects are triggering extra renders.
