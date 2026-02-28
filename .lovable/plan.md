

# Fix Practice Page Layout — Editor Not Visible

## Root Cause
The current layout has 4 horizontal panels with 864px of fixed-width columns (w-48 + w-72 + w-96), leaving nearly zero space for the Monaco editor (`flex-1`) on typical screens.

## Solution
Restructure the Practice page to use a **2-column layout** like the Code Editor page (image-6 reference), with the problem list and description combined into a single left panel, and the editor + right results panel taking the remaining space.

### New Layout
```text
┌──────────────────────────────────────────────────────────────────┐
│ [Topic ▼]  [All|Easy|Med|Hard]   [▶ Run Code] [Submit] [DryRun]  [Lang ▼] │
├─────────────────┬────────────────────────┬───────────────────────┤
│ Problem List    │  Monaco Editor         │  Output / Tests /     │
│ + Description   │                        │  AI Feedback / DryRun │
│ (collapsible    │                        │                       │
│  left panel)    │                        │                       │
│                 │────────────────────────│                       │
│                 │ stdin (optional)       │                       │
└─────────────────┴────────────────────────┴───────────────────────┘
```

### Changes to `src/pages/PracticePage.tsx`

1. **Merge problem list + description into a single left sidebar** (w-80, scrollable) with problem list at top and selected problem details below
2. **Move action buttons (Run Code, Submit, Dry Run, AI Feedback) to the top bar** next to the language selector, matching Code Editor's top toolbar style
3. **Remove the separate action buttons bar** below stdin to free vertical space
4. **Keep right panel (w-96)** with Output/Tests/AI Feedback/DryRun tabs — unchanged
5. **Editor takes flex-1** in the center with stdin below it — now has plenty of room since only 2 fixed-width panels exist (w-80 + w-96 = 576px vs previous 864px)

This matches the Code Editor page layout from image-6: top toolbar with buttons, left editor area with stdin, right panel with tabs.

