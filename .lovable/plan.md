

# Fix Dry Run Animation Issues

## Problems Identified

1. **Broken layout in PracticePage**: The DryRunPanel (which uses `h-full overflow-hidden` with a fixed bottom controls bar) is placed inside a `<div className="flex-1 overflow-y-auto">` container. This breaks the flex layout — the controls bar gets pushed off-screen and the panel can't size properly. In CodeEditorPage it correctly uses `<div className="flex-1 overflow-hidden">`.

2. **No real cell animations in AlgoArray**: Cells only use `transition-all duration-400` for color changes. There's no visual feedback for swaps (cells briefly scaling/bouncing), no pulse on highlighted cells, and no smooth pointer movement between steps.

3. **`duration-400` is invalid Tailwind**: Tailwind doesn't have `duration-400` by default. This means transitions may not be applying at all. Should use `duration-300` or `duration-500`.

## Changes

### 1. `src/pages/PracticePage.tsx`
- Fix the dryrun tab container: when `activeTab === 'dryrun'`, render DryRunPanel inside a `flex-1 overflow-hidden` div (matching CodeEditorPage) instead of the shared `overflow-y-auto` wrapper
- Restructure the right panel so the tab content area uses conditional flex layout

### 2. `src/components/AlgoArray.tsx`
- Fix `duration-400` → `duration-300` on cells
- Add swap animation: when `swappedIndices` contains an index, apply a brief scale bounce keyframe (`animate-bounce-cell`)
- Add highlight pulse: when `highlightIndices` contains an index, apply a subtle pulse glow
- Add smooth pointer transition using `transition-all duration-500` on the key bubble position
- Use a `key` prop based on step to force re-mount animations on swap steps

### 3. `src/components/DryRunPanel.tsx`
- Fix `duration-400` → `duration-300` on the progress bar
- Add `key={current}` on the explanation card to trigger fade-in animation per step change
- Auto-scroll the array section into view when step changes

### 4. `src/index.css`
- Add `@keyframes cell-swap` (brief scale up/down bounce)
- Add `@keyframes cell-highlight-pulse` (subtle glow pulse)
- Add corresponding `.animate-cell-swap` and `.animate-cell-pulse` classes

