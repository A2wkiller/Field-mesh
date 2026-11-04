## 2023-11-04 - [Single Pass Array Iteration]
**Learning:** In React Native dashboards dealing with array data (like survey records), computing multiple aggregate statistics using `.reduce` and `.filter` consecutively causes severe O(N*M) iteration bottlenecks (where M is the number of stats). This is a common anti-pattern in React reporting components.
**Action:** When computing multiple aggregates over the same array, always combine them into a single O(N) loop to drastically reduce CPU overhead during memoized state calculations.
