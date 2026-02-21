

# Plan: Restructure DSA Forge - Open Access, Expanded Syllabus, and Leveled Theory

## Summary of Changes

Three major changes:
1. Remove sign-in gate -- app opens directly to Dashboard; sign-in/register buttons go in the top header bar
2. Expand the syllabus from 7 topics to ~30 topics (Flowcharts through Segment Trees, matching the reference image)
3. Restructure each topic's theory into Beginner / Medium / Advanced levels; remove all topic locking

---

## 1. Remove Sign-In Gate, Add Auth to Top Bar

**Current behavior:** If no user is logged in, the entire app shows the AuthPage (login wall).

**New behavior:**
- The app loads directly into the Dashboard/AppLayout for everyone -- no login required
- The top header bar (in AppLayout) gets "Sign In" and "Register" buttons on the right side
- Clicking either opens a dialog/modal with the auth form
- If the user is signed in, show their profile avatar + logout button in the header instead
- Progress saving (topic progress, submissions, daily activity) only works when signed in -- gracefully skip DB writes when not authenticated
- Remove the onboarding redirect gate (onboarding can be shown after first sign-in)

**Files changed:**
- `src/App.tsx` -- Remove the `if (!user) return <AuthPage />` and onboarding gate; always render AppLayout with routes
- `src/components/AppLayout.tsx` -- Add Sign In / Register buttons to the header; show user avatar when logged in; add auth dialog state
- `src/pages/AuthPage.tsx` -- Refactor into a reusable AuthDialog component that can be triggered from the header
- `src/hooks/useAuth.tsx` -- Make hooks safe when user is null (already mostly handles this)
- `src/hooks/useTopicProgress.tsx` -- Guard all DB calls with `if (!user) return` so anonymous users don't hit errors

---

## 2. Expand Syllabus to 30 Topics

Replace the current 7-topic `TOPICS` array with the full syllabus from the reference image:

1. Flowcharts
2. Variables and Data Types
3. Operators
4. If-Else Statements
5. Flow Control (Loops)
6. Patterns
7. Functions and Methods
8. Arrays
9. Sorting Algorithms
10. 2D Arrays
11. Strings
12. Bit Manipulation
13. OOPs
14. Recursion
15. Divide and Conquer
16. Backtracking
17. Time and Space Complexity
18. ArrayLists
19. Linked Lists
20. Stacks
21. Queues
22. Greedy Algorithms
23. Binary Trees
24. Binary Search Trees
25. Heaps / Priority Queues
26. Hashing
27. Tries
28. Graphs
29. Dynamic Programming
30. Segment Trees

**Key changes:**
- All topics have `prerequisites: []` (no locking)
- `nextTopics: []` for all (no dependency chain)
- Each topic gets a basic definition, analogy, whyUseIt, timeComplexity, spaceComplexity, and code examples
- Each topic gets 2-3 practice problems (easy/medium/hard)
- Existing detailed topics (Arrays, Recursion, Linked Lists, etc.) keep their current content; new topics get concise but useful content

**Files changed:**
- `src/data/curriculum.ts` -- Major rewrite to add all 30 topics with no prerequisites

---

## 3. Leveled Theory (Beginner / Medium / Advanced)

**Current behavior:** Each topic has a single flat theory section.

**New behavior:** Add a `theoryLevels` field to the `TopicContent` interface:

```
theoryLevels: {
  beginner: { title, content, codeExample };
  intermediate: { title, content, codeExample };
  advanced: { title, content, codeExample };
}
```

- The TheoryPage shows 3 tabs or accordion sections: "Beginner", "Intermediate", "Advanced"
- Each level has its own explanation and code example appropriate to that difficulty
- Practice problems are grouped by difficulty under the theory

**Files changed:**
- `src/data/curriculum.ts` -- Add `theoryLevels` to the interface and populate for all 30 topics
- `src/pages/TheoryPage.tsx` -- Add tabs for Beginner / Intermediate / Advanced; render level-specific content

---

## 4. Remove All Locking Logic

- `src/pages/CurriculumPage.tsx` -- Remove locked/unlocked status badges and locked styling; all topics show as accessible
- `src/pages/TheoryPage.tsx` -- Remove the "Topic Locked" section and prerequisite warnings
- `src/hooks/useTopicProgress.tsx` -- Simplify `getTopicStatus` to only return 'unlocked', 'in-progress', or 'completed' (never 'locked')

---

## Technical Details

### Updated TopicContent Interface
```typescript
interface TheoryLevel {
  title: string;
  content: string;
  codeExample: Record<Language, string>;
}

interface TopicContent {
  id: string;
  title: string;
  icon: string;
  color: string;
  order: number;
  prerequisites: string[]; // always empty now
  nextTopics: string[];    // always empty now
  estimatedHours: number;
  definition: string;
  analogy: string;
  whyUseIt: string;
  theoryLevels: {
    beginner: TheoryLevel;
    intermediate: TheoryLevel;
    advanced: TheoryLevel;
  };
  timeComplexity: { operation: string; best: string; average: string; worst: string }[];
  spaceComplexity: string;
  codeExamples: Record<Language, string>;
  problems: Problem[];
}
```

### Auth Flow Change
- `AppRoutes` always renders `<AppLayout><Routes>...</Routes></AppLayout>`
- A new `<AuthDialog>` component wraps the existing auth form in a modal dialog
- AppLayout header: if logged in shows avatar + logout; if not shows "Sign In" / "Register" buttons that open the dialog
- Onboarding shows as a banner/prompt after first sign-in rather than a full-page redirect

### Files Modified (Summary)
| File | Change |
|------|--------|
| `src/App.tsx` | Remove auth gate, always show routes |
| `src/components/AppLayout.tsx` | Add auth buttons to header, auth dialog |
| `src/components/AuthDialog.tsx` | New -- reusable auth modal |
| `src/data/curriculum.ts` | Expand to 30 topics, add theoryLevels, remove prerequisites |
| `src/pages/TheoryPage.tsx` | Add Beginner/Intermediate/Advanced tabs, remove lock UI |
| `src/pages/CurriculumPage.tsx` | Remove lock styling, simplify status display |
| `src/hooks/useTopicProgress.tsx` | Remove lock logic, guard for anonymous users |
| `src/pages/Onboarding.tsx` | Show conditionally after sign-in instead of as gate |

