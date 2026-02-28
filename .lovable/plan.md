

## Plan: W3Schools-Style Interactive Learning System for Solution Page

Transform the Solution page into a W3Schools-inspired interactive learning experience with three major features: interactive diagrams, AI voice narration, and a conversational AI tutor panel.

### Changes to `src/pages/SolutionPage.tsx`

**1. Interactive Code Playground ("Try It Yourself")**
- Add a W3Schools-style "Try It Yourself" section with an inline Monaco editor pre-filled with the solution code
- Run button that executes the code via Judge0 and shows output side-by-side
- Users can modify code and see results instantly

**2. Interactive Visual Diagrams**
- Animated SVG/CSS diagrams that illustrate the algorithm step-by-step
- For array problems: show array cells with pointers, swaps, comparisons animating in sync with the step walkthrough
- Reuse the existing `ArrayVisualizer` / `AlgoArray` components pattern
- Each step in the walkthrough triggers a corresponding diagram state change

**3. AI Voice Narration (Text-to-Speech)**
- Add a "Listen" / "Read Aloud" button on the AI explanation section
- Use the browser's built-in `SpeechSynthesis` API (free, no API key needed) to narrate explanations
- Play/pause/stop controls for the narration
- Highlight the current sentence being read

**4. Embedded Conversational AI Tutor**
- Add an inline chat panel (not the floating one) within the Solution page
- Context-aware: pre-loaded with the current problem details
- Users can ask follow-up questions like "explain step 3 more" or "what if the array is empty?"
- Reuse the existing `ai-chat` edge function with problem context

**5. W3Schools-Style Section Navigation**
- Add a sticky sidebar or top nav with section links: Problem > Concepts > Try It > Approaches > AI Tutor
- "Previous / Next Problem" navigation at the bottom

### File Changes

| File | Change |
|------|--------|
| `src/pages/SolutionPage.tsx` | Major rewrite: add Try It editor, visual diagrams, voice narration, inline AI chat, section nav |
| `src/components/SolutionVisualizer.tsx` | New: animated diagram component for algorithm visualization |
| `src/components/TryItEditor.tsx` | New: inline code editor with run capability |
| `src/components/InlineTutor.tsx` | New: embedded AI chat for contextual Q&A |

### Technical Notes
- Voice narration uses `window.speechSynthesis` (Web Speech API) -- zero cost, no API key
- Try It editor reuses the Judge0 integration already in `PracticePage`
- Inline tutor reuses the `ai-chat` edge function
- Visual diagrams use CSS animations and React state transitions

