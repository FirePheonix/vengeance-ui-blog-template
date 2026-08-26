---
title: CAP Theorem in Practice
description: Consistency and availability tradeoffs during network partitions.
author: Distributed Systems
inspiredBy: Brewer / Gilbert & Lynch
date: '2012-05-01'
---

## What CAP says

When partitions happen, distributed systems must choose between strong consistency and full availability for that operation.

## Common mistakes

- CAP is not a permanent global setting.
- Partition tolerance is not optional in real networks.
- Most systems pick tradeoffs per endpoint, not one label forever.

## Practical design

For payments and identity, many teams prefer consistency during faults. For feeds and analytics counters, eventual consistency is often acceptable — see [Eventual Consistency Playbook](/systems/eventual-consistency-playbook).
