

# Redesign Code Editor with Resizable Panels

Redesign the Code Editor page to match the reference image: a clean layout with a resizable split between the editor and the output/dry-run panel, using a draggable handle (slider).

## Changes

### `src/pages/CodeEditorPage.tsx` — Full layout redesign

1. **Replace fixed `flex` split with `ResizablePanelGroup`** from `react-resizable-panels` (already installed and has a UI component at `src/components/ui/resizable.tsx`)
   - Horizontal split: left panel = code editor, right panel = Output + AI Dry Run (stacked vertically)
   - Use `ResizableHandle` with `withHandle` for a visible drag grip

2. **Right panel: vertical `ResizablePanelGroup`** splitting Output (top) and AI Dry Run (bottom) with another resizable handle between them — matching the reference image layout

3. **Toolbar redesign** to match reference:
   - Left: `</>` icon + "DSA AI Code Studio" title
   - Right: Language select, green "Run Code" button, "Dry Run" button, keyboard shortcut hint `Ctrl+Enter to run`
   - Remove the current separate tab switcher; Output and Dry Run are always visible as stacked panels

4. **Remove stdin area** from below editor (simplify to match reference) — or collapse it into a small expandable section

5. **Remove tab switching** between Output and Dry Run — both panels are visible simultaneously in the right column, separated by a resizable handle

### Layout structure:
```text
┌─────────────────────────────────────────────────┐
│  </> DSA AI Code Studio  [Java ▼] [Run] [Dry]  │
├────────────────────┬──┬─────────────────────────┤
│                    │  │ Output                  │
│   Monaco Editor    │◂▸│ "Click Run Code..."     │
│                    │  ├─────────────────────────┤
│                    │  │ AI Dry Run              │
│                    │  │ "Click Dry Run..."      │
└────────────────────┴──┴─────────────────────────┘
```

