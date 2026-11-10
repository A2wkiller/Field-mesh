## 2024-03-24 - O(14N) Stats Generation Anti-pattern
**Learning:** In the HQ Dashboard (`app/hq/index.tsx`), computing overall statistics by mapping and reducing the dataset independently for every single metric creates an O(14N) bottleneck. This works for tiny mock datasets but becomes unacceptably slow as the array grows in offline field scenarios.
**Action:** Always compute derived statistics from arrays in a single-pass loop/reduce (O(N)) instead of chaining multiple `.reduce` and `.filter` calls.
