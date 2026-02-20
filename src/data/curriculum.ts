export type Difficulty = 'easy' | 'medium' | 'hard';
export type Language = 'python' | 'java' | 'cpp';

export interface Problem {
  id: string;
  title: string;
  difficulty: Difficulty;
  description: string;
  examples: { input: string; output: string; explanation?: string }[];
  constraints: string[];
  testCases: { input: string; expectedOutput: string }[];
  starterCode: Record<Language, string>;
}

export interface TopicContent {
  id: string;
  title: string;
  icon: string;
  color: string;
  order: number;
  prerequisites: string[];
  nextTopics: string[];
  estimatedHours: number;
  definition: string;
  analogy: string;
  whyUseIt: string;
  timeComplexity: { operation: string; best: string; average: string; worst: string }[];
  spaceComplexity: string;
  codeExamples: Record<Language, string>;
  problems: Problem[];
}

export const TOPICS: TopicContent[] = [
  {
    id: 'arrays',
    title: 'Arrays',
    icon: '▦',
    color: 'cyan',
    order: 1,
    prerequisites: [],
    nextTopics: ['recursion', 'linked-lists'],
    estimatedHours: 4,
    definition: 'An array is a linear data structure that stores a fixed-size sequential collection of elements of the same type. Elements are stored in contiguous memory locations, allowing O(1) random access via index.',
    analogy: 'Think of an array like a row of numbered lockers in a school hallway. Each locker has a unique number (index), and you can instantly go to any locker if you know its number — no searching required.',
    whyUseIt: 'Arrays are the foundation of almost every algorithm. They provide O(1) access by index, making them ideal for lookups, sorting, and two-pointer/sliding window techniques. They\'re used in image processing (pixel arrays), databases, and virtually every program that stores a list of items.',
    timeComplexity: [
      { operation: 'Access', best: 'O(1)', average: 'O(1)', worst: 'O(1)' },
      { operation: 'Search', best: 'O(1)', average: 'O(n)', worst: 'O(n)' },
      { operation: 'Insert (end)', best: 'O(1)', average: 'O(1)', worst: 'O(n)' },
      { operation: 'Insert (middle)', best: 'O(n)', average: 'O(n)', worst: 'O(n)' },
      { operation: 'Delete', best: 'O(1)', average: 'O(n)', worst: 'O(n)' },
    ],
    spaceComplexity: 'O(n) — where n is the number of elements',
    codeExamples: {
      python: `# Array basics in Python
arr = [1, 2, 3, 4, 5]

# Access by index — O(1)
print(arr[0])   # 1
print(arr[-1])  # 5 (last element)

# Two-pointer technique — finding pair with target sum
def two_sum(arr, target):
    left, right = 0, len(arr) - 1
    while left < right:
        current = arr[left] + arr[right]
        if current == target:
            return [left, right]
        elif current < target:
            left += 1
        else:
            right -= 1
    return []

sorted_arr = [2, 7, 11, 15]
print(two_sum(sorted_arr, 9))  # [0, 1]

# Sliding window — max sum subarray of size k
def max_subarray_sum(arr, k):
    window_sum = sum(arr[:k])
    max_sum = window_sum
    for i in range(k, len(arr)):
        window_sum += arr[i] - arr[i - k]
        max_sum = max(max_sum, window_sum)
    return max_sum

print(max_subarray_sum([2, 1, 5, 1, 3, 2], 3))  # 9`,
      java: `// Array basics in Java
public class ArrayDemo {
    // Two-pointer: find pair with target sum in sorted array
    public static int[] twoSum(int[] arr, int target) {
        int left = 0, right = arr.length - 1;
        while (left < right) {
            int sum = arr[left] + arr[right];
            if (sum == target) return new int[]{left, right};
            else if (sum < target) left++;
            else right--;
        }
        return new int[]{};
    }

    // Sliding window: max sum subarray of size k
    public static int maxSubarraySum(int[] arr, int k) {
        int windowSum = 0;
        for (int i = 0; i < k; i++) windowSum += arr[i];
        int maxSum = windowSum;
        for (int i = k; i < arr.length; i++) {
            windowSum += arr[i] - arr[i - k];
            maxSum = Math.max(maxSum, windowSum);
        }
        return maxSum;
    }

    public static void main(String[] args) {
        int[] sorted = {2, 7, 11, 15};
        int[] result = twoSum(sorted, 9);
        System.out.println(result[0] + ", " + result[1]); // 0, 1

        int[] arr = {2, 1, 5, 1, 3, 2};
        System.out.println(maxSubarraySum(arr, 3)); // 9
    }
}`,
      cpp: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

// Two-pointer: find pair with target sum in sorted array
vector<int> twoSum(vector<int>& arr, int target) {
    int left = 0, right = arr.size() - 1;
    while (left < right) {
        int sum = arr[left] + arr[right];
        if (sum == target) return {left, right};
        else if (sum < target) left++;
        else right--;
    }
    return {};
}

// Sliding window: max sum subarray of size k
int maxSubarraySum(vector<int>& arr, int k) {
    int windowSum = 0;
    for (int i = 0; i < k; i++) windowSum += arr[i];
    int maxSum = windowSum;
    for (int i = k; i < arr.size(); i++) {
        windowSum += arr[i] - arr[i - k];
        maxSum = max(maxSum, windowSum);
    }
    return maxSum;
}

int main() {
    vector<int> sorted = {2, 7, 11, 15};
    auto result = twoSum(sorted, 9);
    cout << result[0] << ", " << result[1] << endl; // 0, 1

    vector<int> arr = {2, 1, 5, 1, 3, 2};
    cout << maxSubarraySum(arr, 3) << endl; // 9
    return 0;
}`
    },
    problems: [
      {
        id: 'two-sum',
        title: 'Two Sum',
        difficulty: 'easy',
        description: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`. You may assume that each input would have exactly one solution, and you may not use the same element twice.',
        examples: [
          { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'nums[0] + nums[1] = 2 + 7 = 9' },
          { input: 'nums = [3,2,4], target = 6', output: '[1,2]' },
        ],
        constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9', '-10^9 <= target <= 10^9'],
        testCases: [
          { input: '[2,7,11,15]\n9', expectedOutput: '[0,1]' },
          { input: '[3,2,4]\n6', expectedOutput: '[1,2]' },
          { input: '[3,3]\n6', expectedOutput: '[0,1]' },
        ],
        starterCode: {
          python: `def two_sum(nums: list[int], target: int) -> list[int]:
    # Your solution here
    pass

# Read input
import sys
data = sys.stdin.read().split('\\n')
nums = list(map(int, data[0].strip('[]').split(',')))
target = int(data[1])
print(two_sum(nums, target))`,
          java: `import java.util.*;
public class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Your solution here
        return new int[]{};
    }
}`,
          cpp: `#include <bits/stdc++.h>
using namespace std;
vector<int> twoSum(vector<int>& nums, int target) {
    // Your solution here
    return {};
}`,
        }
      },
      {
        id: 'max-subarray',
        title: 'Maximum Subarray',
        difficulty: 'medium',
        description: 'Given an integer array `nums`, find the subarray with the largest sum, and return its sum. (Kadane\'s Algorithm)',
        examples: [
          { input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6', explanation: 'Subarray [4,-1,2,1] has the largest sum = 6' },
          { input: 'nums = [1]', output: '1' },
        ],
        constraints: ['1 <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4'],
        testCases: [
          { input: '[-2,1,-3,4,-1,2,1,-5,4]', expectedOutput: '6' },
          { input: '[1]', expectedOutput: '1' },
          { input: '[5,4,-1,7,8]', expectedOutput: '23' },
        ],
        starterCode: {
          python: `def max_subarray(nums: list[int]) -> int:
    # Your solution here (hint: Kadane's algorithm)
    pass

import sys
nums = list(map(int, sys.stdin.read().strip().strip('[]').split(',')))
print(max_subarray(nums))`,
          java: `public class Solution {
    public int maxSubArray(int[] nums) {
        // Your solution here
        return 0;
    }
}`,
          cpp: `#include <bits/stdc++.h>
using namespace std;
int maxSubArray(vector<int>& nums) {
    // Your solution here
    return 0;
}`,
        }
      },
      {
        id: 'rotate-array',
        title: 'Rotate Array',
        difficulty: 'hard',
        description: 'Given an integer array `nums`, rotate the array to the right by `k` steps, where `k` is non-negative. Do it in-place with O(1) extra space.',
        examples: [
          { input: 'nums = [1,2,3,4,5,6,7], k = 3', output: '[5,6,7,1,2,3,4]' },
          { input: 'nums = [-1,-100,3,99], k = 2', output: '[3,99,-1,-100]' },
        ],
        constraints: ['1 <= nums.length <= 10^5', '-2^31 <= nums[i] <= 2^31-1', '0 <= k <= 10^5'],
        testCases: [
          { input: '[1,2,3,4,5,6,7]\n3', expectedOutput: '[5,6,7,1,2,3,4]' },
          { input: '[-1,-100,3,99]\n2', expectedOutput: '[3,99,-1,-100]' },
        ],
        starterCode: {
          python: `def rotate(nums: list[int], k: int) -> None:
    # Modify in-place
    pass

import sys
data = sys.stdin.read().split('\\n')
nums = list(map(int, data[0].strip('[]').split(',')))
k = int(data[1])
rotate(nums, k)
print(nums)`,
          java: `public class Solution {
    public void rotate(int[] nums, int k) {
        // Your solution here
    }
}`,
          cpp: `#include <bits/stdc++.h>
using namespace std;
void rotate(vector<int>& nums, int k) {
    // Your solution here
}`,
        }
      }
    ]
  },
  {
    id: 'recursion',
    title: 'Recursion',
    icon: '↩',
    color: 'purple',
    order: 2,
    prerequisites: ['arrays'],
    nextTopics: ['linked-lists', 'trees'],
    estimatedHours: 5,
    definition: 'Recursion is a technique where a function calls itself to solve a smaller subproblem of the same type. Every recursive solution has a base case (stopping condition) and a recursive case (self-call with reduced input).',
    analogy: 'Imagine standing in a long line and wanting to know what position you are. You ask the person in front of you their position, who asks the person in front of them, and so on. When the first person answers "1", each person adds 1 and passes it back. That\'s recursion — delegating to a smaller version of the same problem.',
    whyUseIt: 'Recursion elegantly solves problems with naturally recursive structures: tree traversal, divide-and-conquer (merge sort, quicksort), backtracking (N-Queens, Sudoku), and dynamic programming. Many graph and tree algorithms are far simpler with recursion than iteration.',
    timeComplexity: [
      { operation: 'Factorial (n)', best: 'O(n)', average: 'O(n)', worst: 'O(n)' },
      { operation: 'Fibonacci (naive)', best: 'O(2^n)', average: 'O(2^n)', worst: 'O(2^n)' },
      { operation: 'Binary Search', best: 'O(1)', average: 'O(log n)', worst: 'O(log n)' },
      { operation: 'Merge Sort', best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
    ],
    spaceComplexity: 'O(n) for call stack depth in most cases; O(log n) for balanced recursion',
    codeExamples: {
      python: `# Recursion fundamentals

# 1. Base pattern: Factorial
def factorial(n):
    if n <= 1:       # Base case
        return 1
    return n * factorial(n - 1)  # Recursive case

# 2. Fibonacci with memoization
from functools import lru_cache

@lru_cache(maxsize=None)
def fib(n):
    if n <= 1:
        return n
    return fib(n-1) + fib(n-2)

# 3. Binary search (recursive)
def binary_search(arr, target, left, right):
    if left > right:
        return -1
    mid = (left + right) // 2
    if arr[mid] == target:
        return mid
    elif arr[mid] < target:
        return binary_search(arr, target, mid + 1, right)
    else:
        return binary_search(arr, target, left, mid - 1)

arr = [1, 3, 5, 7, 9, 11]
print(binary_search(arr, 7, 0, len(arr)-1))  # 3`,
      java: `public class RecursionDemo {
    // Factorial
    static long factorial(int n) {
        if (n <= 1) return 1;
        return n * factorial(n - 1);
    }

    // Binary search recursive
    static int binarySearch(int[] arr, int target, int left, int right) {
        if (left > right) return -1;
        int mid = (left + right) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) return binarySearch(arr, target, mid + 1, right);
        return binarySearch(arr, target, left, mid - 1);
    }

    // Power of x^n using recursion
    static double myPow(double x, int n) {
        if (n == 0) return 1;
        if (n < 0) return 1 / myPow(x, -n);
        if (n % 2 == 0) {
            double half = myPow(x, n / 2);
            return half * half;
        }
        return x * myPow(x, n - 1);
    }
}`,
      cpp: `#include <iostream>
using namespace std;

// Factorial
long long factorial(int n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}

// Binary search recursive
int binarySearch(int arr[], int target, int left, int right) {
    if (left > right) return -1;
    int mid = (left + right) / 2;
    if (arr[mid] == target) return mid;
    if (arr[mid] < target) return binarySearch(arr, target, mid + 1, right);
    return binarySearch(arr, target, left, mid - 1);
}

// Fast power: x^n in O(log n)
double myPow(double x, int n) {
    if (n == 0) return 1;
    if (n < 0) return 1 / myPow(x, -n);
    if (n % 2 == 0) {
        double half = myPow(x, n / 2);
        return half * half;
    }
    return x * myPow(x, n - 1);
}`
    },
    problems: [
      {
        id: 'fibonacci',
        title: 'Fibonacci Number',
        difficulty: 'easy',
        description: 'Given `n`, calculate the nth Fibonacci number. F(0) = 0, F(1) = 1, F(n) = F(n-1) + F(n-2).',
        examples: [
          { input: 'n = 4', output: '3', explanation: 'F(4) = F(3) + F(2) = 2 + 1 = 3' },
          { input: 'n = 10', output: '55' },
        ],
        constraints: ['0 <= n <= 30'],
        testCases: [
          { input: '4', expectedOutput: '3' },
          { input: '10', expectedOutput: '55' },
          { input: '0', expectedOutput: '0' },
        ],
        starterCode: {
          python: `def fib(n: int) -> int:
    # Your solution here
    pass

n = int(input())
print(fib(n))`,
          java: `public class Solution {
    public int fib(int n) {
        // Your solution here
        return 0;
    }
}`,
          cpp: `#include <bits/stdc++.h>
using namespace std;
int fib(int n) {
    // Your solution here
    return 0;
}`,
        }
      },
      {
        id: 'power-of-x',
        title: 'Pow(x, n)',
        difficulty: 'medium',
        description: 'Implement pow(x, n), which calculates x raised to the power n (i.e., x^n). Use fast exponentiation.',
        examples: [
          { input: 'x = 2.00000, n = 10', output: '1024.00000' },
          { input: 'x = 2.00000, n = -2', output: '0.25000' },
        ],
        constraints: ['-100.0 < x < 100.0', '-2^31 <= n <= 2^31-1'],
        testCases: [
          { input: '2.0\n10', expectedOutput: '1024.0' },
          { input: '2.0\n-2', expectedOutput: '0.25' },
        ],
        starterCode: {
          python: `def my_pow(x: float, n: int) -> float:
    # Hint: use fast exponentiation (divide n by 2 each time)
    pass

import sys
data = sys.stdin.read().split()
print(round(my_pow(float(data[0]), int(data[1])), 5))`,
          java: `public class Solution {
    public double myPow(double x, int n) {
        return 0;
    }
}`,
          cpp: `double myPow(double x, int n) {
    return 0;
}`,
        }
      },
      {
        id: 'generate-parentheses',
        title: 'Generate Parentheses',
        difficulty: 'hard',
        description: 'Given n pairs of parentheses, write a function to generate all combinations of well-formed parentheses.',
        examples: [
          { input: 'n = 3', output: '["((()))","(()())","(())()","()(())","()()()"]' },
          { input: 'n = 1', output: '["()"]' },
        ],
        constraints: ['1 <= n <= 8'],
        testCases: [
          { input: '1', expectedOutput: '["()"]' },
          { input: '3', expectedOutput: '["((()))","(()())","(())()","()(())","()()()"]' },
        ],
        starterCode: {
          python: `def generate_parenthesis(n: int) -> list[str]:
    result = []
    def backtrack(s, open_count, close_count):
        # Your solution here
        pass
    backtrack("", 0, 0)
    return result

n = int(input())
print(generate_parenthesis(n))`,
          java: `import java.util.*;
public class Solution {
    public List<String> generateParenthesis(int n) {
        List<String> result = new ArrayList<>();
        return result;
    }
}`,
          cpp: `#include <bits/stdc++.h>
using namespace std;
vector<string> generateParenthesis(int n) {
    vector<string> result;
    return result;
}`,
        }
      }
    ]
  },
  {
    id: 'linked-lists',
    title: 'Linked Lists',
    icon: '⇒',
    color: 'purple',
    order: 3,
    prerequisites: ['arrays', 'recursion'],
    nextTopics: ['stacks-queues'],
    estimatedHours: 5,
    definition: 'A linked list is a linear data structure where elements (nodes) are stored at non-contiguous memory locations. Each node contains data and a reference (pointer) to the next node in the sequence.',
    analogy: 'Imagine a treasure hunt where each clue tells you the location of the next clue. You must follow the chain from the start — you cannot jump directly to clue #5 without following clues 1 through 4. That sequential dependency is exactly how a linked list works.',
    whyUseIt: 'Linked lists excel at O(1) insertion and deletion when you have a reference to the position. Unlike arrays, they don\'t require contiguous memory or pre-allocation. They form the backbone of stacks, queues, graphs (adjacency lists), and hash table collision resolution.',
    timeComplexity: [
      { operation: 'Access', best: 'O(1)', average: 'O(n)', worst: 'O(n)' },
      { operation: 'Search', best: 'O(1)', average: 'O(n)', worst: 'O(n)' },
      { operation: 'Insert (head)', best: 'O(1)', average: 'O(1)', worst: 'O(1)' },
      { operation: 'Insert (tail)', best: 'O(1)*', average: 'O(n)', worst: 'O(n)' },
      { operation: 'Delete (head)', best: 'O(1)', average: 'O(1)', worst: 'O(1)' },
    ],
    spaceComplexity: 'O(n) — each node stores data + pointer overhead',
    codeExamples: {
      python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

# Reverse a linked list — O(n) time, O(1) space
def reverse_list(head):
    prev, curr = None, head
    while curr:
        next_node = curr.next
        curr.next = prev
        prev = curr
        curr = next_node
    return prev

# Detect cycle — Floyd's algorithm
def has_cycle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            return True
    return False

# Find middle node — slow/fast pointer
def find_middle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    return slow`,
      java: `public class ListNode {
    int val;
    ListNode next;
    ListNode(int val) { this.val = val; }
}

public class LinkedListSolutions {
    // Reverse linked list
    public ListNode reverseList(ListNode head) {
        ListNode prev = null, curr = head;
        while (curr != null) {
            ListNode nextNode = curr.next;
            curr.next = prev;
            prev = curr;
            curr = nextNode;
        }
        return prev;
    }

    // Detect cycle — Floyd's tortoise and hare
    public boolean hasCycle(ListNode head) {
        ListNode slow = head, fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
            if (slow == fast) return true;
        }
        return false;
    }
}`,
      cpp: `struct ListNode {
    int val;
    ListNode* next;
    ListNode(int x) : val(x), next(nullptr) {}
};

// Reverse linked list
ListNode* reverseList(ListNode* head) {
    ListNode* prev = nullptr;
    ListNode* curr = head;
    while (curr) {
        ListNode* nextNode = curr->next;
        curr->next = prev;
        prev = curr;
        curr = nextNode;
    }
    return prev;
}

// Detect cycle
bool hasCycle(ListNode* head) {
    ListNode* slow = head;
    ListNode* fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
        if (slow == fast) return true;
    }
    return false;
}`
    },
    problems: [
      {
        id: 'reverse-linked-list',
        title: 'Reverse Linked List',
        difficulty: 'easy',
        description: 'Given the head of a singly linked list, reverse the list, and return the reversed list.',
        examples: [
          { input: 'head = [1,2,3,4,5]', output: '[5,4,3,2,1]' },
          { input: 'head = [1,2]', output: '[2,1]' },
        ],
        constraints: ['0 <= number of nodes <= 5000', '-5000 <= Node.val <= 5000'],
        testCases: [
          { input: '[1,2,3,4,5]', expectedOutput: '[5,4,3,2,1]' },
          { input: '[1,2]', expectedOutput: '[2,1]' },
        ],
        starterCode: {
          python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reverse_list(head):
    # Your solution here
    pass`,
          java: `public ListNode reverseList(ListNode head) {
    // Your solution
    return head;
}`,
          cpp: `ListNode* reverseList(ListNode* head) {
    // Your solution
    return head;
}`,
        }
      },
      {
        id: 'detect-cycle',
        title: 'Linked List Cycle',
        difficulty: 'medium',
        description: 'Given head of a linked list, determine if the linked list has a cycle. Return true if there is a cycle, false otherwise.',
        examples: [
          { input: 'head = [3,2,0,-4], pos = 1', output: 'true', explanation: 'Tail connects to node at index 1' },
          { input: 'head = [1,2], pos = 0', output: 'true' },
          { input: 'head = [1], pos = -1', output: 'false' },
        ],
        constraints: ['The number of nodes in the list is in the range [0, 10^4]'],
        testCases: [
          { input: 'cycle_at_1', expectedOutput: 'true' },
          { input: 'no_cycle', expectedOutput: 'false' },
        ],
        starterCode: {
          python: `def has_cycle(head) -> bool:
    # Use Floyd's tortoise and hare algorithm
    pass`,
          java: `public boolean hasCycle(ListNode head) {
    return false;
}`,
          cpp: `bool hasCycle(ListNode *head) {
    return false;
}`,
        }
      },
      {
        id: 'merge-k-lists',
        title: 'Merge K Sorted Lists',
        difficulty: 'hard',
        description: 'You are given an array of k linked-lists, each sorted in ascending order. Merge all the linked-lists into one sorted linked-list.',
        examples: [
          { input: 'lists = [[1,4,5],[1,3,4],[2,6]]', output: '[1,1,2,3,4,4,5,6]' },
          { input: 'lists = []', output: '[]' },
        ],
        constraints: ['k == lists.length', '0 <= k <= 10^4', '0 <= lists[i].length <= 500'],
        testCases: [
          { input: '[[1,4,5],[1,3,4],[2,6]]', expectedOutput: '[1,1,2,3,4,4,5,6]' },
          { input: '[]', expectedOutput: '[]' },
        ],
        starterCode: {
          python: `import heapq
def merge_k_lists(lists):
    # Hint: use a min-heap for efficiency
    pass`,
          java: `public ListNode mergeKLists(ListNode[] lists) {
    return null;
}`,
          cpp: `ListNode* mergeKLists(vector<ListNode*>& lists) {
    return nullptr;
}`,
        }
      }
    ]
  },
  {
    id: 'stacks-queues',
    title: 'Stacks & Queues',
    icon: '⚡',
    color: 'amber',
    order: 4,
    prerequisites: ['linked-lists'],
    nextTopics: ['trees'],
    estimatedHours: 4,
    definition: 'A Stack is a LIFO (Last In, First Out) data structure. A Queue is FIFO (First In, First Out). Both restrict where elements can be inserted and removed, giving them unique algorithmic properties.',
    analogy: 'A stack is like a stack of plates — you always add and remove from the top. A queue is like a line at a coffee shop — first person in line is first to be served.',
    whyUseIt: 'Stacks power function call stacks, undo/redo operations, expression evaluation, and DFS graph traversal. Queues power BFS, task scheduling, and producer-consumer systems. Monotonic stacks solve "next greater element" problems in O(n).',
    timeComplexity: [
      { operation: 'Push/Enqueue', best: 'O(1)', average: 'O(1)', worst: 'O(1)' },
      { operation: 'Pop/Dequeue', best: 'O(1)', average: 'O(1)', worst: 'O(1)' },
      { operation: 'Peek/Front', best: 'O(1)', average: 'O(1)', worst: 'O(1)' },
      { operation: 'Search', best: 'O(n)', average: 'O(n)', worst: 'O(n)' },
    ],
    spaceComplexity: 'O(n) — stores n elements',
    codeExamples: {
      python: `from collections import deque

# Stack using list
stack = []
stack.append(1)   # push
stack.append(2)
top = stack.pop() # pop — returns 2

# Queue using deque (efficient)
queue = deque()
queue.append(1)      # enqueue
queue.append(2)
front = queue.popleft()  # dequeue — returns 1

# Classic stack problem: Valid Parentheses
def is_valid(s: str) -> bool:
    stack = []
    mapping = {')': '(', '}': '{', ']': '['}
    for char in s:
        if char in mapping:
            top = stack.pop() if stack else '#'
            if mapping[char] != top:
                return False
        else:
            stack.append(char)
    return not stack

print(is_valid("()[]{}"))  # True
print(is_valid("(]"))      # False

# Monotonic stack: Next Greater Element
def next_greater(nums):
    result = [-1] * len(nums)
    stack = []  # stores indices
    for i, num in enumerate(nums):
        while stack and nums[stack[-1]] < num:
            result[stack.pop()] = num
        stack.append(i)
    return result`,
      java: `import java.util.*;

public class StackQueueDemo {
    // Valid parentheses using stack
    public boolean isValid(String s) {
        Deque<Character> stack = new ArrayDeque<>();
        for (char c : s.toCharArray()) {
            if (c == '(' || c == '[' || c == '{') {
                stack.push(c);
            } else {
                if (stack.isEmpty()) return false;
                char top = stack.pop();
                if ((c == ')' && top != '(') ||
                    (c == ']' && top != '[') ||
                    (c == '}' && top != '{')) return false;
            }
        }
        return stack.isEmpty();
    }

    // BFS using queue
    public void bfs(int start, List<List<Integer>> graph) {
        Queue<Integer> queue = new LinkedList<>();
        Set<Integer> visited = new HashSet<>();
        queue.offer(start);
        visited.add(start);
        while (!queue.isEmpty()) {
            int node = queue.poll();
            for (int neighbor : graph.get(node)) {
                if (!visited.contains(neighbor)) {
                    visited.add(neighbor);
                    queue.offer(neighbor);
                }
            }
        }
    }
}`,
      cpp: `#include <bits/stdc++.h>
using namespace std;

// Valid parentheses
bool isValid(string s) {
    stack<char> st;
    for (char c : s) {
        if (c == '(' || c == '[' || c == '{') {
            st.push(c);
        } else {
            if (st.empty()) return false;
            char top = st.top(); st.pop();
            if ((c == ')' && top != '(') ||
                (c == ']' && top != '[') ||
                (c == '}' && top != '{')) return false;
        }
    }
    return st.empty();
}

// Next greater element using monotonic stack
vector<int> nextGreater(vector<int>& nums) {
    int n = nums.size();
    vector<int> result(n, -1);
    stack<int> st;
    for (int i = 0; i < n; i++) {
        while (!st.empty() && nums[st.top()] < nums[i]) {
            result[st.top()] = nums[i];
            st.pop();
        }
        st.push(i);
    }
    return result;
}`
    },
    problems: [
      {
        id: 'valid-parentheses',
        title: 'Valid Parentheses',
        difficulty: 'easy',
        description: 'Given a string s containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid.',
        examples: [
          { input: 's = "()"', output: 'true' },
          { input: 's = "()[]{}"', output: 'true' },
          { input: 's = "(]"', output: 'false' },
        ],
        constraints: ['1 <= s.length <= 10^4', 's consists of parentheses only'],
        testCases: [
          { input: '()', expectedOutput: 'true' },
          { input: '()[]{} ', expectedOutput: 'true' },
          { input: '(]', expectedOutput: 'false' },
        ],
        starterCode: {
          python: `def is_valid(s: str) -> bool:
    # Your solution here
    pass
s = input()
print(is_valid(s))`,
          java: `public boolean isValid(String s) { return false; }`,
          cpp: `bool isValid(string s) { return false; }`,
        }
      },
      {
        id: 'min-stack',
        title: 'Min Stack',
        difficulty: 'medium',
        description: 'Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.',
        examples: [
          { input: 'MinStack minStack = new MinStack(); minStack.push(-2); minStack.push(0); minStack.push(-3); minStack.getMin(); minStack.pop(); minStack.top(); minStack.getMin();', output: '-3\n0\n-2' },
        ],
        constraints: ['-2^31 <= val <= 2^31 - 1', 'Methods will always be called on non-empty stack for pop/top/getMin'],
        testCases: [
          { input: 'push(-2),push(0),push(-3),getMin,pop,top,getMin', expectedOutput: '-3\n0\n-2' },
        ],
        starterCode: {
          python: `class MinStack:
    def __init__(self):
        pass
    def push(self, val: int) -> None:
        pass
    def pop(self) -> None:
        pass
    def top(self) -> int:
        pass
    def get_min(self) -> int:
        pass`,
          java: `class MinStack {
    public void push(int val) {}
    public void pop() {}
    public int top() { return 0; }
    public int getMin() { return 0; }
}`,
          cpp: `class MinStack {
public:
    void push(int val) {}
    void pop() {}
    int top() { return 0; }
    int getMin() { return 0; }
};`,
        }
      },
      {
        id: 'largest-rectangle',
        title: 'Largest Rectangle in Histogram',
        difficulty: 'hard',
        description: 'Given an array of integers heights representing the histogram\'s bar height where the width of each bar is 1, return the area of the largest rectangle in the histogram.',
        examples: [
          { input: 'heights = [2,1,5,6,2,3]', output: '10', explanation: 'The rectangle is formed by bars of height 5 and 6' },
          { input: 'heights = [2,4]', output: '4' },
        ],
        constraints: ['1 <= heights.length <= 10^5', '0 <= heights[i] <= 10^4'],
        testCases: [
          { input: '[2,1,5,6,2,3]', expectedOutput: '10' },
          { input: '[2,4]', expectedOutput: '4' },
        ],
        starterCode: {
          python: `def largest_rectangle(heights: list[int]) -> int:
    # Hint: use a monotonic stack
    pass
import sys
heights = list(map(int, sys.stdin.read().strip().strip('[]').split(',')))
print(largest_rectangle(heights))`,
          java: `public int largestRectangleArea(int[] heights) { return 0; }`,
          cpp: `int largestRectangleArea(vector<int>& heights) { return 0; }`,
        }
      }
    ]
  },
  {
    id: 'trees',
    title: 'Trees',
    icon: '🌳',
    color: 'green',
    order: 5,
    prerequisites: ['recursion', 'stacks-queues'],
    nextTopics: ['graphs'],
    estimatedHours: 8,
    definition: 'A tree is a hierarchical data structure consisting of nodes connected by edges, with no cycles. A binary tree has each node with at most 2 children (left and right). A Binary Search Tree (BST) has the property: left < root < right.',
    analogy: 'A tree is like a company org chart. The CEO is the root, managers are internal nodes, and individual contributors are leaves. You navigate it from the top down, and certain operations (finding your reporting chain) require traversing from root to leaf.',
    whyUseIt: 'Trees power filesystems, XML/HTML parsing (DOM), database indexes (B-trees), autocomplete (Tries), and compression (Huffman). BSTs give O(log n) search/insert/delete when balanced. Every interview has tree questions — master traversals, BST properties, and DFS/BFS.',
    timeComplexity: [
      { operation: 'Access (BST)', best: 'O(log n)', average: 'O(log n)', worst: 'O(n)' },
      { operation: 'Search (BST)', best: 'O(log n)', average: 'O(log n)', worst: 'O(n)' },
      { operation: 'Insert (BST)', best: 'O(log n)', average: 'O(log n)', worst: 'O(n)' },
      { operation: 'Delete (BST)', best: 'O(log n)', average: 'O(log n)', worst: 'O(n)' },
      { operation: 'Traversal', best: 'O(n)', average: 'O(n)', worst: 'O(n)' },
    ],
    spaceComplexity: 'O(n) for storage; O(h) for recursion where h = height',
    codeExamples: {
      python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

# Inorder traversal (Left, Root, Right) — gives sorted order for BST
def inorder(root):
    if not root:
        return []
    return inorder(root.left) + [root.val] + inorder(root.right)

# Level order traversal (BFS)
from collections import deque
def level_order(root):
    if not root:
        return []
    result, queue = [], deque([root])
    while queue:
        level = []
        for _ in range(len(queue)):
            node = queue.popleft()
            level.append(node.val)
            if node.left: queue.append(node.left)
            if node.right: queue.append(node.right)
        result.append(level)
    return result

# Max depth
def max_depth(root):
    if not root:
        return 0
    return 1 + max(max_depth(root.left), max_depth(root.right))

# Check if BST is valid
def is_valid_bst(root, min_val=float('-inf'), max_val=float('inf')):
    if not root:
        return True
    if root.val <= min_val or root.val >= max_val:
        return False
    return (is_valid_bst(root.left, min_val, root.val) and
            is_valid_bst(root.right, root.val, max_val))`,
      java: `public class TreeSolutions {
    // Inorder traversal
    public List<Integer> inorderTraversal(TreeNode root) {
        List<Integer> result = new ArrayList<>();
        inorder(root, result);
        return result;
    }
    private void inorder(TreeNode node, List<Integer> result) {
        if (node == null) return;
        inorder(node.left, result);
        result.add(node.val);
        inorder(node.right, result);
    }

    // Max depth
    public int maxDepth(TreeNode root) {
        if (root == null) return 0;
        return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
    }

    // Level order BFS
    public List<List<Integer>> levelOrder(TreeNode root) {
        List<List<Integer>> result = new ArrayList<>();
        if (root == null) return result;
        Queue<TreeNode> queue = new LinkedList<>();
        queue.offer(root);
        while (!queue.isEmpty()) {
            int size = queue.size();
            List<Integer> level = new ArrayList<>();
            for (int i = 0; i < size; i++) {
                TreeNode node = queue.poll();
                level.add(node.val);
                if (node.left != null) queue.offer(node.left);
                if (node.right != null) queue.offer(node.right);
            }
            result.add(level);
        }
        return result;
    }
}`,
      cpp: `struct TreeNode {
    int val;
    TreeNode* left, *right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

// Inorder traversal
void inorder(TreeNode* root, vector<int>& result) {
    if (!root) return;
    inorder(root->left, result);
    result.push_back(root->val);
    inorder(root->right, result);
}

// Max depth
int maxDepth(TreeNode* root) {
    if (!root) return 0;
    return 1 + max(maxDepth(root->left), maxDepth(root->right));
}

// Check valid BST
bool isValidBST(TreeNode* root, long long minVal = LLONG_MIN, long long maxVal = LLONG_MAX) {
    if (!root) return true;
    if (root->val <= minVal || root->val >= maxVal) return false;
    return isValidBST(root->left, minVal, root->val) &&
           isValidBST(root->right, root->val, maxVal);
}`
    },
    problems: [
      {
        id: 'max-depth',
        title: 'Maximum Depth of Binary Tree',
        difficulty: 'easy',
        description: 'Given the root of a binary tree, return its maximum depth.',
        examples: [
          { input: 'root = [3,9,20,null,null,15,7]', output: '3' },
          { input: 'root = [1,null,2]', output: '2' },
        ],
        constraints: ['The number of nodes in the tree is in the range [0, 10^4]'],
        testCases: [
          { input: '[3,9,20,null,null,15,7]', expectedOutput: '3' },
          { input: '[1,null,2]', expectedOutput: '2' },
        ],
        starterCode: {
          python: `def max_depth(root) -> int:
    # Your solution here
    pass`,
          java: `public int maxDepth(TreeNode root) { return 0; }`,
          cpp: `int maxDepth(TreeNode* root) { return 0; }`,
        }
      },
      {
        id: 'lca-bst',
        title: 'Lowest Common Ancestor of BST',
        difficulty: 'medium',
        description: 'Given a binary search tree (BST), find the lowest common ancestor (LCA) node of two given nodes p and q.',
        examples: [
          { input: 'root = [6,2,8,0,4,7,9], p = 2, q = 8', output: '6' },
          { input: 'root = [6,2,8,0,4,7,9], p = 2, q = 4', output: '2' },
        ],
        constraints: ['The number of nodes is in [2, 10^5]'],
        testCases: [
          { input: '[6,2,8,0,4,7,9]\n2\n8', expectedOutput: '6' },
          { input: '[6,2,8,0,4,7,9]\n2\n4', expectedOutput: '2' },
        ],
        starterCode: {
          python: `def lca(root, p, q):
    # Use BST property: if both p,q < root.val, go left; if both >, go right
    pass`,
          java: `public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) { return null; }`,
          cpp: `TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) { return nullptr; }`,
        }
      },
      {
        id: 'serialize-deserialize',
        title: 'Serialize and Deserialize Binary Tree',
        difficulty: 'hard',
        description: 'Implement serialization and deserialization of a binary tree. Serialization converts tree to a string; deserialization restores it.',
        examples: [
          { input: 'root = [1,2,3,null,null,4,5]', output: '[1,2,3,null,null,4,5]' },
        ],
        constraints: ['The number of nodes is in [0, 10^4]', '-1000 <= Node.val <= 1000'],
        testCases: [
          { input: '[1,2,3,null,null,4,5]', expectedOutput: '[1,2,3,null,null,4,5]' },
        ],
        starterCode: {
          python: `class Codec:
    def serialize(self, root) -> str:
        pass
    def deserialize(self, data: str):
        pass`,
          java: `public class Codec {
    public String serialize(TreeNode root) { return ""; }
    public TreeNode deserialize(String data) { return null; }
}`,
          cpp: `string serialize(TreeNode* root) { return ""; }
TreeNode* deserialize(string data) { return nullptr; }`,
        }
      }
    ]
  },
  {
    id: 'graphs',
    title: 'Graphs',
    icon: '◉',
    color: 'purple',
    order: 6,
    prerequisites: ['trees', 'stacks-queues'],
    nextTopics: ['dynamic-programming'],
    estimatedHours: 10,
    definition: 'A graph is a non-linear data structure consisting of vertices (nodes) and edges connecting them. Graphs can be directed or undirected, weighted or unweighted, cyclic or acyclic.',
    analogy: 'Think of a city road map. Cities are vertices, roads are edges. Finding the shortest route between two cities (GPS navigation) is exactly Dijkstra\'s algorithm. Social networks, the internet, and airline routes are all graphs.',
    whyUseIt: 'Graphs model real-world networks: social graphs, road networks, web crawlers, dependency resolution, and circuit analysis. Knowing BFS/DFS, Dijkstra, topological sort, and union-find makes you capable of solving a huge class of real-world problems.',
    timeComplexity: [
      { operation: 'BFS / DFS', best: 'O(V+E)', average: 'O(V+E)', worst: 'O(V+E)' },
      { operation: 'Dijkstra (heap)', best: 'O(E log V)', average: 'O(E log V)', worst: 'O(E log V)' },
      { operation: 'Bellman-Ford', best: 'O(VE)', average: 'O(VE)', worst: 'O(VE)' },
      { operation: 'Topological Sort', best: 'O(V+E)', average: 'O(V+E)', worst: 'O(V+E)' },
    ],
    spaceComplexity: 'O(V+E) for adjacency list representation',
    codeExamples: {
      python: `from collections import deque, defaultdict

# BFS — shortest path in unweighted graph
def bfs(graph, start, end):
    queue = deque([(start, [start])])
    visited = {start}
    while queue:
        node, path = queue.popleft()
        if node == end:
            return path
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append((neighbor, path + [neighbor]))
    return None

# DFS — detect cycle in directed graph
def has_cycle(graph, n):
    WHITE, GRAY, BLACK = 0, 1, 2
    color = [WHITE] * n

    def dfs(node):
        color[node] = GRAY
        for neighbor in graph[node]:
            if color[neighbor] == GRAY:
                return True
            if color[neighbor] == WHITE and dfs(neighbor):
                return True
        color[node] = BLACK
        return False

    return any(dfs(i) for i in range(n) if color[i] == WHITE)

# Topological sort (Kahn's algorithm)
def topo_sort(n, edges):
    graph = defaultdict(list)
    in_degree = [0] * n
    for u, v in edges:
        graph[u].append(v)
        in_degree[v] += 1
    queue = deque([i for i in range(n) if in_degree[i] == 0])
    result = []
    while queue:
        node = queue.popleft()
        result.append(node)
        for neighbor in graph[node]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)
    return result if len(result) == n else []`,
      java: `import java.util.*;

public class GraphSolutions {
    // BFS for shortest path
    public int shortestPath(int[][] graph, int start, int end) {
        Queue<int[]> queue = new LinkedList<>();
        Set<Integer> visited = new HashSet<>();
        queue.offer(new int[]{start, 0});
        visited.add(start);
        while (!queue.isEmpty()) {
            int[] curr = queue.poll();
            int node = curr[0], dist = curr[1];
            if (node == end) return dist;
            for (int neighbor : graph[node]) {
                if (!visited.contains(neighbor)) {
                    visited.add(neighbor);
                    queue.offer(new int[]{neighbor, dist + 1});
                }
            }
        }
        return -1;
    }

    // Union-Find for connected components
    int[] parent, rank;
    void init(int n) {
        parent = new int[n]; rank = new int[n];
        for (int i = 0; i < n; i++) parent[i] = i;
    }
    int find(int x) {
        if (parent[x] != x) parent[x] = find(parent[x]);
        return parent[x];
    }
    void union(int x, int y) {
        int px = find(x), py = find(y);
        if (rank[px] < rank[py]) parent[px] = py;
        else if (rank[px] > rank[py]) parent[py] = px;
        else { parent[py] = px; rank[px]++; }
    }
}`,
      cpp: `#include <bits/stdc++.h>
using namespace std;

// BFS
int shortestPath(vector<vector<int>>& graph, int start, int end) {
    queue<pair<int,int>> q;
    set<int> visited;
    q.push({start, 0});
    visited.insert(start);
    while (!q.empty()) {
        auto [node, dist] = q.front(); q.pop();
        if (node == end) return dist;
        for (int neighbor : graph[node]) {
            if (!visited.count(neighbor)) {
                visited.insert(neighbor);
                q.push({neighbor, dist + 1});
            }
        }
    }
    return -1;
}

// Union-Find
struct UnionFind {
    vector<int> parent, rank_;
    UnionFind(int n) : parent(n), rank_(n, 0) {
        iota(parent.begin(), parent.end(), 0);
    }
    int find(int x) {
        if (parent[x] != x) parent[x] = find(parent[x]);
        return parent[x];
    }
    void unite(int x, int y) {
        int px = find(x), py = find(y);
        if (px == py) return;
        if (rank_[px] < rank_[py]) swap(px, py);
        parent[py] = px;
        if (rank_[px] == rank_[py]) rank_[px]++;
    }
};`
    },
    problems: [
      {
        id: 'number-of-islands',
        title: 'Number of Islands',
        difficulty: 'easy',
        description: 'Given an m x n 2D binary grid, return the number of islands. An island is surrounded by water and formed by connecting adjacent lands horizontally or vertically.',
        examples: [
          { input: 'grid = [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]', output: '1' },
          { input: 'grid = [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]', output: '3' },
        ],
        constraints: ['m == grid.length', 'n == grid[i].length', '1 <= m, n <= 300'],
        testCases: [
          { input: '[["1","1","1"],["0","1","0"],["1","1","1"]]', expectedOutput: '1' },
          { input: '[["1","0"],["0","1"]]', expectedOutput: '2' },
        ],
        starterCode: {
          python: `def num_islands(grid: list[list[str]]) -> int:
    # Use DFS or BFS to mark visited cells
    pass`,
          java: `public int numIslands(char[][] grid) { return 0; }`,
          cpp: `int numIslands(vector<vector<char>>& grid) { return 0; }`,
        }
      },
      {
        id: 'course-schedule',
        title: 'Course Schedule',
        difficulty: 'medium',
        description: 'There are numCourses courses to take labeled 0 to numCourses-1. Given prerequisites pairs, determine if you can finish all courses (detect cycle in DAG).',
        examples: [
          { input: 'numCourses = 2, prerequisites = [[1,0]]', output: 'true' },
          { input: 'numCourses = 2, prerequisites = [[1,0],[0,1]]', output: 'false' },
        ],
        constraints: ['1 <= numCourses <= 2000', '0 <= prerequisites.length <= 5000'],
        testCases: [
          { input: '2\n[[1,0]]', expectedOutput: 'true' },
          { input: '2\n[[1,0],[0,1]]', expectedOutput: 'false' },
        ],
        starterCode: {
          python: `def can_finish(num_courses: int, prerequisites: list[list[int]]) -> bool:
    # Detect cycle using DFS or Kahn's topological sort
    pass`,
          java: `public boolean canFinish(int numCourses, int[][] prerequisites) { return false; }`,
          cpp: `bool canFinish(int numCourses, vector<vector<int>>& prerequisites) { return false; }`,
        }
      },
      {
        id: 'word-ladder',
        title: 'Word Ladder',
        difficulty: 'hard',
        description: 'Given beginWord, endWord, and a wordList, return the number of words in the shortest transformation sequence from beginWord to endWord (changing one letter at a time).',
        examples: [
          { input: 'beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]', output: '5' },
          { input: 'beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log"]', output: '0' },
        ],
        constraints: ['1 <= beginWord.length <= 10', 'endWord.length == beginWord.length'],
        testCases: [
          { input: 'hit\ncog\n["hot","dot","dog","lot","log","cog"]', expectedOutput: '5' },
          { input: 'hit\ncog\n["hot","dot","dog","lot","log"]', expectedOutput: '0' },
        ],
        starterCode: {
          python: `from collections import deque
def word_ladder(begin_word: str, end_word: str, word_list: list[str]) -> int:
    # BFS with character substitution at each position
    pass`,
          java: `public int ladderLength(String beginWord, String endWord, List<String> wordList) { return 0; }`,
          cpp: `int ladderLength(string beginWord, string endWord, vector<string>& wordList) { return 0; }`,
        }
      }
    ]
  },
  {
    id: 'dynamic-programming',
    title: 'Dynamic Programming',
    icon: '♟',
    color: 'cyan',
    order: 7,
    prerequisites: ['recursion', 'graphs'],
    nextTopics: [],
    estimatedHours: 12,
    definition: 'Dynamic Programming (DP) is an optimization technique that solves complex problems by breaking them into overlapping subproblems, storing solutions to avoid recomputation. It combines recursion with memoization (top-down) or builds solutions iteratively (bottom-up).',
    analogy: 'Imagine planning the cheapest route across a country with multiple cities. Instead of recalculating the cheapest path to every city from scratch each time, you save ("memoize") the cheapest path to each city as you discover it. Future calculations reuse saved results — that\'s DP.',
    whyUseIt: 'DP is the key to solving optimization and counting problems that would otherwise be exponential. Fibonacci, coin change, knapsack, edit distance, longest common subsequence, and matrix chain multiplication are all DP classics that appear in coding interviews at every tier of company.',
    timeComplexity: [
      { operation: 'Fibonacci (DP)', best: 'O(n)', average: 'O(n)', worst: 'O(n)' },
      { operation: 'Knapsack 0/1', best: 'O(n·W)', average: 'O(n·W)', worst: 'O(n·W)' },
      { operation: 'Longest CS', best: 'O(n·m)', average: 'O(n·m)', worst: 'O(n·m)' },
      { operation: 'Edit Distance', best: 'O(n·m)', average: 'O(n·m)', worst: 'O(n·m)' },
    ],
    spaceComplexity: 'O(n) to O(n·m) depending on problem; often optimizable to O(1) or O(n)',
    codeExamples: {
      python: `# Dynamic Programming patterns

# 1. Classic DP: Coin Change (Bottom-up tabulation)
def coin_change(coins: list[int], amount: int) -> int:
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    for i in range(1, amount + 1):
        for coin in coins:
            if coin <= i:
                dp[i] = min(dp[i], dp[i - coin] + 1)
    return dp[amount] if dp[amount] != float('inf') else -1

print(coin_change([1, 5, 11], 15))  # 3

# 2. Longest Common Subsequence
def lcs(s1: str, s2: str) -> int:
    m, n = len(s1), len(s2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if s1[i-1] == s2[j-1]:
                dp[i][j] = dp[i-1][j-1] + 1
            else:
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])
    return dp[m][n]

# 3. 0/1 Knapsack
def knapsack(weights, values, capacity):
    n = len(weights)
    dp = [[0] * (capacity + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        for w in range(capacity + 1):
            dp[i][w] = dp[i-1][w]  # don't take item i
            if weights[i-1] <= w:
                dp[i][w] = max(dp[i][w],
                               dp[i-1][w - weights[i-1]] + values[i-1])
    return dp[n][capacity]`,
      java: `public class DPSolutions {
    // Coin change — minimum coins
    public int coinChange(int[] coins, int amount) {
        int[] dp = new int[amount + 1];
        Arrays.fill(dp, amount + 1);
        dp[0] = 0;
        for (int i = 1; i <= amount; i++) {
            for (int coin : coins) {
                if (coin <= i) dp[i] = Math.min(dp[i], dp[i - coin] + 1);
            }
        }
        return dp[amount] > amount ? -1 : dp[amount];
    }

    // Longest Common Subsequence
    public int lcs(String s1, String s2) {
        int m = s1.length(), n = s2.length();
        int[][] dp = new int[m + 1][n + 1];
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (s1.charAt(i-1) == s2.charAt(j-1)) dp[i][j] = dp[i-1][j-1] + 1;
                else dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
            }
        }
        return dp[m][n];
    }
}`,
      cpp: `#include <bits/stdc++.h>
using namespace std;

// Coin change
int coinChange(vector<int>& coins, int amount) {
    vector<int> dp(amount + 1, INT_MAX);
    dp[0] = 0;
    for (int i = 1; i <= amount; i++) {
        for (int coin : coins) {
            if (coin <= i && dp[i - coin] != INT_MAX) {
                dp[i] = min(dp[i], dp[i - coin] + 1);
            }
        }
    }
    return dp[amount] == INT_MAX ? -1 : dp[amount];
}

// LCS
int lcs(string s1, string s2) {
    int m = s1.size(), n = s2.size();
    vector<vector<int>> dp(m+1, vector<int>(n+1, 0));
    for (int i = 1; i <= m; i++)
        for (int j = 1; j <= n; j++)
            dp[i][j] = (s1[i-1] == s2[j-1]) ? dp[i-1][j-1]+1 : max(dp[i-1][j], dp[i][j-1]);
    return dp[m][n];
}`
    },
    problems: [
      {
        id: 'climbing-stairs',
        title: 'Climbing Stairs',
        difficulty: 'easy',
        description: 'You are climbing a staircase with n steps. Each time you can climb 1 or 2 steps. In how many distinct ways can you reach the top?',
        examples: [
          { input: 'n = 2', output: '2', explanation: '1+1 or 2' },
          { input: 'n = 3', output: '3', explanation: '1+1+1, 1+2, 2+1' },
        ],
        constraints: ['1 <= n <= 45'],
        testCases: [
          { input: '2', expectedOutput: '2' },
          { input: '3', expectedOutput: '3' },
          { input: '10', expectedOutput: '89' },
        ],
        starterCode: {
          python: `def climb_stairs(n: int) -> int:
    # This is Fibonacci! dp[i] = dp[i-1] + dp[i-2]
    pass
n = int(input())
print(climb_stairs(n))`,
          java: `public int climbStairs(int n) { return 0; }`,
          cpp: `int climbStairs(int n) { return 0; }`,
        }
      },
      {
        id: 'coin-change',
        title: 'Coin Change',
        difficulty: 'medium',
        description: 'Given an array of coin denominations and an amount, return the fewest coins needed to make up that amount. Return -1 if not possible.',
        examples: [
          { input: 'coins = [1,5,11], amount = 15', output: '3', explanation: '11+3*1 or 5+5+5' },
          { input: 'coins = [2], amount = 3', output: '-1' },
        ],
        constraints: ['1 <= coins.length <= 12', '1 <= coins[i] <= 2^31-1', '0 <= amount <= 10^4'],
        testCases: [
          { input: '[1,5,11]\n15', expectedOutput: '3' },
          { input: '[2]\n3', expectedOutput: '-1' },
          { input: '[1]\n0', expectedOutput: '0' },
        ],
        starterCode: {
          python: `def coin_change(coins: list[int], amount: int) -> int:
    # Build dp table bottom-up
    pass

import sys
data = sys.stdin.read().split('\\n')
coins = list(map(int, data[0].strip('[]').split(',')))
amount = int(data[1])
print(coin_change(coins, amount))`,
          java: `public int coinChange(int[] coins, int amount) { return -1; }`,
          cpp: `int coinChange(vector<int>& coins, int amount) { return -1; }`,
        }
      },
      {
        id: 'edit-distance',
        title: 'Edit Distance',
        difficulty: 'hard',
        description: 'Given two strings word1 and word2, return the minimum number of operations (insert, delete, replace) to convert word1 to word2.',
        examples: [
          { input: 'word1 = "horse", word2 = "ros"', output: '3' },
          { input: 'word1 = "intention", word2 = "execution"', output: '5' },
        ],
        constraints: ['0 <= word1.length, word2.length <= 500', 'Words consist of lowercase English letters'],
        testCases: [
          { input: 'horse\nros', expectedOutput: '3' },
          { input: 'intention\nexecution', expectedOutput: '5' },
        ],
        starterCode: {
          python: `def min_distance(word1: str, word2: str) -> int:
    # 2D DP: dp[i][j] = edit distance between word1[:i] and word2[:j]
    pass

import sys
data = sys.stdin.read().strip().split('\\n')
print(min_distance(data[0], data[1]))`,
          java: `public int minDistance(String word1, String word2) { return 0; }`,
          cpp: `int minDistance(string word1, string word2) { return 0; }`,
        }
      }
    ]
  }
];

export const TOPIC_MAP = Object.fromEntries(TOPICS.map(t => [t.id, t]));

export const getTopicById = (id: string): TopicContent | undefined => TOPIC_MAP[id];

export const getDifficultyColor = (difficulty: Difficulty): string => {
  switch (difficulty) {
    case 'easy': return 'badge-easy';
    case 'medium': return 'badge-medium';
    case 'hard': return 'badge-hard';
  }
};

export const LANGUAGE_IDS: Record<Language, number> = {
  python: 71,   // Python 3
  java: 62,     // Java (OpenJDK 13)
  cpp: 54,      // C++ (GCC 9.2.0)
};

export const LANGUAGE_LABELS: Record<Language, string> = {
  python: 'Python 3',
  java: 'Java',
  cpp: 'C++',
};
