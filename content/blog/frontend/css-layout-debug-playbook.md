---
title: "CSS Layout Debug Playbook"
description: "A practical sequence for fixing broken layouts fast."
author: "Frontend Notes"
inspiredBy: "Production UI debugging"
date: "2024-02-18"
---

## Start with boxes

Inspect `display`, `position`, `width`, and `overflow` before tweaking spacing.

## Check parent constraints

Most bugs come from ancestor constraints, not the child component itself.

## Isolate quickly

Temporarily remove transforms and animations to identify structural issues.
