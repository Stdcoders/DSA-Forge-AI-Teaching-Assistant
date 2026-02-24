

# Fix Practice Problem Examples and Constraints

## Problem
All practice problems use the `mkProblem` helper which fills in placeholder text ("See description") for examples, constraints, test cases, and starter code. This means the problem description panel shows useless generic text instead of actual input/output examples and constraints.

## Solution
Update the `mkProblem` helper calls in `src/data/curriculum.ts` to include real, problem-specific data for each problem. This is a data-only change -- no component code needs to change.

There are approximately 50+ problems across all topics. Each problem needs:
- **Examples**: Real input/output pairs with optional explanations
- **Constraints**: Array size limits, value ranges, etc.
- **Test cases**: Actual stdin/stdout pairs for Judge0 execution
- **Starter code**: Language-specific function signatures (not generic comments)

## Approach

### Option A: Update `mkProblem` to accept optional overrides (recommended)
Modify the helper to accept an optional config object for examples, constraints, test cases, and starter code. Then update each problem call with real data.

### What changes

**File: `src/data/curriculum.ts`**

1. Update the `mkProblem` function signature to accept an optional extras parameter:
```typescript
function mkProblem(
  id: string, title: string, difficulty: Difficulty, desc: string,
  extras?: Partial<Pick<Problem, 'examples' | 'constraints' | 'testCases' | 'starterCode'>>
): Problem {
  return {
    id, title, difficulty, description: desc,
    examples: extras?.examples || [{ input: 'See description', output: 'See description' }],
    constraints: extras?.constraints || ['See description'],
    testCases: extras?.testCases || [{ input: 'sample', expectedOutput: 'sample' }],
    starterCode: extras?.starterCode || {
      python: `# ${title}\npass`,
      java: `// ${title}\npublic class Solution {\n}`,
      cpp: `// ${title}\n#include <bits/stdc++.h>\nusing namespace std;\n`,
    },
  };
}
```

2. Update each problem with real data. For example, the "Two Sum" problem becomes:
```typescript
mkProblem('two-sum', 'Two Sum', 'easy',
  'Given an array and target, return indices of two numbers that add up to target.',
  {
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0, 1]', explanation: 'nums[0] + nums[1] = 2 + 7 = 9' },
      { input: 'nums = [3,2,4], target = 6', output: '[1, 2]' },
    ],
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      'Exactly one valid answer exists',
    ],
    testCases: [
      { input: '4\n2 7 11 15\n9', expectedOutput: '0 1' },
      { input: '3\n3 2 4\n6', expectedOutput: '1 2' },
    ],
    starterCode: {
      python: 'def two_sum(nums, target):\n    # Your solution here\n    pass',
      java: 'public int[] twoSum(int[] nums, int target) {\n    // Your solution here\n    return new int[]{};\n}',
      cpp: 'vector<int> twoSum(vector<int>& nums, int target) {\n    // Your solution here\n    return {};\n}',
    },
  }
)
```

3. Populate real examples, constraints, test cases, and starter code for all ~50 problems across every topic (Arrays, Sorting, Strings, Trees, Graphs, DP, etc.)

### No changes needed to:
- `src/pages/PracticePage.tsx` (already renders examples/constraints correctly)
- Any other component files
- Database schema

This is purely a content/data update in the curriculum file.
