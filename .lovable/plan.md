

# Add Dry Run Visualizer to Practice Page

## Changes

### 1. `src/pages/PracticePage.tsx`
- Add dry run state (`dryRunSteps`, `loadingDryRun`) and a `handleDryRun` function (same logic as CodeEditorPage)
- Add a "🔍 Dry Run" button next to the existing Submit and AI Feedback buttons
- Add a `'dryrun'` option to the `activeTab` state so the results panel can show three tabs: Test Results | AI Feedback | Dry Run
- Render `DryRunPanel` when the dry run tab is active, passing the steps and loading state
- Import `DryRunPanel` and `DryRunStep` type

### 2. No new files or edge functions needed
The existing `dry-run-explain` edge function already handles this. We just call it from PracticePage the same way CodeEditorPage does.

### Layout
The dry run panel will appear in the existing bottom results panel area, selectable via a third tab. When active, it shows the full interactive visualizer with array animations, step-by-step controls, variable tracking, and line-by-line explanations — identical to the Code Editor page experience.

