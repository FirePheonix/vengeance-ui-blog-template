---
title: How Browsers Work
description: From response bytes to painted pixels.
author: Web Platform
inspiredBy: Browser internals essays
date: '2011-08-01'
vengeance:
  syncId: 4d331cb1-1fa0-4f14-a7ad-2b52524233a6
  obsidianPath: Blogs/frontend/how-browsers-work.md
  lastSyncedAt: '2026-08-25T21:24:37.358Z'
  source: vengeance
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

Prefer transform/opacity animation and profile with real tools instead of guessing. For layout debugging, see [CSS Layout Debug Playbook](/frontend/css-layout-debug-playbook). For React-side performance, see [React Render Performance Checklist](/frontend/react-render-performance-checklist).
