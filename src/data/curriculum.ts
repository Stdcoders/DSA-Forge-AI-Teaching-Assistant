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

export interface TheoryLevel {
  title: string;
  content: string;
  codeExample: Record<Language, string>;
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
  theoryLevels: {
    beginner: TheoryLevel;
    intermediate: TheoryLevel;
    advanced: TheoryLevel;
  };
  timeComplexity: { operation: string; best: string; average: string; worst: string }[];
  spaceComplexity: string;
  codeExamples: Record<Language, string>;
  problems: Problem[];
}

// Helper to make a minimal problem
function mkProblem(id: string, title: string, difficulty: Difficulty, desc: string): Problem {
  return {
    id, title, difficulty, description: desc,
    examples: [{ input: 'See description', output: 'See description' }],
    constraints: ['See description'],
    testCases: [{ input: 'sample', expectedOutput: 'sample' }],
    starterCode: {
      python: `# ${title}\n# Your solution here\npass`,
      java: `// ${title}\npublic class Solution {\n    // Your solution here\n}`,
      cpp: `// ${title}\n#include <bits/stdc++.h>\nusing namespace std;\n// Your solution here`,
    },
  };
}

export const TOPICS: TopicContent[] = [
  // ─── 1. Flowcharts ───
  {
    id: 'flowcharts',
    title: 'Flowcharts',
    icon: '📊',
    color: 'cyan',
    order: 1,
    prerequisites: [],
    nextTopics: [],
    estimatedHours: 2,
    definition: 'A flowchart is a visual diagram that represents a step-by-step process or algorithm using shapes like rectangles, diamonds, and arrows to show the flow of logic.',
    analogy: 'Think of a flowchart like a GPS giving you turn-by-turn directions — each step leads to the next, with decision points (turns) along the way.',
    whyUseIt: 'Flowcharts help you plan your code before writing it. They make complex logic visible, making it easier to spot errors, communicate ideas, and break problems into smaller steps.',
    theoryLevels: {
      beginner: {
        title: 'Understanding Flowcharts',
        content: 'Flowcharts use standard symbols:\n• Oval — Start/End\n• Rectangle — Process/Action\n• Diamond — Decision (Yes/No)\n• Arrows — Flow direction\n\nStart by drawing the start oval, then list each step as a rectangle. Use diamonds for if/else decisions.',
        codeExample: {
          python: `# Flowchart → Code: Check if a number is even or odd
num = int(input("Enter a number: "))
if num % 2 == 0:
    print("Even")
else:
    print("Odd")`,
          java: `import java.util.Scanner;
public class EvenOdd {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int num = sc.nextInt();
        if (num % 2 == 0) System.out.println("Even");
        else System.out.println("Odd");
    }
}`,
          cpp: `#include <iostream>
using namespace std;
int main() {
    int num;
    cin >> num;
    if (num % 2 == 0) cout << "Even";
    else cout << "Odd";
    return 0;
}`,
        },
      },
      intermediate: {
        title: 'Flowcharts with Loops',
        content: 'Loops in flowcharts are represented by arrows that loop back to a previous decision diamond. For example, a "while" loop has a diamond that checks the condition, processes inside, and arrows back to re-check.',
        codeExample: {
          python: `# Flowchart with loop: Sum of 1 to N
n = int(input("Enter N: "))
total = 0
i = 1
while i <= n:
    total += i
    i += 1
print("Sum:", total)`,
          java: `public class SumN {
    public static void main(String[] args) {
        int n = 10, total = 0;
        for (int i = 1; i <= n; i++) total += i;
        System.out.println("Sum: " + total);
    }
}`,
          cpp: `#include <iostream>
using namespace std;
int main() {
    int n = 10, total = 0;
    for (int i = 1; i <= n; i++) total += i;
    cout << "Sum: " << total;
    return 0;
}`,
        },
      },
      advanced: {
        title: 'Nested Decisions & Complex Flows',
        content: 'Real-world algorithms have nested decisions (if inside if) and multiple loops. Practice converting complex flowcharts into code with nested conditions, switch-case equivalents, and multi-path logic.',
        codeExample: {
          python: `# Complex flow: Grade calculator
score = int(input("Score: "))
if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
elif score >= 60:
    grade = "D"
else:
    grade = "F"
print(f"Grade: {grade}")`,
          java: `public class Grades {
    public static void main(String[] args) {
        int score = 85;
        String grade;
        if (score >= 90) grade = "A";
        else if (score >= 80) grade = "B";
        else if (score >= 70) grade = "C";
        else if (score >= 60) grade = "D";
        else grade = "F";
        System.out.println("Grade: " + grade);
    }
}`,
          cpp: `#include <iostream>
using namespace std;
int main() {
    int score = 85;
    string grade;
    if (score >= 90) grade = "A";
    else if (score >= 80) grade = "B";
    else if (score >= 70) grade = "C";
    else if (score >= 60) grade = "D";
    else grade = "F";
    cout << "Grade: " << grade;
    return 0;
}`,
        },
      },
    },
    timeComplexity: [{ operation: 'Drawing/Reading', best: 'N/A', average: 'N/A', worst: 'N/A' }],
    spaceComplexity: 'N/A',
    codeExamples: { python: '# See theory levels', java: '// See theory levels', cpp: '// See theory levels' },
    problems: [
      mkProblem('flowchart-even-odd', 'Even or Odd', 'easy', 'Write a program that checks if a number is even or odd.'),
      mkProblem('flowchart-largest-three', 'Largest of Three', 'easy', 'Find the largest of three numbers using if-else.'),
    ],
  },

  // ─── 2. Variables and Data Types ───
  {
    id: 'variables',
    title: 'Variables & Data Types',
    icon: '📦',
    color: 'purple',
    order: 2,
    prerequisites: [],
    nextTopics: [],
    estimatedHours: 2,
    definition: 'Variables are named containers that store data in memory. Data types define what kind of data a variable holds — integers, floats, strings, booleans, etc.',
    analogy: 'A variable is like a labeled box. The label is the variable name, and inside the box is the value. The data type tells you what kind of thing fits in the box.',
    whyUseIt: 'Every program needs variables to store and manipulate data. Understanding data types prevents bugs like adding a string to a number or losing precision with integers.',
    theoryLevels: {
      beginner: {
        title: 'Basic Variables',
        content: 'Variables store values. In Python, you just assign: x = 5. In Java/C++, you declare the type: int x = 5. Common types: int (whole numbers), float/double (decimals), string (text), bool (true/false).',
        codeExample: {
          python: `# Variables in Python
name = "Alice"      # string
age = 25            # int
height = 5.6        # float
is_student = True   # bool
print(f"{name} is {age} years old")`,
          java: `public class Variables {
    public static void main(String[] args) {
        String name = "Alice";
        int age = 25;
        double height = 5.6;
        boolean isStudent = true;
        System.out.println(name + " is " + age);
    }
}`,
          cpp: `#include <iostream>
#include <string>
using namespace std;
int main() {
    string name = "Alice";
    int age = 25;
    double height = 5.6;
    bool isStudent = true;
    cout << name << " is " << age;
    return 0;
}`,
        },
      },
      intermediate: {
        title: 'Type Conversion & Casting',
        content: 'Sometimes you need to convert between types. Implicit conversion happens automatically (int → float). Explicit casting is when you force it: int("42") in Python, (int)3.14 in C++. Be careful of data loss when converting float to int.',
        codeExample: {
          python: `# Type conversion
x = 10          # int
y = 3.14        # float
z = x + y       # implicit: int → float = 13.14
s = "42"
n = int(s)      # explicit: string → int
print(type(z), z)   # <class 'float'> 13.14`,
          java: `public class Casting {
    public static void main(String[] args) {
        int x = 10;
        double y = 3.14;
        double z = x + y;   // implicit
        String s = "42";
        int n = Integer.parseInt(s); // explicit
        System.out.println(z);
    }
}`,
          cpp: `#include <iostream>
#include <string>
using namespace std;
int main() {
    int x = 10;
    double y = 3.14;
    double z = x + y;       // implicit
    string s = "42";
    int n = stoi(s);         // explicit
    cout << z << endl;
    return 0;
}`,
        },
      },
      advanced: {
        title: 'Memory & Precision',
        content: 'Understand how data is stored in memory. int uses 4 bytes (32 bits), long uses 8 bytes. Floating point numbers have precision limits (0.1 + 0.2 ≠ 0.3 exactly). Overflow occurs when a value exceeds the type\'s range.',
        codeExample: {
          python: `# Precision issues
print(0.1 + 0.2)       # 0.30000000000000004
print(0.1 + 0.2 == 0.3) # False!

# Use decimal for precision
from decimal import Decimal
print(Decimal('0.1') + Decimal('0.2'))  # 0.3

# Python handles big integers natively
big = 2**100
print(big)  # No overflow!`,
          java: `import java.math.BigDecimal;
public class Precision {
    public static void main(String[] args) {
        System.out.println(0.1 + 0.2);  // 0.30000000000000004
        // Use BigDecimal for precision
        BigDecimal a = new BigDecimal("0.1");
        BigDecimal b = new BigDecimal("0.2");
        System.out.println(a.add(b));    // 0.3
        // Integer overflow
        int max = Integer.MAX_VALUE;
        System.out.println(max + 1);     // -2147483648 (overflow!)
    }
}`,
          cpp: `#include <iostream>
#include <climits>
using namespace std;
int main() {
    cout << (0.1 + 0.2) << endl;  // imprecise
    // Integer overflow
    int max = INT_MAX;
    cout << max << endl;
    cout << max + 1 << endl;  // undefined behavior!
    // Use long long for big numbers
    long long big = 1LL << 40;
    cout << big << endl;
    return 0;
}`,
        },
      },
    },
    timeComplexity: [{ operation: 'Assignment/Access', best: 'O(1)', average: 'O(1)', worst: 'O(1)' }],
    spaceComplexity: 'O(1) per variable',
    codeExamples: { python: '# See theory levels', java: '// See theory levels', cpp: '// See theory levels' },
    problems: [
      mkProblem('swap-two', 'Swap Two Variables', 'easy', 'Swap the values of two variables without using a third variable.'),
      mkProblem('temperature-convert', 'Temperature Converter', 'easy', 'Convert Celsius to Fahrenheit and vice versa.'),
    ],
  },

  // ─── 3. Operators ───
  {
    id: 'operators',
    title: 'Operators',
    icon: '➕',
    color: 'amber',
    order: 3,
    prerequisites: [], nextTopics: [], estimatedHours: 2,
    definition: 'Operators are symbols that perform operations on variables and values — arithmetic (+, -, *, /), comparison (==, !=, <, >), logical (and, or, not), assignment (=, +=), and bitwise (&, |, ^).',
    analogy: 'Operators are like the verbs in a sentence — they describe what action to perform on the data (nouns).',
    whyUseIt: 'Every calculation, comparison, and decision in code uses operators. Understanding operator precedence and short-circuit evaluation prevents subtle bugs.',
    theoryLevels: {
      beginner: {
        title: 'Arithmetic & Comparison',
        content: 'Arithmetic: + - * / % (modulo) ** (power)\nComparison: == != < > <= >= → returns True/False\nAssignment: = += -= *= /=',
        codeExample: {
          python: `a, b = 10, 3
print(a + b)   # 13
print(a / b)   # 3.333
print(a // b)  # 3 (floor division)
print(a % b)   # 1 (remainder)
print(a ** b)  # 1000 (power)
print(a > b)   # True`,
          java: `public class Ops {
    public static void main(String[] args) {
        int a = 10, b = 3;
        System.out.println(a + b);   // 13
        System.out.println(a / b);   // 3 (integer division)
        System.out.println(a % b);   // 1
        System.out.println(a > b);   // true
    }
}`,
          cpp: `#include <iostream>
#include <cmath>
using namespace std;
int main() {
    int a = 10, b = 3;
    cout << a + b << endl;   // 13
    cout << a / b << endl;   // 3
    cout << a % b << endl;   // 1
    cout << pow(a, b) << endl; // 1000
    return 0;
}`,
        },
      },
      intermediate: {
        title: 'Logical & Ternary Operators',
        content: 'Logical operators combine conditions: and (&&), or (||), not (!). Short-circuit: in "A and B", if A is False, B is never evaluated. Ternary operator: result = x if condition else y.',
        codeExample: {
          python: `x = 5
# Logical operators
print(x > 0 and x < 10)  # True
print(x > 0 or x > 100)  # True (short-circuits)

# Ternary
status = "even" if x % 2 == 0 else "odd"
print(status)  # odd`,
          java: `int x = 5;
System.out.println(x > 0 && x < 10);  // true
String status = (x % 2 == 0) ? "even" : "odd";
System.out.println(status);`,
          cpp: `int x = 5;
cout << (x > 0 && x < 10) << endl;  // 1 (true)
string status = (x % 2 == 0) ? "even" : "odd";
cout << status;`,
        },
      },
      advanced: {
        title: 'Bitwise Operators',
        content: 'Bitwise operators work on individual bits: & (AND), | (OR), ^ (XOR), ~ (NOT), << (left shift), >> (right shift). XOR is especially useful: a ^ a = 0, a ^ 0 = a. Used in competitive programming for efficiency.',
        codeExample: {
          python: `a, b = 5, 3  # 101, 011
print(a & b)   # 1  (001)
print(a | b)   # 7  (111)
print(a ^ b)   # 6  (110)
print(a << 1)  # 10 (1010)
print(a >> 1)  # 2  (10)

# XOR trick: swap without temp
a ^= b; b ^= a; a ^= b
print(a, b)  # 3, 5`,
          java: `int a = 5, b = 3;
System.out.println(a & b);  // 1
System.out.println(a | b);  // 7
System.out.println(a ^ b);  // 6
System.out.println(a << 1); // 10`,
          cpp: `int a = 5, b = 3;
cout << (a & b) << endl;  // 1
cout << (a | b) << endl;  // 7
cout << (a ^ b) << endl;  // 6
cout << (a << 1) << endl; // 10`,
        },
      },
    },
    timeComplexity: [{ operation: 'All operators', best: 'O(1)', average: 'O(1)', worst: 'O(1)' }],
    spaceComplexity: 'O(1)',
    codeExamples: { python: '# See theory levels', java: '// See theory levels', cpp: '// See theory levels' },
    problems: [
      mkProblem('check-power-of-two', 'Check Power of Two', 'easy', 'Check if a given number is a power of 2 using bitwise operators.'),
      mkProblem('xor-find-unique', 'Find Unique Number', 'medium', 'Given an array where every element appears twice except one, find the unique element using XOR.'),
    ],
  },

  // ─── 4. If-Else ───
  {
    id: 'if-else',
    title: 'If-Else Statements',
    icon: '🔀',
    color: 'green',
    order: 4,
    prerequisites: [], nextTopics: [], estimatedHours: 2,
    definition: 'Conditional statements (if, else if, else) allow your program to make decisions — execute different blocks of code based on whether conditions are true or false.',
    analogy: 'If-else is like a traffic signal: if green → go, else if yellow → slow down, else → stop.',
    whyUseIt: 'Every non-trivial program needs decisions. Login validation, game logic, data filtering — all rely on conditionals.',
    theoryLevels: {
      beginner: {
        title: 'Basic If-Else',
        content: 'The simplest form: if condition is true, do something; else, do something different. You can chain multiple conditions with elif (else if).',
        codeExample: {
          python: `age = 18
if age >= 18:
    print("You can vote!")
else:
    print("Too young to vote")`,
          java: `int age = 18;
if (age >= 18) {
    System.out.println("You can vote!");
} else {
    System.out.println("Too young to vote");
}`,
          cpp: `int age = 18;
if (age >= 18) {
    cout << "You can vote!";
} else {
    cout << "Too young to vote";
}`,
        },
      },
      intermediate: {
        title: 'Nested Conditions & Switch',
        content: 'Conditions can be nested (if inside if). For multiple exact-value checks, use switch/match statements for cleaner code.',
        codeExample: {
          python: `# Nested conditions
num = 15
if num > 0:
    if num % 2 == 0:
        print("Positive even")
    else:
        print("Positive odd")
else:
    print("Non-positive")

# Match statement (Python 3.10+)
match num % 3:
    case 0: print("Divisible by 3")
    case 1: print("Remainder 1")
    case _: print("Remainder 2")`,
          java: `int day = 3;
switch (day) {
    case 1: System.out.println("Monday"); break;
    case 2: System.out.println("Tuesday"); break;
    case 3: System.out.println("Wednesday"); break;
    default: System.out.println("Other");
}`,
          cpp: `int day = 3;
switch (day) {
    case 1: cout << "Monday"; break;
    case 2: cout << "Tuesday"; break;
    case 3: cout << "Wednesday"; break;
    default: cout << "Other";
}`,
        },
      },
      advanced: {
        title: 'Guard Clauses & Clean Conditionals',
        content: 'Avoid deep nesting with guard clauses (early returns). Combine conditions wisely. Use De Morgan\'s laws: not (A and B) = (not A) or (not B).',
        codeExample: {
          python: `# Guard clause pattern — clean and readable
def process_order(order):
    if not order:
        return "No order"
    if not order.get("paid"):
        return "Payment required"
    if order.get("cancelled"):
        return "Order cancelled"
    # Main logic — no nesting!
    return f"Processing order {order['id']}"`,
          java: `public String processOrder(Order order) {
    if (order == null) return "No order";
    if (!order.isPaid()) return "Payment required";
    if (order.isCancelled()) return "Order cancelled";
    return "Processing order " + order.getId();
}`,
          cpp: `string processOrder(Order* order) {
    if (!order) return "No order";
    if (!order->isPaid()) return "Payment required";
    if (order->isCancelled()) return "Order cancelled";
    return "Processing order " + order->getId();
}`,
        },
      },
    },
    timeComplexity: [{ operation: 'If-else check', best: 'O(1)', average: 'O(1)', worst: 'O(1)' }],
    spaceComplexity: 'O(1)',
    codeExamples: { python: '# See theory levels', java: '// See theory levels', cpp: '// See theory levels' },
    problems: [
      mkProblem('leap-year', 'Leap Year Check', 'easy', 'Determine if a given year is a leap year.'),
      mkProblem('triangle-type', 'Triangle Type', 'medium', 'Given three sides, determine if the triangle is equilateral, isosceles, or scalene.'),
    ],
  },

  // ─── 5. Flow Control (Loops) ───
  {
    id: 'loops',
    title: 'Flow Control (Loops)',
    icon: '🔄',
    color: 'cyan',
    order: 5,
    prerequisites: [], nextTopics: [], estimatedHours: 3,
    definition: 'Loops repeat a block of code multiple times. The three main types are: for (iterate a known number of times), while (iterate until a condition is false), and do-while (execute at least once).',
    analogy: 'A loop is like running laps around a track. You keep going until you\'ve completed the required number of laps (for) or until you\'re too tired (while).',
    whyUseIt: 'Loops eliminate repetitive code. Processing arrays, reading files, game loops, server request handling — all require iteration.',
    theoryLevels: {
      beginner: {
        title: 'For and While Loops',
        content: 'A for loop runs a fixed number of times. A while loop runs as long as a condition is true. Use "break" to exit early and "continue" to skip to the next iteration.',
        codeExample: {
          python: `# For loop
for i in range(5):
    print(i, end=" ")  # 0 1 2 3 4

# While loop
count = 0
while count < 5:
    print(count, end=" ")
    count += 1

# Break and continue
for i in range(10):
    if i == 3: continue  # skip 3
    if i == 7: break     # stop at 7
    print(i, end=" ")    # 0 1 2 4 5 6`,
          java: `for (int i = 0; i < 5; i++) {
    System.out.print(i + " ");
}
int count = 0;
while (count < 5) {
    System.out.print(count + " ");
    count++;
}`,
          cpp: `for (int i = 0; i < 5; i++) {
    cout << i << " ";
}
int count = 0;
while (count < 5) {
    cout << count << " ";
    count++;
}`,
        },
      },
      intermediate: {
        title: 'Nested Loops',
        content: 'A loop inside a loop. The inner loop completes all iterations for each iteration of the outer loop. Time complexity is typically O(n²) for doubly-nested loops.',
        codeExample: {
          python: `# Multiplication table
for i in range(1, 6):
    for j in range(1, 6):
        print(f"{i*j:3}", end=" ")
    print()

# Finding pairs
nums = [1, 2, 3, 4]
for i in range(len(nums)):
    for j in range(i+1, len(nums)):
        print(f"({nums[i]}, {nums[j]})")`,
          java: `for (int i = 1; i <= 5; i++) {
    for (int j = 1; j <= 5; j++) {
        System.out.printf("%3d ", i * j);
    }
    System.out.println();
}`,
          cpp: `for (int i = 1; i <= 5; i++) {
    for (int j = 1; j <= 5; j++) {
        cout << i * j << " ";
    }
    cout << endl;
}`,
        },
      },
      advanced: {
        title: 'Loop Optimization',
        content: 'Avoid unnecessary work inside loops. Move invariant computations outside. Use early termination. Consider whether two nested loops can be replaced with a single pass using techniques like two pointers or hash maps.',
        codeExample: {
          python: `# Bad: O(n²) — checking pairs
def has_pair_sum_slow(arr, target):
    for i in range(len(arr)):
        for j in range(i+1, len(arr)):
            if arr[i] + arr[j] == target:
                return True
    return False

# Good: O(n) — using a set
def has_pair_sum_fast(arr, target):
    seen = set()
    for num in arr:
        if target - num in seen:
            return True
        seen.add(num)
    return False`,
          java: `// O(n) with HashSet instead of O(n²) nested loops
public boolean hasPairSum(int[] arr, int target) {
    Set<Integer> seen = new HashSet<>();
    for (int num : arr) {
        if (seen.contains(target - num)) return true;
        seen.add(num);
    }
    return false;
}`,
          cpp: `bool hasPairSum(vector<int>& arr, int target) {
    unordered_set<int> seen;
    for (int num : arr) {
        if (seen.count(target - num)) return true;
        seen.insert(num);
    }
    return false;
}`,
        },
      },
    },
    timeComplexity: [
      { operation: 'Single loop', best: 'O(n)', average: 'O(n)', worst: 'O(n)' },
      { operation: 'Nested loop', best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)' },
    ],
    spaceComplexity: 'O(1) for simple loops',
    codeExamples: { python: '# See theory levels', java: '// See theory levels', cpp: '// See theory levels' },
    problems: [
      mkProblem('sum-digits', 'Sum of Digits', 'easy', 'Find the sum of digits of a given number.'),
      mkProblem('reverse-number', 'Reverse a Number', 'easy', 'Reverse the digits of an integer.'),
      mkProblem('prime-check', 'Prime Number Check', 'medium', 'Check if a given number is prime.'),
    ],
  },

  // ─── 6. Patterns ───
  {
    id: 'patterns',
    title: 'Patterns',
    icon: '🔺',
    color: 'purple',
    order: 6,
    prerequisites: [], nextTopics: [], estimatedHours: 3,
    definition: 'Pattern printing problems use nested loops to print shapes like triangles, pyramids, diamonds, and number/star patterns. They build loop mastery.',
    analogy: 'Pattern problems are like weaving — the outer loop handles rows and the inner loop handles columns, stitch by stitch.',
    whyUseIt: 'Pattern problems solidify understanding of nested loops, iteration control, and output formatting — essential skills for algorithmic thinking.',
    theoryLevels: {
      beginner: {
        title: 'Star Patterns',
        content: 'Start with simple right triangles. Outer loop = rows, inner loop = columns. Print stars (*) based on the row number.',
        codeExample: {
          python: `# Right triangle
n = 5
for i in range(1, n+1):
    print("* " * i)
# Output:
# *
# * *
# * * *
# * * * *
# * * * * *`,
          java: `int n = 5;
for (int i = 1; i <= n; i++) {
    for (int j = 1; j <= i; j++) {
        System.out.print("* ");
    }
    System.out.println();
}`,
          cpp: `int n = 5;
for (int i = 1; i <= n; i++) {
    for (int j = 1; j <= i; j++) cout << "* ";
    cout << endl;
}`,
        },
      },
      intermediate: {
        title: 'Number & Pyramid Patterns',
        content: 'Combine spaces and numbers. For pyramids, print (n-i) spaces then (2i-1) stars. For number patterns, print the row/column number.',
        codeExample: {
          python: `# Pyramid
n = 5
for i in range(1, n+1):
    spaces = " " * (n - i)
    stars = "* " * i
    print(spaces + stars)

# Number triangle
for i in range(1, 6):
    for j in range(1, i+1):
        print(j, end=" ")
    print()`,
          java: `// Pyramid
int n = 5;
for (int i = 1; i <= n; i++) {
    for (int s = 0; s < n-i; s++) System.out.print(" ");
    for (int j = 0; j < i; j++) System.out.print("* ");
    System.out.println();
}`,
          cpp: `int n = 5;
for (int i = 1; i <= n; i++) {
    for (int s = 0; s < n-i; s++) cout << " ";
    for (int j = 0; j < i; j++) cout << "* ";
    cout << endl;
}`,
        },
      },
      advanced: {
        title: 'Diamond & Complex Patterns',
        content: 'Diamonds combine an upward and downward pyramid. Advanced patterns include hollow shapes, Pascal\'s triangle, and butterfly patterns.',
        codeExample: {
          python: `# Diamond pattern
n = 5
# Upper half
for i in range(1, n+1):
    print(" " * (n-i) + "* " * i)
# Lower half
for i in range(n-1, 0, -1):
    print(" " * (n-i) + "* " * i)`,
          java: `int n = 5;
for (int i = 1; i <= n; i++) {
    for (int s = 0; s < n-i; s++) System.out.print(" ");
    for (int j = 0; j < i; j++) System.out.print("* ");
    System.out.println();
}
for (int i = n-1; i >= 1; i--) {
    for (int s = 0; s < n-i; s++) System.out.print(" ");
    for (int j = 0; j < i; j++) System.out.print("* ");
    System.out.println();
}`,
          cpp: `int n = 5;
for (int i = 1; i <= n; i++) {
    for (int s = 0; s < n-i; s++) cout << " ";
    for (int j = 0; j < i; j++) cout << "* ";
    cout << endl;
}
for (int i = n-1; i >= 1; i--) {
    for (int s = 0; s < n-i; s++) cout << " ";
    for (int j = 0; j < i; j++) cout << "* ";
    cout << endl;
}`,
        },
      },
    },
    timeComplexity: [{ operation: 'Pattern printing', best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)' }],
    spaceComplexity: 'O(1)',
    codeExamples: { python: '# See theory levels', java: '// See theory levels', cpp: '// See theory levels' },
    problems: [
      mkProblem('inverted-triangle', 'Inverted Triangle', 'easy', 'Print an inverted right triangle of stars.'),
      mkProblem('hollow-rectangle', 'Hollow Rectangle', 'medium', 'Print a hollow rectangle of stars.'),
    ],
  },

  // ─── 7. Functions and Methods ───
  {
    id: 'functions',
    title: 'Functions & Methods',
    icon: '⚙️',
    color: 'amber',
    order: 7,
    prerequisites: [], nextTopics: [], estimatedHours: 3,
    definition: 'Functions are reusable blocks of code that perform a specific task. They take inputs (parameters), process them, and return outputs. Methods are functions that belong to a class/object.',
    analogy: 'A function is like a vending machine — you put in money (arguments), press a button (call), and get a product (return value). You don\'t need to know the internal mechanics.',
    whyUseIt: 'Functions enable code reuse, abstraction, and modularity. They make programs easier to read, test, and maintain. DRY principle: Don\'t Repeat Yourself.',
    theoryLevels: {
      beginner: {
        title: 'Defining & Calling Functions',
        content: 'Define a function with def (Python) or return-type name() (Java/C++). Pass arguments, return values. Functions can have default parameters.',
        codeExample: {
          python: `def greet(name, greeting="Hello"):
    return f"{greeting}, {name}!"

print(greet("Alice"))           # Hello, Alice!
print(greet("Bob", "Hi"))       # Hi, Bob!

def add(a, b):
    return a + b

result = add(3, 5)
print(result)  # 8`,
          java: `public class Functions {
    static String greet(String name) {
        return "Hello, " + name + "!";
    }
    static int add(int a, int b) {
        return a + b;
    }
    public static void main(String[] args) {
        System.out.println(greet("Alice"));
        System.out.println(add(3, 5));
    }
}`,
          cpp: `#include <iostream>
#include <string>
using namespace std;
string greet(string name) {
    return "Hello, " + name + "!";
}
int add(int a, int b) { return a + b; }
int main() {
    cout << greet("Alice") << endl;
    cout << add(3, 5) << endl;
    return 0;
}`,
        },
      },
      intermediate: {
        title: 'Scope, Lambda & Higher-Order Functions',
        content: 'Variables inside a function are local. Lambda functions are anonymous one-liners. Higher-order functions take functions as arguments (map, filter, reduce).',
        codeExample: {
          python: `# Lambda
square = lambda x: x ** 2
print(square(5))  # 25

# Higher-order functions
nums = [1, 2, 3, 4, 5]
evens = list(filter(lambda x: x % 2 == 0, nums))
doubled = list(map(lambda x: x * 2, nums))
print(evens)    # [2, 4]
print(doubled)  # [2, 4, 6, 8, 10]

from functools import reduce
total = reduce(lambda a, b: a + b, nums)
print(total)  # 15`,
          java: `import java.util.*;
import java.util.stream.*;
List<Integer> nums = Arrays.asList(1, 2, 3, 4, 5);
List<Integer> evens = nums.stream()
    .filter(x -> x % 2 == 0)
    .collect(Collectors.toList());
List<Integer> doubled = nums.stream()
    .map(x -> x * 2)
    .collect(Collectors.toList());`,
          cpp: `#include <algorithm>
#include <vector>
vector<int> nums = {1, 2, 3, 4, 5};
// Lambda with auto
auto square = [](int x) { return x * x; };
cout << square(5); // 25
// Transform (map)
vector<int> doubled(nums.size());
transform(nums.begin(), nums.end(), doubled.begin(),
    [](int x) { return x * 2; });`,
        },
      },
      advanced: {
        title: 'Recursion vs Iteration & Closures',
        content: 'Functions can call themselves (recursion). Closures capture variables from their enclosing scope. Understand call stack depth and tail call optimization.',
        codeExample: {
          python: `# Closure — function that remembers its environment
def make_counter():
    count = 0
    def increment():
        nonlocal count
        count += 1
        return count
    return increment

counter = make_counter()
print(counter())  # 1
print(counter())  # 2
print(counter())  # 3

# Decorator pattern
def timer(func):
    import time
    def wrapper(*args):
        start = time.time()
        result = func(*args)
        print(f"{func.__name__} took {time.time()-start:.4f}s")
        return result
    return wrapper

@timer
def slow_add(a, b):
    import time; time.sleep(0.1)
    return a + b`,
          java: `// Java closures via functional interfaces
import java.util.function.*;
Function<Integer, Integer> square = x -> x * x;
System.out.println(square.apply(5)); // 25

// Method reference
List<String> names = Arrays.asList("alice", "bob");
names.forEach(System.out::println);`,
          cpp: `// C++ lambda with capture
int multiplier = 3;
auto multiply = [multiplier](int x) {
    return x * multiplier;
};
cout << multiply(5); // 15

// Mutable capture
int count = 0;
auto counter = [&count]() { return ++count; };
cout << counter(); // 1
cout << counter(); // 2`,
        },
      },
    },
    timeComplexity: [{ operation: 'Function call', best: 'O(1)', average: 'O(1)', worst: 'O(1)' }],
    spaceComplexity: 'O(1) per call + stack frame',
    codeExamples: { python: '# See theory levels', java: '// See theory levels', cpp: '// See theory levels' },
    problems: [
      mkProblem('factorial-func', 'Factorial Function', 'easy', 'Write a function that returns the factorial of n.'),
      mkProblem('palindrome-check', 'Palindrome Check', 'easy', 'Write a function to check if a string is a palindrome.'),
    ],
  },

  // ─── 8. Arrays ───
  {
    id: 'arrays',
    title: 'Arrays',
    icon: '▦',
    color: 'cyan',
    order: 8,
    prerequisites: [], nextTopics: [], estimatedHours: 4,
    definition: 'An array is a linear data structure that stores a fixed-size sequential collection of elements of the same type. Elements are stored in contiguous memory locations, allowing O(1) random access via index.',
    analogy: 'Think of an array like a row of numbered lockers in a school hallway. Each locker has a unique number (index), and you can instantly go to any locker if you know its number.',
    whyUseIt: 'Arrays are the foundation of almost every algorithm. They provide O(1) access by index, making them ideal for lookups, sorting, and two-pointer/sliding window techniques.',
    theoryLevels: {
      beginner: {
        title: 'Array Basics',
        content: 'Arrays store multiple values in a single variable. Access elements by index (0-based). Common operations: create, read, update, delete, iterate.',
        codeExample: {
          python: `arr = [1, 2, 3, 4, 5]
print(arr[0])    # 1 (first element)
print(arr[-1])   # 5 (last element)
arr.append(6)    # add to end
arr.insert(0, 0) # insert at index 0
print(len(arr))  # 7
# Iterate
for val in arr:
    print(val, end=" ")`,
          java: `int[] arr = {1, 2, 3, 4, 5};
System.out.println(arr[0]); // 1
System.out.println(arr.length); // 5
for (int val : arr) {
    System.out.print(val + " ");
}`,
          cpp: `#include <vector>
vector<int> arr = {1, 2, 3, 4, 5};
cout << arr[0]; // 1
arr.push_back(6);
for (int val : arr) cout << val << " ";`,
        },
      },
      intermediate: {
        title: 'Two-Pointer Technique',
        content: 'Use two pointers (left/right) to solve problems efficiently. Works great on sorted arrays. Common patterns: pair sum, reversing, partitioning.',
        codeExample: {
          python: `# Two-pointer: finding pair with target sum in sorted array
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
print(two_sum(sorted_arr, 9))  # [0, 1]`,
          java: `public static int[] twoSum(int[] arr, int target) {
    int left = 0, right = arr.length - 1;
    while (left < right) {
        int sum = arr[left] + arr[right];
        if (sum == target) return new int[]{left, right};
        else if (sum < target) left++;
        else right--;
    }
    return new int[]{};
}`,
          cpp: `vector<int> twoSum(vector<int>& arr, int target) {
    int left = 0, right = arr.size() - 1;
    while (left < right) {
        int sum = arr[left] + arr[right];
        if (sum == target) return {left, right};
        else if (sum < target) left++;
        else right--;
    }
    return {};
}`,
        },
      },
      advanced: {
        title: 'Sliding Window',
        content: 'The sliding window technique maintains a window of elements and slides it across the array. Used for subarray problems: max sum, longest substring, minimum window.',
        codeExample: {
          python: `# Sliding window: max sum subarray of size k
def max_subarray_sum(arr, k):
    window_sum = sum(arr[:k])
    max_sum = window_sum
    for i in range(k, len(arr)):
        window_sum += arr[i] - arr[i - k]
        max_sum = max(max_sum, window_sum)
    return max_sum

print(max_subarray_sum([2, 1, 5, 1, 3, 2], 3))  # 9`,
          java: `public static int maxSubarraySum(int[] arr, int k) {
    int windowSum = 0;
    for (int i = 0; i < k; i++) windowSum += arr[i];
    int maxSum = windowSum;
    for (int i = k; i < arr.length; i++) {
        windowSum += arr[i] - arr[i - k];
        maxSum = Math.max(maxSum, windowSum);
    }
    return maxSum;
}`,
          cpp: `int maxSubarraySum(vector<int>& arr, int k) {
    int windowSum = 0;
    for (int i = 0; i < k; i++) windowSum += arr[i];
    int maxSum = windowSum;
    for (int i = k; i < (int)arr.size(); i++) {
        windowSum += arr[i] - arr[i - k];
        maxSum = max(maxSum, windowSum);
    }
    return maxSum;
}`,
        },
      },
    },
    timeComplexity: [
      { operation: 'Access', best: 'O(1)', average: 'O(1)', worst: 'O(1)' },
      { operation: 'Search', best: 'O(1)', average: 'O(n)', worst: 'O(n)' },
      { operation: 'Insert (end)', best: 'O(1)', average: 'O(1)', worst: 'O(n)' },
      { operation: 'Delete', best: 'O(1)', average: 'O(n)', worst: 'O(n)' },
    ],
    spaceComplexity: 'O(n)',
    codeExamples: { python: '# See theory levels', java: '// See theory levels', cpp: '// See theory levels' },
    problems: [
      mkProblem('two-sum', 'Two Sum', 'easy', 'Given an array and target, return indices of two numbers that add up to target.'),
      mkProblem('max-subarray', 'Maximum Subarray', 'medium', 'Find the contiguous subarray with the largest sum (Kadane\'s Algorithm).'),
      mkProblem('rotate-array', 'Rotate Array', 'hard', 'Rotate array right by k steps in-place with O(1) extra space.'),
    ],
  },

  // ─── 9. Sorting Algorithms ───
  {
    id: 'sorting',
    title: 'Sorting Algorithms',
    icon: '📶',
    color: 'purple',
    order: 9,
    prerequisites: [], nextTopics: [], estimatedHours: 5,
    definition: 'Sorting algorithms arrange elements in a specific order (ascending/descending). Key algorithms: Bubble Sort, Selection Sort, Insertion Sort, Merge Sort, Quick Sort.',
    analogy: 'Sorting is like organizing books on a shelf — you compare books and swap them until everything is in alphabetical order.',
    whyUseIt: 'Sorting is fundamental to binary search, merge operations, and countless algorithms. Understanding O(n²) vs O(n log n) sorts teaches algorithm analysis.',
    theoryLevels: {
      beginner: {
        title: 'Bubble Sort & Selection Sort',
        content: 'Bubble Sort: repeatedly compare adjacent elements and swap if out of order. Selection Sort: find the minimum and place it at the front. Both are O(n²).',
        codeExample: {
          python: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n-i-1):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]
    return arr

print(bubble_sort([64, 34, 25, 12, 22]))`,
          java: `void bubbleSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n-i-1; j++)
            if (arr[j] > arr[j+1]) {
                int temp = arr[j];
                arr[j] = arr[j+1];
                arr[j+1] = temp;
            }
}`,
          cpp: `void bubbleSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n-i-1; j++)
            if (arr[j] > arr[j+1])
                swap(arr[j], arr[j+1]);
}`,
        },
      },
      intermediate: {
        title: 'Merge Sort',
        content: 'Divide the array in half, recursively sort each half, then merge. Always O(n log n) but uses O(n) extra space. Stable sort.',
        codeExample: {
          python: `def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i]); i += 1
        else:
            result.append(right[j]); j += 1
    result.extend(left[i:])
    result.extend(right[j:])
    return result`,
          java: `void mergeSort(int[] arr, int l, int r) {
    if (l < r) {
        int mid = (l + r) / 2;
        mergeSort(arr, l, mid);
        mergeSort(arr, mid + 1, r);
        merge(arr, l, mid, r);
    }
}`,
          cpp: `void mergeSort(vector<int>& arr, int l, int r) {
    if (l < r) {
        int mid = (l + r) / 2;
        mergeSort(arr, l, mid);
        mergeSort(arr, mid + 1, r);
        merge(arr, l, mid, r);
    }
}`,
        },
      },
      advanced: {
        title: 'Quick Sort & Comparison',
        content: 'Quick Sort picks a pivot, partitions around it, and recurses. Average O(n log n), worst O(n²). In-place, but not stable. Know when to use which sort.',
        codeExample: {
          python: `def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    mid = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quick_sort(left) + mid + quick_sort(right)

print(quick_sort([3, 6, 8, 10, 1, 2, 1]))`,
          java: `void quickSort(int[] arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}`,
          cpp: `void quickSort(vector<int>& arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}`,
        },
      },
    },
    timeComplexity: [
      { operation: 'Bubble Sort', best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
      { operation: 'Merge Sort', best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
      { operation: 'Quick Sort', best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)' },
    ],
    spaceComplexity: 'O(n) for Merge Sort, O(log n) for Quick Sort',
    codeExamples: { python: '# See theory levels', java: '// See theory levels', cpp: '// See theory levels' },
    problems: [
      mkProblem('sort-array', 'Sort an Array', 'easy', 'Sort an array of integers in ascending order.'),
      mkProblem('merge-sorted-arrays', 'Merge Two Sorted Arrays', 'medium', 'Merge two sorted arrays into one sorted array.'),
      mkProblem('kth-largest', 'Kth Largest Element', 'hard', 'Find the kth largest element using quickselect.'),
    ],
  },

  // ─── 10-30: Remaining topics with same structure ───
  ...[
    { id: '2d-arrays', title: '2D Arrays', icon: '⊞', color: 'amber', order: 10, hours: 4,
      def: 'A 2D array (matrix) is an array of arrays, representing data in rows and columns like a spreadsheet or grid.',
      analogy: 'A 2D array is like a chess board — you need both row and column to identify a position.',
      why: 'Matrices appear in image processing, game boards, graph adjacency matrices, and dynamic programming tables.' },
    { id: 'strings', title: 'Strings', icon: '📝', color: 'green', order: 11, hours: 4,
      def: 'Strings are sequences of characters. They support operations like concatenation, slicing, searching, and pattern matching.',
      analogy: 'A string is like a necklace of beads — each bead is a character, and you can examine, rearrange, or count them.',
      why: 'String manipulation is essential for text processing, parsing, validation, and is one of the most common interview topics.' },
    { id: 'bit-manipulation', title: 'Bit Manipulation', icon: '🔢', color: 'cyan', order: 12, hours: 3,
      def: 'Bit manipulation operates directly on binary representations of numbers using bitwise operators (&, |, ^, ~, <<, >>).',
      analogy: 'Bits are like light switches — each one is either on (1) or off (0). Bit manipulation flips, checks, and combines these switches efficiently.',
      why: 'Bitwise operations are O(1) and memory-efficient. Used in cryptography, compression, network protocols, and competitive programming.' },
    { id: 'oops', title: 'OOPs', icon: '🧩', color: 'purple', order: 13, hours: 4,
      def: 'Object-Oriented Programming organizes code into classes and objects with four pillars: Encapsulation, Abstraction, Inheritance, and Polymorphism.',
      analogy: 'OOP is like building with LEGO — each class is a blueprint for a type of brick, and objects are the actual bricks you snap together.',
      why: 'OOP enables code reuse, modularity, and real-world modeling. Most large-scale software (games, web apps, operating systems) uses OOP.' },
    { id: 'recursion', title: 'Recursion', icon: '↩', color: 'amber', order: 14, hours: 5,
      def: 'Recursion is a technique where a function calls itself to solve smaller subproblems. Every recursive solution has a base case and a recursive case.',
      analogy: 'Imagine standing in a line and asking the person in front their position. They ask the person in front of them, and so on until person #1 says "1".',
      why: 'Recursion elegantly solves trees, divide-and-conquer, backtracking, and dynamic programming problems.' },
    { id: 'divide-conquer', title: 'Divide & Conquer', icon: '✂️', color: 'green', order: 15, hours: 4,
      def: 'Divide and Conquer breaks a problem into smaller subproblems, solves them independently, and combines the results.',
      analogy: 'It\'s like sorting a deck of cards by splitting it in half, sorting each half, then merging them back together.',
      why: 'Powers efficient algorithms like Merge Sort, Quick Sort, Binary Search, and Strassen\'s matrix multiplication.' },
    { id: 'backtracking', title: 'Backtracking', icon: '🔙', color: 'cyan', order: 16, hours: 5,
      def: 'Backtracking explores all possible solutions by building candidates incrementally and abandoning (backtracking from) candidates that fail constraints.',
      analogy: 'Like solving a maze — you try a path, hit a dead end, go back to the last junction, and try another path.',
      why: 'Solves constraint satisfaction problems: N-Queens, Sudoku, permutations, combinations, and subset generation.' },
    { id: 'complexity', title: 'Time & Space Complexity', icon: '⏱️', color: 'purple', order: 17, hours: 3,
      def: 'Big O notation describes how an algorithm\'s runtime or memory usage grows as input size increases. Common: O(1), O(log n), O(n), O(n log n), O(n²), O(2^n).',
      analogy: 'Big O is like asking "how much worse does traffic get as more cars join?" O(1) = no change, O(n) = linear increase, O(n²) = gridlock.',
      why: 'Understanding complexity lets you choose the right algorithm. The difference between O(n) and O(n²) can mean seconds vs hours for large inputs.' },
    { id: 'arraylists', title: 'ArrayLists', icon: '📋', color: 'amber', order: 18, hours: 2,
      def: 'An ArrayList (or dynamic array) is a resizable array that automatically grows when elements are added beyond its capacity.',
      analogy: 'An ArrayList is like an expandable folder — it starts with some capacity and grows as you add more papers.',
      why: 'Dynamic arrays are the most commonly used data structure in practice. Python lists, Java ArrayList, and C++ vector are all dynamic arrays.' },
    { id: 'linked-lists', title: 'Linked Lists', icon: '⇒', color: 'green', order: 19, hours: 5,
      def: 'A linked list stores elements in nodes where each node contains data and a pointer to the next node. Not stored in contiguous memory.',
      analogy: 'Like a treasure hunt where each clue tells you the location of the next clue — you must follow the chain from the start.',
      why: 'O(1) insertion/deletion at known positions. Backbone of stacks, queues, and hash table collision resolution.' },
    { id: 'stacks', title: 'Stacks', icon: '📚', color: 'cyan', order: 20, hours: 3,
      def: 'A Stack is a LIFO (Last In, First Out) data structure. Elements are added and removed from the same end (top).',
      analogy: 'A stack of plates — you always add and remove from the top.',
      why: 'Powers function call stacks, undo/redo, expression evaluation, DFS, and monotonic stack problems.' },
    { id: 'queues', title: 'Queues', icon: '🚶', color: 'purple', order: 21, hours: 3,
      def: 'A Queue is a FIFO (First In, First Out) data structure. Elements are added at the rear and removed from the front.',
      analogy: 'Like a line at a coffee shop — first person in line is first to be served.',
      why: 'Powers BFS, task scheduling, producer-consumer systems, and CPU process management.' },
    { id: 'greedy', title: 'Greedy Algorithms', icon: '🤑', color: 'amber', order: 22, hours: 4,
      def: 'Greedy algorithms make the locally optimal choice at each step, hoping to find the global optimum. They don\'t reconsider past decisions.',
      analogy: 'Like picking the biggest coin first when making change — always grab the largest value available.',
      why: 'Efficient for optimization problems like activity selection, Huffman coding, Kruskal\'s/Prim\'s MST, and interval scheduling.' },
    { id: 'binary-trees', title: 'Binary Trees', icon: '🌳', color: 'green', order: 23, hours: 5,
      def: 'A binary tree is a hierarchical structure where each node has at most two children (left and right). Supports DFS and BFS traversals.',
      analogy: 'Like a family tree where each person has at most two children.',
      why: 'Foundation for BSTs, heaps, expression trees, and Huffman trees. Tree traversals (inorder, preorder, postorder) are fundamental.' },
    { id: 'bst', title: 'Binary Search Trees', icon: '🔍', color: 'cyan', order: 24, hours: 4,
      def: 'A BST is a binary tree where left child < parent < right child. This property enables O(log n) search, insert, and delete when balanced.',
      analogy: 'Like a dictionary — you open to the middle, check if your word comes before or after, and repeat.',
      why: 'BSTs power database indexes, symbol tables, and sorted data storage. Understanding balancing leads to AVL and Red-Black trees.' },
    { id: 'heaps', title: 'Heaps / Priority Queues', icon: '⛰️', color: 'purple', order: 25, hours: 4,
      def: 'A heap is a complete binary tree where every parent is greater (max-heap) or smaller (min-heap) than its children. Priority queues are built on heaps.',
      analogy: 'Like a tournament bracket — the winner of each match moves up, so the champion is always at the top.',
      why: 'O(log n) insert and extract-min/max. Used in Dijkstra\'s, heap sort, median finding, and task scheduling.' },
    { id: 'hashing', title: 'Hashing', icon: '#️⃣', color: 'amber', order: 26, hours: 3,
      def: 'Hashing maps data to fixed-size values using a hash function. Hash tables (dictionaries) provide average O(1) lookup, insert, and delete.',
      analogy: 'Like a library catalog system — you compute a shelf number from the book title and go directly there.',
      why: 'Hash maps are the most used data structure in interviews. O(1) average operations power caching, databases, and deduplication.' },
    { id: 'tries', title: 'Tries', icon: '🔤', color: 'green', order: 27, hours: 4,
      def: 'A Trie (prefix tree) is a tree-like structure where each node represents a character. Paths from root to nodes form strings.',
      analogy: 'Like autocomplete on your phone — each letter narrows down possible words by following the tree.',
      why: 'O(m) operations where m is string length. Used in autocomplete, spell checkers, IP routing, and word games.' },
    { id: 'graphs', title: 'Graphs', icon: '🕸️', color: 'cyan', order: 28, hours: 8,
      def: 'A graph consists of vertices (nodes) connected by edges. Can be directed/undirected, weighted/unweighted. Represented as adjacency list or matrix.',
      analogy: 'Like a social network — people are nodes and friendships are edges. Some relationships are one-way (directed), some two-way.',
      why: 'Graphs model networks, maps, dependencies, and relationships. BFS, DFS, Dijkstra\'s, and topological sort are essential algorithms.' },
    { id: 'dp', title: 'Dynamic Programming', icon: '📐', color: 'purple', order: 29, hours: 10,
      def: 'Dynamic Programming solves complex problems by breaking them into overlapping subproblems and storing results to avoid redundant computation.',
      analogy: 'Like filling in a crossword — you solve easier clues first and use those answers to help with harder ones.',
      why: 'DP optimizes problems from exponential to polynomial time. Essential for optimization: knapsack, longest subsequences, edit distance.' },
    { id: 'segment-trees', title: 'Segment Trees', icon: '🌲', color: 'amber', order: 30, hours: 6,
      def: 'A Segment Tree is a binary tree used for storing intervals/segments. It allows querying range information (sum, min, max) and point updates in O(log n).',
      analogy: 'Like a sports league bracket that also tracks aggregate stats — you can quickly find the total score of any range of teams.',
      why: 'Essential for range query problems in competitive programming. Supports range sum, range minimum, and lazy propagation.' },
  ].map(t => ({
    id: t.id,
    title: t.title,
    icon: t.icon,
    color: t.color,
    order: t.order,
    prerequisites: [] as string[],
    nextTopics: [] as string[],
    estimatedHours: t.hours,
    definition: t.def,
    analogy: t.analogy,
    whyUseIt: t.why,
    theoryLevels: {
      beginner: {
        title: `${t.title} — Getting Started`,
        content: `Learn the fundamentals of ${t.title.toLowerCase()}. Understand the basic concepts, terminology, and simple implementations.`,
        codeExample: {
          python: `# ${t.title} — Beginner Example\n# Basic implementation coming soon\nprint("Learning ${t.title}")`,
          java: `// ${t.title} — Beginner Example\npublic class ${t.id.replace(/-/g, '_').replace(/^./, c => c.toUpperCase())} {\n    public static void main(String[] args) {\n        System.out.println("Learning ${t.title}");\n    }\n}`,
          cpp: `// ${t.title} — Beginner Example\n#include <iostream>\nusing namespace std;\nint main() {\n    cout << "Learning ${t.title}";\n    return 0;\n}`,
        },
      },
      intermediate: {
        title: `${t.title} — Core Techniques`,
        content: `Dive deeper into ${t.title.toLowerCase()} with practical patterns and medium-difficulty problems. Focus on efficiency and common patterns.`,
        codeExample: {
          python: `# ${t.title} — Intermediate Example\n# Core techniques coming soon\npass`,
          java: `// ${t.title} — Intermediate Example\n// Core techniques coming soon`,
          cpp: `// ${t.title} — Intermediate Example\n// Core techniques coming soon`,
        },
      },
      advanced: {
        title: `${t.title} — Advanced Problems`,
        content: `Master ${t.title.toLowerCase()} with complex problems, optimizations, and edge cases encountered in competitive programming and interviews.`,
        codeExample: {
          python: `# ${t.title} — Advanced Example\n# Advanced techniques coming soon\npass`,
          java: `// ${t.title} — Advanced Example\n// Advanced techniques coming soon`,
          cpp: `// ${t.title} — Advanced Example\n// Advanced techniques coming soon`,
        },
      },
    },
    timeComplexity: [{ operation: 'Varies', best: 'See theory', average: 'See theory', worst: 'See theory' }],
    spaceComplexity: 'See theory',
    codeExamples: { python: '# See theory levels', java: '// See theory levels', cpp: '// See theory levels' },
    problems: [
      mkProblem(`${t.id}-easy`, `${t.title} Easy`, 'easy', `Solve a basic ${t.title.toLowerCase()} problem.`),
      mkProblem(`${t.id}-medium`, `${t.title} Medium`, 'medium', `Solve an intermediate ${t.title.toLowerCase()} problem.`),
      mkProblem(`${t.id}-hard`, `${t.title} Hard`, 'hard', `Solve an advanced ${t.title.toLowerCase()} problem.`),
    ],
  } as TopicContent)),
];

export const TOPIC_MAP: Record<string, TopicContent> = {};
TOPICS.forEach(t => { TOPIC_MAP[t.id] = t; });

export function getTopicById(id: string): TopicContent | undefined {
  return TOPIC_MAP[id];
}

export function getDifficultyColor(difficulty: Difficulty): string {
  switch (difficulty) {
    case 'easy': return 'text-dsa-green';
    case 'medium': return 'text-amber';
    case 'hard': return 'text-destructive';
  }
}

export const LANGUAGE_IDS: Record<Language, number> = {
  python: 71,
  java: 62,
  cpp: 54,
};

export const LANGUAGE_LABELS: Record<Language, string> = {
  python: 'Python 3',
  java: 'Java',
  cpp: 'C++ 17',
};
