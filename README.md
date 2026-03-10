# DSA Forge — Interactive DSA Learning Platform

An interactive Data Structures & Algorithms learning platform built with React, TypeScript, and Supabase. Features AI-powered code feedback, dry-run visualization, quizzes, and a conversational AI tutor.

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui |
| Code Editor | Monaco Editor (`@monaco-editor/react`) |
| Backend / Auth / DB | Supabase (Auth, PostgreSQL, Edge Functions) |
| AI Gateway | Lovable AI Gateway (Google Gemini / OpenAI models) |
| Code Execution | Judge0 CE (public API at `https://ce.judge0.com`) |
| State Management | React Query (`@tanstack/react-query`) |
| Routing | React Router v6 |
| Markdown | `react-markdown` |
| Charts | Recharts |

---

## 📁 Project Structure

```
├── public/                    # Static assets
├── src/
│   ├── assets/                # Images (logo, dry-run references)
│   ├── components/
│   │   ├── ui/                # shadcn/ui components
│   │   ├── AIChat.tsx         # Floating AI tutor chat panel
│   │   ├── AlgoArray.tsx      # Algorithm array visualizer
│   │   ├── AppLayout.tsx      # Main layout with sidebar navigation
│   │   ├── ArrayVisualizer.tsx # Array visualization component
│   │   ├── AuthDialog.tsx     # Authentication modal
│   │   ├── DryRunPanel.tsx    # Step-by-step code execution visualizer
│   │   ├── LevelQuiz.tsx      # AI-generated quiz component
│   │   └── NavLink.tsx        # Sidebar navigation link
│   ├── data/
│   │   ├── curriculum.ts      # All topics, problems, theory, test cases (~4800 lines)
│   │   └── sampleDryRuns.ts   # Fallback dry-run data for offline mode
│   ├── hooks/
│   │   ├── useAuth.tsx        # Auth context (sign up, sign in, profile)
│   │   ├── useTopicProgress.tsx # Topic progress tracking
│   │   └── use-mobile.tsx     # Mobile detection hook
│   ├── integrations/supabase/
│   │   ├── client.ts          # Auto-generated Supabase client
│   │   └── types.ts           # Auto-generated DB types
│   ├── pages/
│   │   ├── Dashboard.tsx      # Home dashboard with stats & streak
│   │   ├── CurriculumPage.tsx # Topic grid with dependency graph
│   │   ├── TheoryPage.tsx     # Topic overview page
│   │   ├── TheoryLevelPage.tsx# Beginner/Intermediate/Advanced theory + quiz
│   │   ├── PracticePage.tsx   # Code editor with test runner & AI feedback
│   │   ├── CodeEditorPage.tsx # Standalone code editor + dry run
│   │   ├── SolutionPage.tsx   # Problem solution walkthrough + AI explanation
│   │   ├── ProgressPage.tsx   # User progress analytics
│   │   └── AuthPage.tsx       # Auth page
│   └── main.tsx               # App entry point
├── supabase/
│   ├── config.toml            # Supabase project config
│   └── functions/             # Edge Functions (deployed automatically)
│       ├── ai-chat/           # Conversational AI tutor
│       ├── ai-feedback/       # AI code review & feedback
│       ├── dry-run-explain/   # AI-powered code dry-run trace
│       └── generate-quiz/     # AI-generated quiz questions
└── .env                       # Environment variables (auto-generated)
```

---

## 🚀 Local Setup & Installation

### Prerequisites

- **Node.js** v18+ and **npm** — [Install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- **Supabase CLI** — [Install guide](https://supabase.com/docs/guides/cli/getting-started)

### 1. Clone & Install

```bash
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
npm install
```

### 2. Environment Variables

Create a `.env` file in the project root (or use the existing one):

```env
VITE_SUPABASE_PROJECT_ID="your-supabase-project-id"
VITE_SUPABASE_PUBLISHABLE_KEY="your-supabase-anon-key"
VITE_SUPABASE_URL="https://your-project-id.supabase.co"
```

> These are **publishable/anon keys** — safe to include in frontend code.

### 3. Start Development Server

```bash
npm run dev
```

The app runs at `http://localhost:8080`.

### 4. Run Tests

```bash
npm test          # Single run
npm run test:watch # Watch mode
```

### 5. Build for Production

```bash
npm run build
npm run preview   # Preview production build
```

---

## 🔑 API Keys & External Services

### Supabase (Backend, Auth, Database)

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase anonymous/public key |

These are set automatically when using Lovable Cloud. For a standalone Supabase project, get these from your [Supabase Dashboard](https://supabase.com/dashboard) → Settings → API.

### Lovable AI Gateway (Edge Functions)

The edge functions use `LOVABLE_API_KEY` (stored as a Supabase secret, **not** in `.env`). This key authenticates requests to `https://ai.gateway.lovable.dev/v1/chat/completions`.

- **If using Lovable Cloud**: This key is auto-provisioned. No action needed.
- **If self-hosting**: You need to set this secret in your Supabase project:
  ```bash
  supabase secrets set LOVABLE_API_KEY=your-lovable-api-key
  ```

### Judge0 CE (Code Execution)

The app uses the **free public** Judge0 Community Edition API:
- **Base URL**: `https://ce.judge0.com`
- **No API key required** for the public instance
- Used in: `PracticePage.tsx` and `CodeEditorPage.tsx`
- Supports: Python (71), Java (62), C++ (54)

> ⚠️ The public Judge0 instance has rate limits. For production use, consider hosting your own Judge0 instance or using [RapidAPI Judge0](https://rapidapi.com/judge0-official/api/judge0-ce).

---

## 🗄 Database Schema

The Supabase PostgreSQL database has 4 tables:

### `profiles`
Stores user profile data. Auto-created on signup via a trigger on `auth.users`.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid (PK) | References auth.users |
| `username` | text | Auto-set from email |
| `experience_level` | text | beginner / intermediate / advanced |
| `preferred_language` | text | python / java / cpp |
| `learning_goal` | text | User's learning objective |
| `onboarding_completed` | boolean | Whether onboarding is done |
| `streak_count` | integer | Consecutive days active |
| `last_activity_date` | text | Last active date |

### `user_topic_progress`
Tracks per-topic learning progress.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid (PK) | Auto-generated |
| `user_id` | uuid | References profiles |
| `topic_id` | text | Curriculum topic ID |
| `mastery_score` | integer | 0-100 mastery score |
| `attempts` | integer | Total attempts |
| `correct_attempts` | integer | Successful attempts |
| `completed` | boolean | Topic completed flag |
| `unlocked` | boolean | Topic unlocked flag |

### `submissions`
Stores code submissions and test results.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid (PK) | Auto-generated |
| `user_id` | uuid | References profiles |
| `problem_id` | text | Problem identifier |
| `topic_id` | text | Topic identifier |
| `code` | text | Submitted code |
| `language` | text | Programming language |
| `verdict` | text | accepted / wrong_answer / error |
| `test_cases_passed` | integer | Passed test count |
| `test_cases_total` | integer | Total test count |
| `ai_feedback` | text | AI-generated feedback |
| `execution_time` | float | Runtime in ms |
| `memory_used` | float | Memory in KB |

### `daily_activity`
Tracks daily learning activity for streak calculation.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid (PK) | Auto-generated |
| `user_id` | uuid | References profiles |
| `activity_date` | text | Date string |
| `problems_solved` | integer | Problems solved that day |
| `topics_studied` | integer | Topics studied that day |

### Database Functions & Triggers

- **`handle_new_user()`** — Trigger function that auto-creates a profile row when a new user signs up
- **`update_updated_at_column()`** — Trigger function that auto-updates `updated_at` timestamps

---

## ⚡ Supabase Edge Functions

All edge functions are in `supabase/functions/` and are deployed automatically. They use the Lovable AI Gateway.

### `ai-chat` — Conversational AI Tutor
- **Purpose**: DSA tutoring chatbot with curriculum awareness
- **Input**: `{ messages, userProfile, currentTopicId }`
- **Output**: Streamed SSE response
- **AI Model**: `google/gemini-3-flash-preview`
- **Features**: Context-aware based on student profile, respects prerequisite dependencies

### `ai-feedback` — Code Review & Feedback
- **Purpose**: Reviews student code submissions and provides educational feedback
- **Input**: `{ code, language, problemTitle, problemDescription, testResults }`
- **Output**: Streamed SSE response with structured feedback (assessment, issues, optimized solution)
- **AI Model**: `google/gemini-3-flash-preview`

### `generate-quiz` — AI Quiz Generator
- **Purpose**: Generates MCQ quizzes based on theory content
- **Input**: `{ topicTitle, level, theoryContent }`
- **Output**: JSON with questions, options, correct answers, explanations
- **AI Model**: `google/gemini-3-flash-preview`
- **Note**: Uses function calling (tool use) for structured output
- **JWT**: Disabled (`verify_jwt = false` in config.toml)

### `dry-run-explain` — Code Execution Trace
- **Purpose**: Generates step-by-step visual dry-run trace of code
- **Input**: `{ code, language, input }`
- **Output**: JSON array of execution steps with variable states, array visualizations, pointers
- **AI Model**: `google/gemini-3-flash-preview`
- **Fallback**: Local sample dry runs available if AI fails (`sampleDryRuns.ts`)

---

## 🔄 Application Workflow

### User Journey

```
1. Landing → Dashboard (stats, streak, suggested topics)
2. Curriculum → Topic Grid (dependency-based unlock system)
3. Topic → Theory Levels (Beginner → Intermediate → Advanced)
4. Theory Level → AI Quiz (must pass to progress)
5. Practice → Code Editor (write, run, submit against test cases)
6. Submit → AI Feedback (detailed code review)
7. Solution → Step-by-step walkthrough + AI explanation
8. Progress → Analytics dashboard with charts
```

### Code Execution Flow

```
User writes code → Click "Run"
  → Code sent to Judge0 CE API (base64 encoded)
  → Judge0 executes in sandbox
  → Returns stdout/stderr/status
  → Display output in editor

User clicks "Submit"
  → Code runs against all test cases via Judge0
  → Results compared with expected output
  → Submission saved to Supabase `submissions` table
  → Daily activity updated
  → Verdict displayed (Accepted / Wrong Answer / Error)

User clicks "AI Feedback"
  → Code + test results sent to `ai-feedback` edge function
  → Lovable AI Gateway processes with Gemini
  → Streamed response rendered in markdown
```

### AI Dry Run Flow

```
User clicks "Dry Run"
  → Code sent to `dry-run-explain` edge function
  → AI generates step-by-step execution trace
  → Returns JSON with line numbers, variables, array states, pointers
  → DryRunPanel renders animated visualization
  → Fallback to local sampleDryRuns if AI fails
```

### Authentication Flow

```
User clicks Sign Up/Sign In
  → Supabase Auth handles email/password
  → On signup: `handle_new_user()` trigger creates profile
  → Profile data fetched and stored in AuthContext
  → Onboarding flow captures preferences (language, level, goal)
  → Profile updated in Supabase
```

### Topic Progress & Unlocking

```
Topics follow a dependency graph:
  Arrays → Recursion → Linked Lists → Stacks/Queues → Trees → Graphs → DP

- First topic (Arrays) is auto-unlocked
- Complete quizzes + problems to unlock next topics
- Mastery score calculated from correct_attempts / attempts
- Progress tracked in `user_topic_progress` table
```

---

## 📋 Available Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | Dashboard | Home with stats, streak, quick actions |
| `/curriculum` | Curriculum | Topic grid with dependency visualization |
| `/curriculum/:topicId` | Theory | Topic overview with theory levels |
| `/curriculum/:topicId/:level` | Theory Level | Detailed theory + code examples + quiz |
| `/editor` | Code Editor | Standalone editor with run & dry-run |
| `/practice` | Practice | Problem-based coding with test runner |
| `/progress` | Progress | Analytics & performance charts |
| `/solution/:topicId/:problemId` | Solution | Problem solution walkthrough |

---

## 🧪 Supported Languages

| Language | Judge0 ID | Monaco Language |
|----------|-----------|-----------------|
| Python 3 | 71 | python |
| Java | 62 | java |
| C++ | 54 | cpp |

---

## 📝 Curriculum Topics

The curriculum is defined in `src/data/curriculum.ts` (~4800 lines) and covers:

1. **Arrays** — Basics, operations, searching, sorting
2. **Recursion** — Base cases, tree recursion, backtracking
3. **Linked Lists** — Singly/doubly linked, operations
4. **Stacks & Queues** — LIFO/FIFO, applications
5. **Trees** — Binary trees, BST, traversals
6. **Graphs** — BFS, DFS, shortest path
7. **Dynamic Programming** — Memoization, tabulation

Each topic includes:
- 3 theory levels (beginner/intermediate/advanced)
- Code examples in Python, Java, C++
- Multiple practice problems with test cases
- Time & space complexity analysis

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|---------|
| Judge0 rate limit | Wait a few seconds between submissions, or self-host Judge0 |
| AI features not working | Check that `LOVABLE_API_KEY` is set as a Supabase secret |
| Auth not working | Ensure Supabase URL and anon key are correct in `.env` |
| Edge functions failing | Check Supabase Edge Function logs for errors |
| Quiz not generating | The `generate-quiz` function has `verify_jwt = false` — ensure the function is deployed |

---

## 📄 License

This project is private and built with [Lovable](https://lovable.dev).
