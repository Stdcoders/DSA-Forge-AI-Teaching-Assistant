
## DSA Forge — MVP Build Plan

### Overview
A dark-themed, interactive DSA learning platform built with React + Tailwind CSS on the frontend, Supabase (Auth + PostgreSQL + Edge Functions) for the backend, Lovable AI for the intelligent chatbot/code explanation, and Judge0 public API for real-time code execution.

---

### 1. 🔐 Auth & Onboarding
- **Register / Login** screens with Supabase email authentication
- **Onboarding wizard** (first-time users only): collects experience level (Beginner / Intermediate / Advanced), preferred coding language (Python / Java / C++), and learning goal
- Profile data saved to a `profiles` table in Supabase
- On completion, a personalized roadmap is generated and stored

---

### 2. 🧭 Navigation & Layout
- Persistent **sidebar** with: Dashboard, Curriculum, Code Editor, Practice, Progress
- Top bar with user avatar, streak indicator, and a floating AI assistant button
- Dark modern theme (deep navy/slate background, neon cyan/purple accents matching the DSAForge logo aesthetic)
- Fully responsive layout

---

### 3. 📊 Dashboard
- **Progress ring** showing overall completion percentage
- **Completed topics** list with checkmarks
- **Weak topics** highlighted in amber
- **Suggested next topic** card with a "Start Learning" CTA
- **Practice stats**: total attempts, accuracy rate, current streak
- Simple bar chart showing activity over the past 7 days

---

### 4. 📚 Curriculum (Hardcoded Content)
- **Dependency graph visualization**: Arrays → Recursion → Linked List → Stack/Queue → Trees → Graphs → DP
- Topic cards showing: title, difficulty level, prerequisites, completion status
- Clicking a topic opens the **Theory Page**

---

### 5. 📖 Theory Page (per topic)
- Sectioned, expandable layout:
  - **What is it?** — Definition + real-world analogy
  - **Why use it?** — Use cases and motivation
  - **Code Example** — Syntax-highlighted snippet in user's preferred language
  - **Complexity** — Time & Space complexity table
  - **Difficulty Ladder** — Easy → Medium → Hard problems listed
- Prerequisite check banner (e.g., "Complete Arrays first")
- **"Start Practice"** button that navigates to the practice page for that topic
- Embedded **AI Chatbot** panel (context-aware — knows the current topic)

---

### 6. 🤖 AI Chatbot (Lovable AI)
- Floating chat button accessible from anywhere
- Full chat panel with conversation history
- **Context-aware**: knows user's profile, current topic, experience level
- Capabilities:
  - Explain concepts and doubts
  - Suggest structured roadmap (rule-based gating: prerequisites must be met)
  - Guide Easy → Medium → Hard progression
  - Answer "what should I study next?" questions
- Powered by Supabase Edge Function calling Lovable AI gateway (Gemini Flash)

---

### 7. 💻 Code Editor Page
- **Monaco Editor** (VS Code-style) with syntax highlighting
- Language selector (Python / Java / C++)
- **Run Code** button → calls Judge0 public API → displays stdout/stderr output
- **Dry Run button** → sends code to AI edge function → returns step-by-step variable tracking explanation
- Split layout: Editor (left) | Output + AI Explanation (right)
- AI Explanation panel shows: mistake detection (Syntax / Logical / Conceptual), what each step does, suggested fix

---

### 8. 🧪 Practice System
- Topic-wise question list with difficulty filter (Easy / Medium / Hard)
- Each problem has: description, input/output examples, constraints
- Built-in code editor (Monaco) for submitting solutions
- **Submit** → Judge0 validates against test cases → shows pass/fail per test case
- Submission history stored in Supabase (`submissions` table)
- **AI Feedback** button: explains what went wrong and how to improve

---

### 9. 📈 Progress Tracking
- Supabase stores: topic mastery score, accuracy %, attempt counts, learning streak
- Progress page shows:
  - Per-topic progress bars
  - Overall accuracy chart (Recharts)
  - Weak topics section with recommended resources
  - Streak calendar (similar to GitHub contribution graph)

---

### 🗄️ Database Schema (Supabase)
- `profiles` — user info, experience level, language, goal, streak
- `user_topic_progress` — topic mastery score, attempts, accuracy per user
- `submissions` — code submissions with verdict and timestamp
- `roadmap_state` — which topics are unlocked/completed per user

---

### 🔧 Edge Functions (Supabase)
- `ai-chat` — Curriculum-aware chatbot with user profile context (streaming)
- `dry-run-explain` — Sends code to Lovable AI for step-by-step dry run explanation
- `ai-feedback` — Analyzes submission and returns structured feedback

---

### 🎨 Design System
- Color palette inspired by DSAForge logo: deep navy (`#0a0f1e`) background, electric cyan + neon purple accents, metallic silver text
- Fonts: modern monospace for code, clean sans-serif for UI
- Micro-animations on topic unlock, streak milestone, test case pass
