import type { DryRunStep } from '@/components/DryRunPanel';

const bubbleSortTrace: DryRunStep[] = [
  {
    line: 1, code: 'arr = [5, 3, 8, 1, 2]', explanation: 'Initialize the array with 5 elements to sort.',
    conceptNote: 'Setup', variables: { arr: '[5,3,8,1,2]', n: 5 }, highlight: 'normal',
    arrayState: { name: 'arr', values: [5, 3, 8, 1, 2], highlightIndices: [], swappedIndices: [], sortedIndices: [], pointers: {} },
  },
  {
    line: 3, code: 'for i in range(n-1):', explanation: 'Outer loop starts — we need n-1 passes to guarantee sorting.',
    conceptNote: 'Bubble Sort', variables: { i: 0, n: 5 }, highlight: 'loop',
    arrayState: { name: 'arr', values: [5, 3, 8, 1, 2], highlightIndices: [], swappedIndices: [], sortedIndices: [], pointers: { i: 0 } },
  },
  {
    line: 5, code: 'if arr[j] > arr[j+1]:', explanation: 'Compare arr[0]=5 and arr[1]=3. Since 5 > 3, we swap.',
    conceptNote: 'Compare & Swap', variables: { i: 0, j: 0 }, highlight: 'branch',
    arrayState: { name: 'arr', values: [5, 3, 8, 1, 2], highlightIndices: [0, 1], swappedIndices: [], sortedIndices: [], pointers: { j: 0, 'j+1': 1 } },
  },
  {
    line: 6, code: 'arr[j], arr[j+1] = arr[j+1], arr[j]', explanation: 'Swap 5 and 3. The smaller value bubbles left.',
    variables: { i: 0, j: 0 }, highlight: 'normal',
    arrayState: { name: 'arr', values: [3, 5, 8, 1, 2], highlightIndices: [], swappedIndices: [0, 1], sortedIndices: [], pointers: { j: 0, 'j+1': 1 } },
  },
  {
    line: 5, code: 'if arr[j] > arr[j+1]:', explanation: 'Compare arr[1]=5 and arr[2]=8. No swap needed.',
    variables: { i: 0, j: 1 }, highlight: 'branch',
    arrayState: { name: 'arr', values: [3, 5, 8, 1, 2], highlightIndices: [1, 2], swappedIndices: [], sortedIndices: [], pointers: { j: 1, 'j+1': 2 } },
  },
  {
    line: 5, code: 'if arr[j] > arr[j+1]:', explanation: 'Compare arr[2]=8 and arr[3]=1. Since 8 > 1, we swap.',
    conceptNote: 'Largest bubbles right', variables: { i: 0, j: 2 }, highlight: 'branch',
    arrayState: { name: 'arr', values: [3, 5, 8, 1, 2], highlightIndices: [2, 3], swappedIndices: [], sortedIndices: [], pointers: { j: 2, 'j+1': 3 } },
  },
  {
    line: 6, code: 'arr[j], arr[j+1] = arr[j+1], arr[j]', explanation: 'Swap 8 and 1.',
    variables: { i: 0, j: 2 }, highlight: 'normal',
    arrayState: { name: 'arr', values: [3, 5, 1, 8, 2], highlightIndices: [], swappedIndices: [2, 3], sortedIndices: [], pointers: { j: 2, 'j+1': 3 } },
  },
  {
    line: 5, code: 'if arr[j] > arr[j+1]:', explanation: 'Compare arr[3]=8 and arr[4]=2. Since 8 > 2, we swap.',
    variables: { i: 0, j: 3 }, highlight: 'branch',
    arrayState: { name: 'arr', values: [3, 5, 1, 8, 2], highlightIndices: [3, 4], swappedIndices: [], sortedIndices: [], pointers: { j: 3, 'j+1': 4 } },
  },
  {
    line: 6, code: 'arr[j], arr[j+1] = arr[j+1], arr[j]', explanation: 'Swap 8 and 2. After pass 1, largest element (8) is in final position.',
    conceptNote: 'Pass 1 complete', variables: { i: 0, j: 3 }, highlight: 'normal',
    arrayState: { name: 'arr', values: [3, 5, 1, 2, 8], highlightIndices: [], swappedIndices: [3, 4], sortedIndices: [4], pointers: {} },
  },
  {
    line: 3, code: 'for i in range(n-1):', explanation: 'Start pass 2. The last element is already sorted.',
    variables: { i: 1, n: 5 }, highlight: 'loop',
    arrayState: { name: 'arr', values: [3, 5, 1, 2, 8], highlightIndices: [], swappedIndices: [], sortedIndices: [4], pointers: { i: 1 } },
  },
  {
    line: 6, code: 'arr[j], arr[j+1] = arr[j+1], arr[j]', explanation: 'Swap 5 and 1.',
    variables: { i: 1, j: 1 }, highlight: 'normal',
    arrayState: { name: 'arr', values: [3, 1, 5, 2, 8], highlightIndices: [], swappedIndices: [1, 2], sortedIndices: [4], pointers: { j: 1, 'j+1': 2 } },
  },
  {
    line: 6, code: 'arr[j], arr[j+1] = arr[j+1], arr[j]', explanation: 'Swap 5 and 2. After pass 2, 5 is in position.',
    conceptNote: 'Pass 2 complete', variables: { i: 1, j: 2 }, highlight: 'normal',
    arrayState: { name: 'arr', values: [3, 1, 2, 5, 8], highlightIndices: [], swappedIndices: [2, 3], sortedIndices: [3, 4], pointers: {} },
  },
  {
    line: 6, code: 'arr[j], arr[j+1] = arr[j+1], arr[j]', explanation: 'Swap 3 and 1.',
    variables: { i: 2, j: 0 }, highlight: 'normal',
    arrayState: { name: 'arr', values: [1, 3, 2, 5, 8], highlightIndices: [], swappedIndices: [0, 1], sortedIndices: [3, 4], pointers: { j: 0, 'j+1': 1 } },
  },
  {
    line: 6, code: 'arr[j], arr[j+1] = arr[j+1], arr[j]', explanation: 'Swap 3 and 2. After pass 3, 3 is in position.',
    conceptNote: 'Pass 3 complete', variables: { i: 2, j: 1 }, highlight: 'normal',
    arrayState: { name: 'arr', values: [1, 2, 3, 5, 8], highlightIndices: [], swappedIndices: [1, 2], sortedIndices: [2, 3, 4], pointers: {} },
  },
  {
    line: 8, code: 'return arr', explanation: 'Array is fully sorted! Bubble sort complete in O(n²) time.',
    conceptNote: 'Sorted ✓', variables: { arr: '[1,2,3,5,8]' }, highlight: 'return',
    arrayState: { name: 'arr', values: [1, 2, 3, 5, 8], highlightIndices: [], swappedIndices: [], sortedIndices: [0, 1, 2, 3, 4], pointers: {} },
  },
];

const binarySearchTrace: DryRunStep[] = [
  {
    line: 1, code: 'arr = [2, 5, 8, 12, 16, 23, 38, 56]', explanation: 'Initialize a sorted array. We want to find target = 23.',
    conceptNote: 'Binary Search', variables: { target: 23, n: 8 }, highlight: 'normal',
    arrayState: { name: 'arr', values: [2, 5, 8, 12, 16, 23, 38, 56], highlightIndices: [], swappedIndices: [], sortedIndices: [], pointers: {} },
  },
  {
    line: 3, code: 'low, high = 0, len(arr)-1', explanation: 'Set search boundaries to the full array.',
    variables: { low: 0, high: 7, target: 23 }, highlight: 'normal',
    arrayState: { name: 'arr', values: [2, 5, 8, 12, 16, 23, 38, 56], highlightIndices: [], swappedIndices: [], sortedIndices: [], pointers: { low: 0, high: 7 } },
  },
  {
    line: 5, code: 'mid = (low + high) // 2', explanation: 'Calculate mid = (0+7)//2 = 3. Check arr[3] = 12.',
    conceptNote: 'Divide in half', variables: { low: 0, high: 7, mid: 3, target: 23 }, highlight: 'normal',
    arrayState: { name: 'arr', values: [2, 5, 8, 12, 16, 23, 38, 56], highlightIndices: [3], swappedIndices: [], sortedIndices: [], pointers: { low: 0, mid: 3, high: 7 } },
  },
  {
    line: 7, code: 'if arr[mid] < target:', explanation: '12 < 23, so target is in the right half. Move low to mid+1.',
    conceptNote: 'Eliminate left half', variables: { low: 4, high: 7, mid: 3, 'arr[mid]': 12 }, highlight: 'branch',
    arrayState: { name: 'arr', values: [2, 5, 8, 12, 16, 23, 38, 56], highlightIndices: [3], swappedIndices: [], sortedIndices: [], pointers: { low: 4, high: 7 } },
  },
  {
    line: 5, code: 'mid = (low + high) // 2', explanation: 'Calculate mid = (4+7)//2 = 5. Check arr[5] = 23.',
    variables: { low: 4, high: 7, mid: 5, target: 23 }, highlight: 'normal',
    arrayState: { name: 'arr', values: [2, 5, 8, 12, 16, 23, 38, 56], highlightIndices: [5], swappedIndices: [], sortedIndices: [], pointers: { low: 4, mid: 5, high: 7 } },
  },
  {
    line: 6, code: 'if arr[mid] == target:', explanation: 'arr[5] = 23 == target! Found the element at index 5.',
    conceptNote: 'Found! ✓', variables: { low: 4, high: 7, mid: 5, 'arr[mid]': 23 }, highlight: 'return',
    arrayState: { name: 'arr', values: [2, 5, 8, 12, 16, 23, 38, 56], highlightIndices: [5], swappedIndices: [], sortedIndices: [5], pointers: { low: 4, mid: 5, high: 7 }, keyValue: 23 },
  },
  {
    line: 8, code: 'return mid', explanation: 'Return index 5. Binary search found 23 in just 2 comparisons — O(log n)!',
    conceptNote: 'O(log n)', variables: { result: 5 }, highlight: 'return',
    arrayState: { name: 'arr', values: [2, 5, 8, 12, 16, 23, 38, 56], highlightIndices: [5], swappedIndices: [], sortedIndices: [5], pointers: { result: 5 } },
  },
];

const genericTrace: DryRunStep[] = [
  {
    line: 1, code: 'data = [10, 20, 30, 40, 50]', explanation: 'Initialize array with sample values.',
    conceptNote: 'Demo Trace', variables: { n: 5 }, highlight: 'normal',
    arrayState: { name: 'data', values: [10, 20, 30, 40, 50], highlightIndices: [], swappedIndices: [], sortedIndices: [], pointers: {} },
  },
  {
    line: 2, code: 'for i in range(len(data)):', explanation: 'Loop through each element in the array.',
    variables: { i: 0 }, highlight: 'loop',
    arrayState: { name: 'data', values: [10, 20, 30, 40, 50], highlightIndices: [0], swappedIndices: [], sortedIndices: [], pointers: { i: 0 } },
  },
  {
    line: 3, code: 'process(data[i])', explanation: 'Process element at index 1.',
    variables: { i: 1, 'data[i]': 20 }, highlight: 'normal',
    arrayState: { name: 'data', values: [10, 20, 30, 40, 50], highlightIndices: [1], swappedIndices: [], sortedIndices: [0], pointers: { i: 1 } },
  },
  {
    line: 3, code: 'process(data[i])', explanation: 'Process element at index 2.',
    variables: { i: 2, 'data[i]': 30 }, highlight: 'normal',
    arrayState: { name: 'data', values: [10, 20, 30, 40, 50], highlightIndices: [2], swappedIndices: [], sortedIndices: [0, 1], pointers: { i: 2 } },
  },
  {
    line: 3, code: 'process(data[i])', explanation: 'Process element at index 3.',
    variables: { i: 3, 'data[i]': 40 }, highlight: 'normal',
    arrayState: { name: 'data', values: [10, 20, 30, 40, 50], highlightIndices: [3], swappedIndices: [], sortedIndices: [0, 1, 2], pointers: { i: 3 } },
  },
  {
    line: 5, code: 'return result', explanation: 'Processing complete. All elements visited.',
    conceptNote: 'Complete', variables: { processed: 5 }, highlight: 'return',
    arrayState: { name: 'data', values: [10, 20, 30, 40, 50], highlightIndices: [], swappedIndices: [], sortedIndices: [0, 1, 2, 3, 4], pointers: {} },
  },
];

export function generateLocalDryRun(code: string): DryRunStep[] {
  const lower = code.toLowerCase();
  if (lower.includes('bubble') || (lower.includes('swap') && lower.includes('for'))) return bubbleSortTrace;
  if (lower.includes('binary') || (lower.includes('low') && lower.includes('high') && lower.includes('mid'))) return binarySearchTrace;
  if (lower.includes('sort')) return bubbleSortTrace;
  if (lower.includes('search') || lower.includes('find')) return binarySearchTrace;
  return genericTrace;
}
