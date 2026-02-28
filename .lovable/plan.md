

# Fix Dry Run Network Resilience

## Problem
All network requests in the preview are failing ("Failed to fetch") — this affects auth, Judge0, and dry-run equally. The backend function is deployed and healthy. The 3-retry with 1s fixed delay isn't enough for transient network issues.

## Changes

### 1. `src/pages/CodeEditorPage.tsx` — Improve retry with exponential backoff
- Change retry delay from fixed 1000ms to exponential: `1000 * attempt` (1s, 2s, 3s)
- Increase MAX_RETRIES from 3 to 4
- Add `AbortController` with 30s timeout per attempt to prevent hanging requests
- Improve error message to suggest refreshing the page

### 2. `src/pages/PracticePage.tsx` — Same retry improvements
- Match the same exponential backoff and timeout changes

### 3. `src/components/DryRunPanel.tsx` — Better error UX
- Add a "Refresh Page" suggestion in the error state alongside the Retry button
- Show a note that if all retries fail, refreshing the browser tab usually resolves it

These are incremental improvements. The root cause is transient network instability in the preview environment — when connectivity returns, the feature works as designed with animations.

