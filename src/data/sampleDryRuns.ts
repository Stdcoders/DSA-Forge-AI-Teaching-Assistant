import type { DryRunStep } from '@/components/DryRunPanel';

// ─── Bubble Sort (Enhanced with pass labels & swap arrows) ────────────────────

const bubbleSortTrace: DryRunStep[] = [
  {
    line: 1, code: 'arr = [5, 6, 1, 3]', explanation: 'Initialize the array with 4 elements to sort.',
    conceptNote: 'Setup', variables: { arr: '[5,6,1,3]', n: 4 }, highlight: 'normal',
    arrayState: { name: 'arr', values: [5, 6, 1, 3], highlightIndices: [], swappedIndices: [], sortedIndices: [], pointers: {}, passLabel: 'Placing the 1st largest element at its correct position' },
  },
  {
    line: 3, code: 'for i in range(n-1):', explanation: 'Outer loop pass 1 — bubble the largest element to the end.',
    conceptNote: 'Pass 1', variables: { i: 0, n: 4 }, highlight: 'loop',
    arrayState: { name: 'arr', values: [5, 6, 1, 3], highlightIndices: [], swappedIndices: [], sortedIndices: [], pointers: { i: 0 }, passLabel: 'i=0' },
  },
  {
    line: 5, code: 'if arr[j] > arr[j+1]:', explanation: 'Compare arr[0]=5 and arr[1]=6. Since 5 < 6, no swap needed.',
    conceptNote: 'Compare', variables: { i: 0, j: 0 }, highlight: 'branch',
    arrayState: { name: 'arr', values: [5, 6, 1, 3], highlightIndices: [0, 1], swappedIndices: [], sortedIndices: [], pointers: { j: 0, 'j+1': 1 }, passLabel: 'i=0' },
  },
  {
    line: 5, code: 'if arr[j] > arr[j+1]:', explanation: 'Compare arr[1]=6 and arr[2]=1. Since 6 > 1, we swap!',
    conceptNote: 'Compare & Swap', variables: { i: 0, j: 1 }, highlight: 'branch',
    arrayState: { name: 'arr', values: [5, 6, 1, 3], highlightIndices: [1, 2], swappedIndices: [], sortedIndices: [], pointers: { j: 1, 'j+1': 2 }, passLabel: 'i=0' },
  },
  {
    line: 6, code: 'arr[j], arr[j+1] = arr[j+1], arr[j]', explanation: 'Swap 6 and 1. The smaller value moves left.',
    variables: { i: 0, j: 1 }, highlight: 'normal',
    arrayState: { name: 'arr', values: [5, 1, 6, 3], highlightIndices: [], swappedIndices: [1, 2], sortedIndices: [], pointers: { j: 1, 'j+1': 2 }, passLabel: 'i=1' },
  },
  {
    line: 5, code: 'if arr[j] > arr[j+1]:', explanation: 'Compare arr[2]=6 and arr[3]=3. Since 6 > 3, we swap!',
    variables: { i: 0, j: 2 }, highlight: 'branch',
    arrayState: { name: 'arr', values: [5, 1, 6, 3], highlightIndices: [2, 3], swappedIndices: [], sortedIndices: [], pointers: { j: 2, 'j+1': 3 }, passLabel: 'i=2' },
  },
  {
    line: 6, code: 'arr[j], arr[j+1] = arr[j+1], arr[j]', explanation: 'Swap 6 and 3. After pass 1, the largest element (6) is in its correct final position.',
    conceptNote: 'Pass 1 complete', variables: { i: 0, j: 2 }, highlight: 'normal',
    arrayState: { name: 'arr', values: [5, 1, 3, 6], highlightIndices: [], swappedIndices: [2, 3], sortedIndices: [3], pointers: {}, passLabel: 'Sorted Element' },
  },
  {
    line: 3, code: 'for i in range(n-1):', explanation: 'Start pass 2. We now place the 2nd largest element.',
    conceptNote: 'Pass 2', variables: { i: 1, n: 4 }, highlight: 'loop',
    arrayState: { name: 'arr', values: [5, 1, 3, 6], highlightIndices: [], swappedIndices: [], sortedIndices: [3], pointers: { i: 1 }, passLabel: 'Placing the 2nd largest element' },
  },
  {
    line: 6, code: 'arr[j], arr[j+1] = arr[j+1], arr[j]', explanation: 'Swap 5 and 1.',
    variables: { i: 1, j: 0 }, highlight: 'normal',
    arrayState: { name: 'arr', values: [1, 5, 3, 6], highlightIndices: [], swappedIndices: [0, 1], sortedIndices: [3], pointers: { j: 0, 'j+1': 1 }, passLabel: 'i=1' },
  },
  {
    line: 6, code: 'arr[j], arr[j+1] = arr[j+1], arr[j]', explanation: 'Swap 5 and 3. After pass 2, 5 is in its correct position.',
    conceptNote: 'Pass 2 complete', variables: { i: 1, j: 1 }, highlight: 'normal',
    arrayState: { name: 'arr', values: [1, 3, 5, 6], highlightIndices: [], swappedIndices: [1, 2], sortedIndices: [2, 3], pointers: {}, passLabel: 'Sorted Element' },
  },
  {
    line: 8, code: 'return arr', explanation: 'Array is fully sorted! Bubble sort complete. Time: O(n²), Space: O(1).',
    conceptNote: 'Sorted ✓', variables: { arr: '[1,3,5,6]' }, highlight: 'return',
    arrayState: { name: 'arr', values: [1, 3, 5, 6], highlightIndices: [], swappedIndices: [], sortedIndices: [0, 1, 2, 3], pointers: {} },
  },
];

// ─── Binary Search ────────────────────────────────────────────────────────────

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

// ─── Linked List Reversal ─────────────────────────────────────────────────────

const linkedListReversalTrace: DryRunStep[] = [
  {
    line: 1, code: 'prev = None', explanation: 'Initialize prev pointer to None. We will build the reversed list behind prev.',
    conceptNote: 'Setup', variables: { prev: 'None', curr: 'head' }, highlight: 'normal',
    linkedListState: {
      name: 'Linked List',
      nodes: [
        { value: 8, id: 'n1' }, { value: 7, id: 'n2' }, { value: 5, id: 'n3' },
        { value: 2, id: 'n4' }, { value: 1, id: 'n5' },
      ],
      pointers: { head: 0, curr: 0 }, highlightIndices: [],
    },
  },
  {
    line: 2, code: 'curr = head', explanation: 'Set curr to head (node 8). We will iterate through the list.',
    variables: { prev: 'None', curr: 8 }, highlight: 'normal',
    linkedListState: {
      name: 'Linked List',
      nodes: [
        { value: 8, id: 'n1', highlight: 'active' }, { value: 7, id: 'n2' }, { value: 5, id: 'n3' },
        { value: 2, id: 'n4' }, { value: 1, id: 'n5' },
      ],
      pointers: { curr: 0 }, highlightIndices: [0],
    },
  },
  {
    line: 4, code: 'next_node = curr.next', explanation: 'Save curr.next (node 7) before we break the link.',
    conceptNote: 'Save next', variables: { prev: 'None', curr: 8, next_node: 7 }, highlight: 'normal',
    linkedListState: {
      name: 'Linked List',
      nodes: [
        { value: 8, id: 'n1', highlight: 'active' }, { value: 7, id: 'n2', highlight: 'active' },
        { value: 5, id: 'n3' }, { value: 2, id: 'n4' }, { value: 1, id: 'n5' },
      ],
      pointers: { curr: 0, next: 1 }, highlightIndices: [0, 1],
    },
  },
  {
    line: 5, code: 'curr.next = prev', explanation: 'Reverse the link! Node 8\'s next now points to None (prev).',
    conceptNote: 'Reverse link', variables: { prev: 'None', curr: 8, next_node: 7 }, highlight: 'branch',
    linkedListState: {
      name: 'Reversed so far',
      nodes: [
        { value: 8, id: 'n1', highlight: 'visited' },
      ],
      pointers: { prev: 0 }, highlightIndices: [],
    },
  },
  {
    line: 6, code: 'prev = curr', explanation: 'Move prev forward to curr (node 8). This is the new start of reversed portion.',
    variables: { prev: 8, curr: 8, next_node: 7 }, highlight: 'normal',
    linkedListState: {
      name: 'Linked List',
      nodes: [
        { value: 8, id: 'n1', highlight: 'visited' }, { value: 7, id: 'n2' },
        { value: 5, id: 'n3' }, { value: 2, id: 'n4' }, { value: 1, id: 'n5' },
      ],
      pointers: { prev: 0, curr: 1 }, highlightIndices: [],
    },
  },
  {
    line: 7, code: 'curr = next_node', explanation: 'Move curr to next_node (node 7). Continue iteration.',
    conceptNote: 'Advance curr', variables: { prev: 8, curr: 7, next_node: 7 }, highlight: 'loop',
    linkedListState: {
      name: 'Linked List',
      nodes: [
        { value: 8, id: 'n1', highlight: 'visited' }, { value: 7, id: 'n2', highlight: 'active' },
        { value: 5, id: 'n3' }, { value: 2, id: 'n4' }, { value: 1, id: 'n5' },
      ],
      pointers: { prev: 0, curr: 1 }, highlightIndices: [1],
    },
  },
  {
    line: 5, code: 'curr.next = prev', explanation: 'Reverse link! Node 7\'s next now points to node 8 (prev).',
    conceptNote: 'Reverse link', variables: { prev: 8, curr: 7, next_node: 5 }, highlight: 'branch',
    linkedListState: {
      name: 'Linked List',
      nodes: [
        { value: 8, id: 'n1', highlight: 'visited' }, { value: 7, id: 'n2', highlight: 'visited' },
        { value: 5, id: 'n3', highlight: 'active' }, { value: 2, id: 'n4' }, { value: 1, id: 'n5' },
      ],
      pointers: { prev: 1, curr: 2 }, highlightIndices: [1, 2],
    },
  },
  {
    line: 5, code: 'curr.next = prev', explanation: 'Reverse link! Node 5\'s next now points to node 7.',
    conceptNote: 'Reverse link', variables: { prev: 7, curr: 5, next_node: 2 }, highlight: 'branch',
    linkedListState: {
      name: 'Linked List',
      nodes: [
        { value: 8, id: 'n1', highlight: 'visited' }, { value: 7, id: 'n2', highlight: 'visited' },
        { value: 5, id: 'n3', highlight: 'visited' }, { value: 2, id: 'n4', highlight: 'active' },
        { value: 1, id: 'n5' },
      ],
      pointers: { prev: 2, curr: 3 }, highlightIndices: [2, 3],
    },
  },
  {
    line: 5, code: 'curr.next = prev', explanation: 'Reverse link! Node 2\'s next now points to node 5.',
    conceptNote: 'Reverse link', variables: { prev: 5, curr: 2, next_node: 1 }, highlight: 'branch',
    linkedListState: {
      name: 'Linked List',
      nodes: [
        { value: 8, id: 'n1', highlight: 'visited' }, { value: 7, id: 'n2', highlight: 'visited' },
        { value: 5, id: 'n3', highlight: 'visited' }, { value: 2, id: 'n4', highlight: 'visited' },
        { value: 1, id: 'n5', highlight: 'active' },
      ],
      pointers: { prev: 3, curr: 4 }, highlightIndices: [3, 4],
    },
  },
  {
    line: 5, code: 'curr.next = prev', explanation: 'Reverse last link! Node 1\'s next now points to node 2.',
    conceptNote: 'Last reversal', variables: { prev: 2, curr: 1, next_node: 'None' }, highlight: 'branch',
    linkedListState: {
      name: 'Reversed List ✓',
      nodes: [
        { value: 1, id: 'r1', highlight: 'visited' }, { value: 2, id: 'r2', highlight: 'visited' },
        { value: 5, id: 'r3', highlight: 'visited' }, { value: 7, id: 'r4', highlight: 'visited' },
        { value: 8, id: 'r5', highlight: 'visited' },
      ],
      pointers: { head: 0 }, highlightIndices: [],
    },
  },
  {
    line: 9, code: 'return prev', explanation: 'Return prev as new head. The list is fully reversed: 1→2→5→7→8→NULL.',
    conceptNote: 'Reversed ✓', variables: { result: '1→2→5→7→8' }, highlight: 'return',
    linkedListState: {
      name: 'Reversed List ✓',
      nodes: [
        { value: 1, id: 'r1', highlight: 'visited' }, { value: 2, id: 'r2', highlight: 'visited' },
        { value: 5, id: 'r3', highlight: 'visited' }, { value: 7, id: 'r4', highlight: 'visited' },
        { value: 8, id: 'r5', highlight: 'visited' },
      ],
      pointers: { head: 0 }, highlightIndices: [],
    },
  },
];

// ─── Stack Push/Pop ───────────────────────────────────────────────────────────

const stackOperationsTrace: DryRunStep[] = [
  {
    line: 1, code: 'stack = Stack()', explanation: 'Create an empty stack. We\'ll demonstrate push and pop operations.',
    conceptNote: 'Stack Init', variables: { 'stack.size': 0 }, highlight: 'normal',
    stackState: { name: 'Stack', values: [], pointers: {}, highlightIndices: [], operation: 'none' },
  },
  {
    line: 2, code: 'stack.push(1)', explanation: 'Push element 1 onto the stack. It becomes the first element (top).',
    conceptNote: 'Push', variables: { 'stack.size': 1, top: 1 }, highlight: 'normal',
    stackState: { name: 'Stack', values: [1], pointers: { top: 0 }, highlightIndices: [0], operation: 'push', operationValue: 1 },
  },
  {
    line: 3, code: 'stack.push(2)', explanation: 'Push element 2 onto the stack. It goes on top of 1.',
    conceptNote: 'Push', variables: { 'stack.size': 2, top: 2 }, highlight: 'normal',
    stackState: { name: 'Stack', values: [1, 2], pointers: { top: 1 }, highlightIndices: [1], operation: 'push', operationValue: 2 },
  },
  {
    line: 4, code: 'stack.push(3)', explanation: 'Push element 3 onto the stack. Stack grows from left to right.',
    conceptNote: 'Push', variables: { 'stack.size': 3, top: 3 }, highlight: 'normal',
    stackState: { name: 'Stack', values: [1, 2, 3], pointers: { top: 2 }, highlightIndices: [2], operation: 'push', operationValue: 3 },
  },
  {
    line: 5, code: 'stack.push(4)', explanation: 'Push element 4. It becomes the new top. Stack = [1, 2, 3, 4].',
    conceptNote: 'Push', variables: { 'stack.size': 4, top: 4 }, highlight: 'normal',
    stackState: { name: 'Stack', values: [1, 2, 3, 4], pointers: { top: 3 }, highlightIndices: [3], operation: 'push', operationValue: 4 },
  },
  {
    line: 7, code: 'val = stack.pop()', explanation: 'Pop removes and returns the top element (4). LIFO: Last In, First Out!',
    conceptNote: 'Pop (LIFO)', variables: { 'stack.size': 3, popped: 4, top: 3 }, highlight: 'branch',
    stackState: { name: 'Stack', values: [1, 2, 3], pointers: { top: 2 }, highlightIndices: [], operation: 'pop', operationValue: 4 },
  },
  {
    line: 8, code: 'val = stack.pop()', explanation: 'Pop element 3 from the top. Stack = [1, 2].',
    conceptNote: 'Pop', variables: { 'stack.size': 2, popped: 3, top: 2 }, highlight: 'branch',
    stackState: { name: 'Stack', values: [1, 2], pointers: { top: 1 }, highlightIndices: [], operation: 'pop', operationValue: 3 },
  },
  {
    line: 9, code: 'top = stack.peek()', explanation: 'Peek returns the top element (2) without removing it.',
    conceptNote: 'Peek', variables: { 'stack.size': 2, peek: 2 }, highlight: 'normal',
    stackState: { name: 'Stack', values: [1, 2], pointers: { top: 1 }, highlightIndices: [1], operation: 'peek', operationValue: 2 },
  },
  {
    line: 10, code: 'print(stack)', explanation: 'Final stack state: [1, 2]. Operations complete. Time: O(1) per operation.',
    conceptNote: 'Complete ✓', variables: { 'stack.size': 2 }, highlight: 'return',
    stackState: { name: 'Stack', values: [1, 2], pointers: { top: 1 }, highlightIndices: [], operation: 'none' },
  },
];

// ─── Binary Tree Inorder Traversal ────────────────────────────────────────────

const treeInorderTrace: DryRunStep[] = [
  {
    line: 1, code: 'def inorder(node):', explanation: 'Start inorder traversal of the binary tree. Order: Left → Root → Right.',
    conceptNote: 'Inorder Traversal', variables: { node: 1 }, highlight: 'normal',
    treeState: {
      name: 'Binary Tree — Inorder Traversal',
      nodes: [
        { id: 'A', value: 1, left: 'B', right: 'C' },
        { id: 'B', value: 2, left: 'D', right: 'E' },
        { id: 'C', value: 3, right: 'F' },
        { id: 'D', value: 4 },
        { id: 'E', value: 5 },
        { id: 'F', value: 6 },
      ],
      activeNodeId: 'A', traversalOrder: [],
    },
  },
  {
    line: 2, code: 'inorder(node.left)  # Go left', explanation: 'Go to left subtree of node 1 → move to node 2.',
    conceptNote: 'Go Left', variables: { node: 2, parent: 1 }, highlight: 'loop',
    treeState: {
      name: 'Binary Tree — Inorder Traversal',
      nodes: [
        { id: 'A', value: 1, left: 'B', right: 'C' },
        { id: 'B', value: 2, left: 'D', right: 'E', highlight: 'active' },
        { id: 'C', value: 3, right: 'F' },
        { id: 'D', value: 4 },
        { id: 'E', value: 5 },
        { id: 'F', value: 6 },
      ],
      activeNodeId: 'B', traversalOrder: [],
    },
  },
  {
    line: 2, code: 'inorder(node.left)  # Go left', explanation: 'Go to left subtree of node 2 → move to node 4 (leaf node).',
    conceptNote: 'Go Left', variables: { node: 4, parent: 2 }, highlight: 'loop',
    treeState: {
      name: 'Binary Tree — Inorder Traversal',
      nodes: [
        { id: 'A', value: 1, left: 'B', right: 'C' },
        { id: 'B', value: 2, left: 'D', right: 'E' },
        { id: 'C', value: 3, right: 'F' },
        { id: 'D', value: 4, highlight: 'active' },
        { id: 'E', value: 5 },
        { id: 'F', value: 6 },
      ],
      activeNodeId: 'D', traversalOrder: [],
    },
  },
  {
    line: 3, code: 'visit(node)  # Visit 4', explanation: 'Node 4 has no left child. Visit node 4. It\'s a leaf — no children to explore.',
    conceptNote: 'Visit Leaf', variables: { visited: 4 }, highlight: 'return',
    treeState: {
      name: 'Binary Tree — Inorder Traversal',
      nodes: [
        { id: 'A', value: 1, left: 'B', right: 'C' },
        { id: 'B', value: 2, left: 'D', right: 'E' },
        { id: 'C', value: 3, right: 'F' },
        { id: 'D', value: 4, highlight: 'visited' },
        { id: 'E', value: 5 },
        { id: 'F', value: 6 },
      ],
      activeNodeId: 'D', traversalOrder: [4],
    },
  },
  {
    line: 3, code: 'visit(node)  # Visit 2', explanation: 'Back to node 2. Left done, now visit root (node 2).',
    conceptNote: 'Visit Root', variables: { visited: 2 }, highlight: 'return',
    treeState: {
      name: 'Binary Tree — Inorder Traversal',
      nodes: [
        { id: 'A', value: 1, left: 'B', right: 'C' },
        { id: 'B', value: 2, left: 'D', right: 'E', highlight: 'visited' },
        { id: 'C', value: 3, right: 'F' },
        { id: 'D', value: 4, highlight: 'visited' },
        { id: 'E', value: 5 },
        { id: 'F', value: 6 },
      ],
      activeNodeId: 'B', traversalOrder: [4, 2],
    },
  },
  {
    line: 4, code: 'inorder(node.right)  # Go right', explanation: 'Now the right subtree of 2 — move to node 5. Node 5 has no left subtree, so visit it.',
    conceptNote: 'Visit Right', variables: { visited: 5 }, highlight: 'return',
    treeState: {
      name: 'Binary Tree — Inorder Traversal',
      nodes: [
        { id: 'A', value: 1, left: 'B', right: 'C' },
        { id: 'B', value: 2, left: 'D', right: 'E', highlight: 'visited' },
        { id: 'C', value: 3, right: 'F' },
        { id: 'D', value: 4, highlight: 'visited' },
        { id: 'E', value: 5, highlight: 'visited' },
        { id: 'F', value: 6 },
      ],
      activeNodeId: 'E', traversalOrder: [4, 2, 5],
    },
  },
  {
    line: 3, code: 'visit(node)  # Visit 1', explanation: 'Back to root node 1. Left subtree done, visit root.',
    conceptNote: 'Visit Root', variables: { visited: 1 }, highlight: 'return',
    treeState: {
      name: 'Binary Tree — Inorder Traversal',
      nodes: [
        { id: 'A', value: 1, left: 'B', right: 'C', highlight: 'visited' },
        { id: 'B', value: 2, left: 'D', right: 'E', highlight: 'visited' },
        { id: 'C', value: 3, right: 'F' },
        { id: 'D', value: 4, highlight: 'visited' },
        { id: 'E', value: 5, highlight: 'visited' },
        { id: 'F', value: 6 },
      ],
      activeNodeId: 'A', traversalOrder: [4, 2, 5, 1],
    },
  },
  {
    line: 4, code: 'inorder(node.right)  # Go right', explanation: 'Now right subtree of root 1 → node 3. Node 3 has no left, so visit it.',
    conceptNote: 'Visit Right', variables: { visited: 3 }, highlight: 'return',
    treeState: {
      name: 'Binary Tree — Inorder Traversal',
      nodes: [
        { id: 'A', value: 1, left: 'B', right: 'C', highlight: 'visited' },
        { id: 'B', value: 2, left: 'D', right: 'E', highlight: 'visited' },
        { id: 'C', value: 3, right: 'F', highlight: 'visited' },
        { id: 'D', value: 4, highlight: 'visited' },
        { id: 'E', value: 5, highlight: 'visited' },
        { id: 'F', value: 6 },
      ],
      activeNodeId: 'C', traversalOrder: [4, 2, 5, 1, 3],
    },
  },
  {
    line: 4, code: 'inorder(node.right)  # Visit 6', explanation: 'Right child of node 3 is node 6 (leaf). Visit node 6. Traversal complete!',
    conceptNote: 'Complete ✓', variables: { visited: 6 }, highlight: 'return',
    treeState: {
      name: 'Binary Tree — Inorder Traversal ✓',
      nodes: [
        { id: 'A', value: 1, left: 'B', right: 'C', highlight: 'visited' },
        { id: 'B', value: 2, left: 'D', right: 'E', highlight: 'visited' },
        { id: 'C', value: 3, right: 'F', highlight: 'visited' },
        { id: 'D', value: 4, highlight: 'visited' },
        { id: 'E', value: 5, highlight: 'visited' },
        { id: 'F', value: 6, highlight: 'visited' },
      ],
      activeNodeId: 'F', traversalOrder: [4, 2, 5, 1, 3, 6],
    },
  },
];

// ─── Generic Trace ────────────────────────────────────────────────────────────

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

// ─── Detection & Export ───────────────────────────────────────────────────────

export function generateLocalDryRun(code: string): DryRunStep[] {
  const lower = code.toLowerCase();

  // Linked list detection
  if (lower.includes('listnode') || lower.includes('linked list') || lower.includes('node.next') ||
      lower.includes('node->next') || lower.includes('.next') || lower.includes('->next')) {
    return linkedListReversalTrace;
  }

  // Stack detection
  if (lower.includes('stack') || (lower.includes('push') && lower.includes('pop')) ||
      lower.includes('lifo') || lower.includes('.push(') || lower.includes('.pop(')) {
    return stackOperationsTrace;
  }

  // Tree detection
  if (lower.includes('treenode') || lower.includes('inorder') || lower.includes('preorder') ||
      lower.includes('postorder') || lower.includes('binary tree') ||
      (lower.includes('node.left') || lower.includes('node->left') || lower.includes('.left')) &&
      (lower.includes('node.right') || lower.includes('node->right') || lower.includes('.right'))) {
    return treeInorderTrace;
  }

  // Array/sorting detection
  if (lower.includes('bubble') || (lower.includes('swap') && lower.includes('for'))) return bubbleSortTrace;
  if (lower.includes('binary') || (lower.includes('low') && lower.includes('high') && lower.includes('mid'))) return binarySearchTrace;
  if (lower.includes('sort')) return bubbleSortTrace;
  if (lower.includes('search') || lower.includes('find')) return binarySearchTrace;

  return genericTrace;
}
