
# Plan: Complete Theory Content + Animated Learning for All 30 Topics

## What's Changing

The curriculum currently has 30 topics, but only the first 9 (Flowcharts through Sorting) have real theory content. Topics 10-30 (2D Arrays through Segment Trees) have placeholder text like "Coming soon." This plan fills in all content and adds animated transitions for a polished learning experience.

## Content Structure Per Topic

Every topic will follow this exact structure:

```
Topic (e.g., Arrays)
  |-- What is it? (definition + real-world analogy)
  |-- Why use it?
  |-- Beginner Level
  |     |-- Theory explanation (concepts, terminology, memory model)
  |     |-- Code examples (Python, Java, C++)
  |     |-- Practice problems (easy difficulty)
  |-- Intermediate Level
  |     |-- Theory explanation (patterns, techniques, optimizations)
  |     |-- Code examples (Python, Java, C++)
  |     |-- Practice problems (medium difficulty)
  |-- Advanced Level
  |     |-- Theory explanation (edge cases, competitive programming, interview patterns)
  |     |-- Code examples (Python, Java, C++)
  |     |-- Practice problems (hard difficulty)
  |-- Time & Space Complexity table
```

## Topics Getting Full Content (21 topics)

Each will get proper theory text, real code examples, and specific practice problems:

| # | Topic | Beginner Focus | Intermediate Focus | Advanced Focus |
|---|-------|---------------|-------------------|---------------|
| 10 | 2D Arrays | Matrix creation, traversal | Rotation, spiral traversal | Search in sorted matrix |
| 11 | Strings | String basics, comparison | Pattern matching, anagrams | KMP algorithm, Z-function |
| 12 | Bit Manipulation | Binary representation, AND/OR/XOR | Set/clear/toggle bits | Power set, bit DP |
| 13 | OOPs | Classes, objects, constructors | Inheritance, polymorphism | Design patterns, SOLID |
| 14 | Recursion | Base case, factorial, fibonacci | Tower of Hanoi, subsets | Memoization, tree recursion |
| 15 | Divide & Conquer | Binary search, merge sort concept | Merge sort, quick sort | Closest pair, matrix multiply |
| 16 | Backtracking | Permutations, combinations | N-Queens, Sudoku solver | Word search, graph coloring |
| 17 | Time & Space Complexity | Big O basics, counting operations | Amortized analysis, log n | Master theorem, space tradeoffs |
| 18 | ArrayLists | Dynamic array basics, add/remove | Iterator, resizing | Custom implementation |
| 19 | Linked Lists | Singly linked list, traversal | Doubly linked, reversal | Cycle detection, merge k lists |
| 20 | Stacks | Push/pop, balanced parentheses | Infix to postfix, evaluation | Monotonic stack, largest rectangle |
| 21 | Queues | Enqueue/dequeue, circular queue | Deque, priority queue basics | Sliding window max, BFS |
| 22 | Greedy | Activity selection, coin change | Fractional knapsack, Huffman | Interval scheduling, job sequencing |
| 23 | Binary Trees | Tree creation, traversals (DFS) | BFS, height, diameter | LCA, serialization, path sum |
| 24 | BST | Insert, search, inorder | Delete, validation, floor/ceil | AVL rotation, Red-Black concept |
| 25 | Heaps | Min/max heap, insert/extract | Heap sort, kth smallest | Median stream, merge k sorted |
| 26 | Hashing | Hash map basics, frequency count | Collision handling, chaining | Open addressing, custom hash |
| 27 | Tries | Insert, search prefix | Autocomplete, word dictionary | Compressed trie, XOR trie |
| 28 | Graphs | Adjacency list, BFS/DFS | Cycle detection, topological sort | Dijkstra, Bellman-Ford, MST |
| 29 | Dynamic Programming | Fibonacci, climbing stairs | 0/1 knapsack, LCS, LIS | Edit distance, matrix chain, bitmask DP |
| 30 | Segment Trees | Build, point query | Range sum, range min query | Lazy propagation, range update |

## Practice Problems Per Topic

Each topic will have 3-5 specific, well-described practice problems instead of generic ones:
- 1-2 easy problems matching beginner theory
- 1-2 medium problems matching intermediate theory
- 1 hard problem matching advanced theory

## Animation Enhancements for TheoryPage

Add smooth, engaging transitions to the learning experience:

1. **Staggered fade-in** -- Theory sections animate in one by one with a slight delay (like cards appearing)
2. **Tab transition animation** -- Switching between Beginner/Intermediate/Advanced has a smooth slide/fade effect
3. **Code block reveal** -- Code examples slide up with a subtle glow effect when the tab is selected
4. **Progress indicator** -- A colored progress bar at the top of the theory section showing which level is active
5. **Accordion smooth expand** -- Smoother open/close animations for the What/Why/Complexity sections
6. **Hover glow on practice problems** -- Each problem card glows with the topic's accent color on hover

## Files Modified

| File | What Changes |
|------|-------------|
| `src/data/curriculum.ts` | Major rewrite of topics 10-30 with full theory, code examples, and real practice problems |
| `src/pages/TheoryPage.tsx` | Add animation classes, staggered fade-in, tab transition effects, code reveal animations |
| `src/index.css` | Add new animation keyframes for stagger-fade, code-reveal, tab-slide, and glow effects |
| `tailwind.config.ts` | Register new animation utilities |

## Technical Details

### New CSS Animations

```css
/* Stagger fade-in for theory content */
@keyframes stagger-fade {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Code block reveal */
@keyframes code-reveal {
  from { opacity: 0; transform: translateY(8px); filter: blur(2px); }
  to { opacity: 1; transform: translateY(0); filter: blur(0); }
}

/* Tab content slide */
@keyframes tab-slide-in {
  from { opacity: 0; transform: translateX(12px); }
  to { opacity: 1; transform: translateX(0); }
}
```

### TheoryPage Animation Approach

- Each section gets an animation delay based on its index: `animation-delay: ${index * 0.1}s`
- Tab content uses `key={level}` to trigger re-mount animation on tab switch
- Code blocks get a separate delayed animation for a "typewriter-like" reveal feel
- Practice problem cards stagger in when the accordion opens

### Curriculum Data Structure

Topics 10-30 will be converted from the current `.map()` shorthand with placeholders to fully fleshed-out objects matching the same structure as topics 1-9, with:
- Multi-paragraph theory content explaining concepts step by step
- Real, working code examples in Python, Java, and C++
- Specific practice problems with clear descriptions (e.g., "Rotate a matrix 90 degrees clockwise" instead of "2D Arrays Medium")
- Accurate time/space complexity tables per operation
