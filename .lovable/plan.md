

# Restructure TheoryPage to Vertical Tree Layout

## Current Problem
The theory page uses **tabs** that show only one level at a time (Beginner/Intermediate/Advanced). You want all levels visible in a scrollable vertical layout where each level shows its own theory, code examples, and practice problems together.

## New Layout Structure

```text
Topic Header (icon, title, status)
|
|-- What is it? (collapsible, open by default)
|     |-- Definition text
|     |-- Real-World Analogy box
|
|-- Why use it? (collapsible, open by default)
|
|-- Beginner Level (collapsible section, green accent)
|     |-- Theory explanation
|     |-- Code examples (Python / Java / C++ selector)
|     |-- Practice problems (easy only)
|
|-- Intermediate Level (collapsible section, yellow accent)
|     |-- Theory explanation
|     |-- Code examples (Python / Java / C++ selector)
|     |-- Practice problems (medium only)
|
|-- Advanced Level (collapsible section, red accent)
|     |-- Theory explanation
|     |-- Code examples (Python / Java / C++ selector)
|     |-- Practice problems (hard only)
|
|-- Time & Space Complexity table
|
|-- Action buttons (Start Practice, Mark Complete, Back)
```

## What Changes

### `src/pages/TheoryPage.tsx`
- **Remove** the Tabs component (no more tab switching)
- **Replace** with three separate Accordion sections for Beginner, Intermediate, and Advanced
- Each level section includes:
  - Level header with colored dot (green/yellow/red)
  - Theory content
  - Language selector + code block (each level gets its own language selector)
  - Practice problems filtered by difficulty (easy for beginner, medium for intermediate, hard for advanced)
- **Remove** the single "Practice Problems" accordion at the bottom (problems are now distributed into their levels)
- **Remove** the progress bar and activeLevel state (no longer needed since all levels are visible)
- Keep all existing animations (stagger-fade, code-reveal, problem-card-glow)

### Visual Design Per Level Section
- Each level gets a colored left border accent: green for beginner, amber for intermediate, red for advanced
- Level badge shows the difficulty label
- Problems are filtered: easy problems under Beginner, medium under Intermediate, hard under Advanced
- All three sections default to open so users can scroll through the full content

### No changes needed to:
- `src/data/curriculum.ts` (data structure stays the same)
- `src/index.css` (existing animations are reused)
- `tailwind.config.ts` (no new utilities needed)

## Technical Details

The key change is replacing lines 140-204 (the Tabs block) with three separate accordion items, one per level. Each accordion item will contain:

1. Theory text from `topic.theoryLevels[level].content`
2. Its own language selector and code block from `topic.theoryLevels[level].codeExample`
3. Filtered practice problems: `topic.problems.filter(p => p.difficulty === difficultyMap[level])`

The difficulty mapping:
- beginner -> easy problems
- intermediate -> medium problems  
- advanced -> hard problems

The bottom "Practice Problems" and "Complexity" accordions will be restructured: complexity stays at the bottom, but practice problems are removed from the bottom since they now live inside each level.
