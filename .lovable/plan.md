

## Plan: Add "Solution" Page for Practice Problems

### Overview
Create a new **Solution Page** (`/solution/:topicId/:problemId`) that provides AI-generated theory, animated step-by-step explanations, and multiple solution approaches for each problem.

### Changes

#### 1. Create `src/pages/SolutionPage.tsx` (new file)
- Accepts `topicId` and `problemId` from URL params
- Looks up the problem from `curriculum.ts` data
- Sections:
  - **Problem Statement** — title, description, examples
  - **Key Concepts** — relevant theory extracted from the topic's theory levels
  - **Solution Approaches** — multiple approaches (brute force, optimized) with:
    - Explanation text
    - Step-by-step animated walkthrough (using CSS transitions to highlight each step)
    - Code implementation in the user's preferred language
    - Time/Space complexity analysis
  - **AI Explanation** button — calls the existing `ai-chat` or `ai-feedback` edge function to generate a detailed explanation on demand
- Back button to return to Practice page

#### 2. Update `src/App.tsx`
- Add route: `<Route path="/solution/:topicId/:problemId" element={<SolutionPage />} />`

#### 3. Update `src/pages/PracticePage.tsx` (line ~391)
- Add a "Solution" button below "← View Theory":
```tsx
<button onClick={() => navigate(`/solution/${selectedTopicId}/${selectedProblem.id}`)}
  className="text-xs text-primary hover:underline flex items-center gap-1">
  💡 Solution
</button>
```

#### 4. AI Animation Component (within SolutionPage)
- Step-by-step approach cards that auto-animate or can be manually stepped through
- Each step highlights the relevant concept with a smooth transition
- Uses existing edge function (`ai-feedback` or `dry-run-explain`) to generate explanations when the user clicks "AI Explain"

