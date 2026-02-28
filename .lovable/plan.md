

# Fix Dry Run: Add Retry Logic and Improve Animation Reliability

## Root Cause
The edge function `dry-run-explain` is deployed and working correctly (confirmed via direct test -- returns proper steps with arrayState, variables, etc.). The "Failed to connect AI service" error is caused by transient network failures in the preview environment (all requests, including auth refreshes, were failing simultaneously).

## Changes

### 1. `src/pages/CodeEditorPage.tsx` — Add retry logic to `handleDryRun`
- Wrap the fetch call in a retry loop (up to 3 attempts with 1s delay between retries)
- Show a more helpful error message distinguishing network errors from API errors
- Add `input` to the dry run request body (currently missing, but the edge function accepts it)

### 2. `src/pages/PracticePage.tsx` — Same retry logic for `handleDryRun`
- Add retry loop (3 attempts) matching CodeEditorPage
- Include `input` in the request body

### 3. `src/components/DryRunPanel.tsx` — Add error state with retry button
- Add an `error` prop (optional string) to DryRunPanel
- When error is set and not loading, show an error state with a "Retry" button instead of the empty state
- This gives users an in-panel way to retry without clicking the toolbar again

### 4. `src/components/AlgoArray.tsx` — Fix animation re-triggering
- The `key={i}` on cells means animations only play on initial mount, not on step changes. Change the key to include a step identifier so cells re-mount when swapped/highlighted indices change, triggering the CSS animations each time
- Accept a `stepIndex` prop and use `key={\`${stepIndex}-${i}\`}` on cells that have swap or highlight animations

