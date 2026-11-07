## 2024-05-18 - Single Pass Loop Optimization
**Learning:** Using multiple array methods like `.reduce()` or `.filter()` sequentially on the same array inside a `useMemo` block creates multiple unnecessary passes over the array. This leads to `O(K * N)` time complexity where K is the number of array operations.
**Action:** Consolidate multiple iterative passes over the same dataset into a single `O(N)` loop pass inside computationally heavy blocks, especially in React `useMemo` hooks.
