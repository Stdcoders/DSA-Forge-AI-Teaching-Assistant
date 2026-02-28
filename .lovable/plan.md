

# Redesign Practice Page to Match Code Editor Layout

## Problem
The current Practice page has action buttons and results panel at the bottom of the editor, which gets hidden or cramped. It's missing a "Run Code" button (run with custom stdin). The layout doesn't match the Code Editor page's clean right-panel design.

## New Layout

```text
┌─────────────────────────────────────────────────────────────────────┐
│ [Topic ▼]  [All|Easy|Med|Hard]                        [Python 3 ▼] │
├────┬──────────┬─────────────────────────┬───────────────────────────┤
│    │          │  Monaco Editor          │  [Output|Results|Feedback|│
│ P  │ Problem  │                         │   DryRun] tabs            │
│ r  │ Desc     │                         │                           │
│ o  │ +Examples│                         │  Tab content              │
│ b  │ +Constr  │                         │                           │
│ l  │          │─────────────────────────│                           │
│ e  │          │ stdin (optional)        │                           │
│ m  │          ├─────────────────────────│                           │
│    │          │ [▶Run] [Submit] [DryRun]│                           │
│ L  │          │        [AI Feedback]    │                           │
│ i  │          │                         │                           │
│ s  │          │                         │                           │
│ t  │          │                         │                           │
└────┴──────────┴─────────────────────────┴───────────────────────────┘
```

## Changes to `src/pages/PracticePage.tsx`

1. **Add "Run Code" feature**: New `handleRun` function that runs code with custom stdin input (same as CodeEditorPage), plus `input` and `output` state
2. **Add stdin textarea** below the editor (same as Code Editor)
3. **Move action buttons** to a bar below stdin: Run Code, Submit (test cases), Dry Run, AI Feedback
4. **Replace bottom results panel with right-side panel** (w-96, border-l) matching Code Editor layout
5. **Four tabs in right panel**: Output (from Run), Test Results (from Submit), AI Feedback, Dry Run
6. **Test Results tab**: Show each test case with input, expected output, actual output, and pass/fail status with colored indicators

No new files needed. Single file edit to `src/pages/PracticePage.tsx`.

