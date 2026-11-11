## 2024-06-03 - HQ Dashboard Array Traversal Optimization
**Learning:** The HQ dashboard `stats` calculation originally performed ~10 sequential iterations (using `reduce` and `filter`) over the entire `disasterSurveys` array on every render pass. Since this array stores survey data, its size can scale linearly during disaster events.
**Action:** Always combine multiple map/filter/reduce operations over the same large dataset into a single O(N) iteration block where possible to prevent CPU bottlenecking on the main thread in React Native.
