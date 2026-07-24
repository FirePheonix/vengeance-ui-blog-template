---
title: "Latency Numbers Every Developer Should Know"
description: "Practical intuition for network and storage costs."
author: "Performance"
inspiredBy: "Distributed systems fundamentals"
date: "2019-08-12"
---

## Why this matters

Most architecture mistakes come from bad latency intuition.

## Typical hierarchy

- CPU cache: nanoseconds
- RAM: tens to hundreds of nanoseconds
- SSD: microseconds to milliseconds
- Network: milliseconds

## Design implication

Batch round trips and avoid synchronous chatty boundaries.
