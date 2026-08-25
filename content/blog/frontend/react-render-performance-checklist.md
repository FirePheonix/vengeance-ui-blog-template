---
title: React Render Performance Checklist
description: Find and fix unnecessary renders in real screens.
author: React Notes
inspiredBy: Profiling workflows
date: '2024-04-03'
---

## Measure first

Use React Profiler to find expensive commit paths.

## Stabilize references

Memoize callbacks and derived values when they trigger broad re-renders.

## Reduce tree churn

Move heavy components lower in the tree and avoid top-level state fan-out. Pair this with [A Complete Guide to useEffect](/frontend/complete-guide-useeffect) when effects are triggering extra renders.
