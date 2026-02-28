

# Make Dry Run Work Offline with Local Fallback

## Root Cause (confirmed)
The backend function `dry-run-explain` returns 200 with correct data when called directly. **Every** request from the preview iframe is failing — auth refreshes, dry-run calls, everything. This is a transient preview environment networking issue that no amount of retry logic can fix.

## Solution: Add a local fallback with sample dry-run traces
When all network retries fail, instead of showing "Connection Failed", generate a local dry-run trace so users can always see the animation feature working.

### Changes

#### 1. `src/data/sampleDryRuns.ts` — New file with sample traces
- Create pre-built dry-run step arrays for common algorithms (bubble sort, binary search)
- Include full `arrayState` with highlights, swaps, sorted indices, and pointers
- A function `generateLocalDryRun(code)` that pattern-matches the code to pick a relevant sample, or falls back to a generic trace

#### 2. `src/pages/CodeEditorPage.tsx` — Use fallback on network failure
- After all retries fail, call `generateLocalDryRun(code)` instead of showing an error
- Show a toast: "Using offline demo — connect to see your actual code traced"
- Set the steps from the local fallback so animations play immediately

#### 3. `src/pages/PracticePage.tsx` — Same fallback
- Match the same fallback behavior as CodeEditorPage

#### 4. `src/components/DryRunPanel.tsx` — Add "offline demo" indicator
- When steps come from local fallback, show a small banner: "Offline demo — results may not match your code"
- Keep the Retry button so users can try the real service when network recovers

