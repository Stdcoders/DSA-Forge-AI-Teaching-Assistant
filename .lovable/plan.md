

# Plan: Split Theory into Level Pages with AI Quiz Generator

## Overview

Instead of showing Beginner, Intermediate, and Advanced all on one page, each level becomes its own full-page view with navigation arrows. At the bottom of each level, an AI-powered quiz is dynamically generated based on that level's theory content.

## New Page Flow

```text
/curriculum/arrays              -- Topic overview (What/Why) + starts at Beginner
/curriculum/arrays/beginner     -- Beginner theory + code + problems + AI Quiz
/curriculum/arrays/intermediate -- Intermediate theory + code + problems + AI Quiz
/curriculum/arrays/advanced     -- Advanced theory + code + problems + AI Quiz + Complexity table
```

The user lands on the overview page first, then clicks "Start Learning" to enter the Beginner level. Each level page has:

```text
Level Page (e.g., Beginner)
|
|-- Level header with progress indicator (Step 1 of 3)
|-- Theory explanation
|-- Code examples (Python / Java / C++ selector)
|-- Practice problems (filtered by difficulty)
|-- AI Quiz Section (3-5 MCQ questions generated from the theory)
|-- Navigation: <- Previous Level | Next Level ->
```

## File Changes

### 1. New Route: `src/App.tsx`
- Add route: `/curriculum/:topicId/:level` pointing to a new `TheoryLevelPage` component
- Keep `/curriculum/:topicId` as the topic overview page

### 2. Refactor: `src/pages/TheoryPage.tsx`
- Remove the three LevelSection accordions
- Keep only: Header, What is it?, Why use it?, and a "Start Learning" button that navigates to `/curriculum/{topicId}/beginner`
- Add a level progress indicator showing Beginner / Intermediate / Advanced as clickable steps

### 3. New Page: `src/pages/TheoryLevelPage.tsx`
This is the main new component. It renders one level at a time:

- **Header**: Level badge (green/amber/red), title, step indicator (1/3, 2/3, 3/3)
- **Theory Content**: The level's theory text with whitespace formatting
- **Code Examples**: Language selector + code block (same as current)
- **Practice Problems**: Filtered by difficulty (easy/medium/hard)
- **AI Quiz Section**: A "Generate Quiz" button that calls an edge function to create 3-5 MCQ questions based on the theory content. Shows questions with radio button options, a submit button, and score feedback.
- **Navigation Footer**:
  - Beginner: "Back to Overview" on left, "Next: Intermediate ->" on right
  - Intermediate: "<- Previous: Beginner" on left, "Next: Advanced ->" on right  
  - Advanced: "<- Previous: Intermediate" on left, "Complete Topic" on right (marks complete + shows complexity table)

### 4. New Edge Function: `supabase/functions/generate-quiz/index.ts`
- Receives: `{ topicTitle, level, theoryContent, language }` 
- Uses Lovable AI (gemini-3-flash-preview) to generate 3-5 MCQ questions
- Returns structured JSON via tool calling:
  ```json
  {
    "questions": [
      {
        "question": "What is the time complexity of accessing an array element by index?",
        "options": ["O(1)", "O(n)", "O(log n)", "O(n^2)"],
        "correctIndex": 0,
        "explanation": "Array access by index is O(1) because..."
      }
    ]
  }
  ```
- Uses tool calling (not raw JSON) to ensure structured output
- Handles 429/402 rate limit errors gracefully

### 5. New Component: `src/components/LevelQuiz.tsx`
- Takes `topicId`, `level`, `theoryContent` as props
- "Generate Quiz" button triggers the edge function call
- Displays questions as cards with radio button options
- Submit button checks answers and shows score (e.g., "4/5 correct!")
- Shows explanations for wrong answers after submission
- "Regenerate Quiz" button to get fresh questions
- Loading state with skeleton cards while quiz generates

### 6. Styles: `src/index.css`
- Add quiz-specific styles: correct/incorrect answer highlighting (green/red borders)
- Navigation arrow hover effects

## Technical Details

### Quiz Generation Edge Function

The edge function sends the theory content to the AI with a system prompt like:
```
You are a quiz generator for a DSA learning platform. Generate exactly {count} multiple-choice questions based on the provided theory content. Each question should test understanding of the concepts explained, not just memorization. Match the difficulty to the level (beginner = conceptual, intermediate = application, advanced = analysis/optimization).
```

It uses tool calling to guarantee structured output:
```typescript
body.tools = [{
  type: "function",
  function: {
    name: "generate_quiz",
    parameters: {
      type: "object",
      properties: {
        questions: {
          type: "array",
          items: {
            type: "object",
            properties: {
              question: { type: "string" },
              options: { type: "array", items: { type: "string" } },
              correctIndex: { type: "integer" },
              explanation: { type: "string" }
            }
          }
        }
      }
    }
  }
}];
body.tool_choice = { type: "function", function: { name: "generate_quiz" } };
```

### Navigation Logic

The level pages use URL params to determine the current level and calculate previous/next:
```typescript
const LEVELS = ['beginner', 'intermediate', 'advanced'];
const currentIndex = LEVELS.indexOf(level);
const prevLevel = currentIndex > 0 ? LEVELS[currentIndex - 1] : null;
const nextLevel = currentIndex < 2 ? LEVELS[currentIndex + 1] : null;
```

### Level Progress Indicator

A horizontal stepper at the top of each level page:
```text
[1 Beginner] ---- [2 Intermediate] ---- [3 Advanced]
    (active)         (upcoming)            (upcoming)
```
Completed levels get a checkmark, current level is highlighted with the topic's accent color.

