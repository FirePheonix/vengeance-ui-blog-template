---
title: CSS Layout Debug Playbook
description: A practical sequence for fixing broken layouts fast.
author: Frontend Notes
inspiredBy: Production UI debugging
date: '2024-02-18'
vengeance:
  syncId: 96c4bc5f-cd06-4bb3-9f89-96b1ae6004fb
  obsidianPath: Blogs/frontend/css-layout-debug-playbook.md
  lastSyncedAt: '2026-08-25T21:24:37.356Z'
  source: vengeance
---

## Start with boxes

Inspect `display`, `position`, `width`, and `overflow` before tweaking spacing.

## Check parent constraints

Most bugs come from ancestor constraints, not the child component itself.

## Isolate quickly

Temporarily remove transforms and animations to identify structural issues. If the bug spans layout and paint, start from [How Browsers Work](/frontend/how-browsers-work).
