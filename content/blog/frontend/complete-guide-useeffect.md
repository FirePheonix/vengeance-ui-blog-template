---
title: A Complete Guide to useEffect
description: Effects synchronize external systems; they are not lifecycle clones.
author: React Notes
inspiredBy: Dan Abramov / Overreacted
date: '2021-03-01'
---

## Mental model

Use effects for subscriptions, timers, imperative APIs, and other side effects outside React rendering.

## Dependencies are a contract

If an effect reads a value, include it in the dependency list or refactor so it no longer depends on that value.

```tsx
useEffect(() => {
  const controller = new AbortController();
  fetchUser(id, { signal: controller.signal });
  return () => controller.abort();
}, [id]);
```

## Avoid these

- Data transforms that belong in render
- Chained effects updating state repeatedly
- Fetching without cancellation

After cleaning up effects, use [React Render Performance Checklist](/frontend/react-render-performance-checklist) to verify render cost in real screens.
