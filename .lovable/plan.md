

## Plan: Move Output Tabs Below Editor (Replace Right Panel)

The user wants the Output/Tests/AI Feedback/Dry Run panel to be stacked below the code editor (where stdin currently is), instead of being a separate right column. This matches the Code Editor page layout.

### Changes to `src/pages/PracticePage.tsx`:

1. **Remove the third resizable panel** (right column with tabs) and its resize handle
2. **Restructure the center panel** to have a vertical split:
   - Top: Monaco Editor
   - Bottom: Vertically stacked area with stdin input + Output/Tests/AI Feedback/Dry Run tabs (using a vertical `ResizablePanelGroup`)
3. **Move stdin** to a collapsible section or small area within the bottom panel, alongside the tabs
4. **Result**: Two-column layout (Problem List | Editor + Output below) instead of three columns

### Layout Structure:
```text
┌──────────────┬──────────────────────────────┐
│ Problem List │  Monaco Editor               │
│              │                              │
│              ├──────────────────────────────┤
│              │ stdin (small)                │
│              ├──────────────────────────────┤
│              │ [Output] [Tests] [AI] [Dry]  │
│              │  Tab content area            │
└──────────────┴──────────────────────────────┘
```

### File: `src/pages/PracticePage.tsx`
- Remove the third `ResizablePanel` and its `ResizableHandle`
- Convert center panel into a vertical `ResizablePanelGroup` with editor on top and output tabs on bottom
- Keep stdin as a small fixed section between editor and tabs
- Adjust default sizes (left: 22, center: 78)

