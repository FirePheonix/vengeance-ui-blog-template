---
title: "Eventual Consistency Playbook"
description: "How to design user flows when data converges asynchronously."
author: "Distributed Systems"
inspiredBy: "Production reliability patterns"
date: "2023-01-10"
---

## Expose state clearly

Show syncing / pending status instead of pretending writes are instantly global.

## Use idempotency keys

Retries are inevitable; idempotency prevents duplicate side effects.

## Resolve conflicts deterministically

Choose domain rules for merges and keep conflict outcomes predictable.
