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
      mkProblem('flowchart-even-odd', 'Even or Odd', 'easy', 'Write a program that checks if a number is even or odd.', {
        examples: [
          { input: 'n = 4', output: 'Even', explanation: '4 % 2 == 0, so it is even.' },
          { input: 'n = 7', output: 'Odd', explanation: '7 % 2 == 1, so it is odd.' },
        ],
        constraints: ['1 <= n <= 10^9'],
        testCases: [{ input: '4', expectedOutput: 'Even' }, { input: '7', expectedOutput: 'Odd' }],
        starterCode: {
          python: 'n = int(input())\n# Print "Even" or "Odd"',
          java: 'import java.util.Scanner;\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        // Print "Even" or "Odd"\n    }\n}',
          cpp: '#include <iostream>\nusing namespace std;\nint main() {\n    int n;\n    cin >> n;\n    // Print "Even" or "Odd"\n    return 0;\n}',
        },
      }),
      mkProblem('flowchart-largest-three', 'Largest of Three', 'easy', 'Find the largest of three numbers using if-else.', {
        examples: [
          { input: 'a = 3, b = 7, c = 5', output: '7', explanation: '7 is the largest among 3, 7, 5.' },
          { input: 'a = 10, b = 10, c = 10', output: '10' },
        ],
        constraints: ['-10^9 <= a, b, c <= 10^9'],
        testCases: [{ input: '3 7 5', expectedOutput: '7' }, { input: '10 10 10', expectedOutput: '10' }],
        starterCode: {
          python: 'a, b, c = map(int, input().split())\n# Print the largest of a, b, c',
          java: 'import java.util.Scanner;\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int a = sc.nextInt(), b = sc.nextInt(), c = sc.nextInt();\n        // Print the largest\n    }\n}',
          cpp: '#include <iostream>\nusing namespace std;\nint main() {\n    int a, b, c;\n    cin >> a >> b >> c;\n    // Print the largest\n    return 0;\n}',
        },
      }),
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
      mkProblem('swap-two', 'Swap Two Variables', 'easy', 'Swap the values of two variables without using a third variable.', {
        examples: [
          { input: 'a = 5, b = 10', output: 'a = 10, b = 5', explanation: 'After swapping, a becomes 10 and b becomes 5.' },
        ],
        constraints: ['-10^9 <= a, b <= 10^9'],
        testCases: [{ input: '5 10', expectedOutput: '10 5' }, { input: '-3 7', expectedOutput: '7 -3' }],
        starterCode: {
          python: 'a, b = map(int, input().split())\n# Swap without third variable and print "a b"',
          java: 'import java.util.Scanner;\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int a = sc.nextInt(), b = sc.nextInt();\n        // Swap and print\n    }\n}',
          cpp: '#include <iostream>\nusing namespace std;\nint main() {\n    int a, b;\n    cin >> a >> b;\n    // Swap without temp and print\n    return 0;\n}',
        },
      }),
      mkProblem('temperature-convert', 'Temperature Converter', 'easy', 'Given a temperature in Celsius, convert it to Fahrenheit. Formula: F = C × 9/5 + 32.', {
        examples: [
          { input: 'C = 0', output: '32.00', explanation: '0°C = 32°F' },
          { input: 'C = 100', output: '212.00', explanation: '100°C = 212°F' },
        ],
        constraints: ['-273.15 <= C <= 10^6'],
        testCases: [{ input: '0', expectedOutput: '32.00' }, { input: '100', expectedOutput: '212.00' }, { input: '37', expectedOutput: '98.60' }],
        starterCode: {
          python: 'c = float(input())\n# Print Fahrenheit with 2 decimal places',
          java: 'import java.util.Scanner;\npublic class Solution {\n    public static void main(String[] args) {\n        double c = new Scanner(System.in).nextDouble();\n        // Print Fahrenheit with 2 decimal places\n    }\n}',
          cpp: '#include <iostream>\n#include <iomanip>\nusing namespace std;\nint main() {\n    double c;\n    cin >> c;\n    // Print Fahrenheit with 2 decimal places\n    return 0;\n}',
        },
      }),
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
      mkProblem('check-power-of-two', 'Check Power of Two', 'easy', 'Check if a given number is a power of 2 using bitwise operators.', {
        examples: [
          { input: 'n = 16', output: 'true', explanation: '16 = 2^4' },
          { input: 'n = 18', output: 'false' },
        ],
        constraints: ['1 <= n <= 2^31 - 1'],
        testCases: [{ input: '16', expectedOutput: 'true' }, { input: '18', expectedOutput: 'false' }, { input: '1', expectedOutput: 'true' }],
        starterCode: {
          python: 'n = int(input())\n# Print "true" or "false"',
          java: 'import java.util.Scanner;\npublic class Solution {\n    public static void main(String[] args) {\n        int n = new Scanner(System.in).nextInt();\n        // Print "true" or "false"\n    }\n}',
          cpp: '#include <iostream>\nusing namespace std;\nint main() {\n    int n;\n    cin >> n;\n    // Print "true" or "false"\n    return 0;\n}',
        },
      }),
      mkProblem('xor-find-unique', 'Find Unique Number', 'medium', 'Given an array where every element appears twice except one, find the unique element using XOR.', {
        examples: [
          { input: 'nums = [2, 3, 2, 4, 4]', output: '3', explanation: '2 and 4 appear twice, 3 appears once.' },
          { input: 'nums = [1]', output: '1' },
        ],
        constraints: ['1 <= nums.length <= 3 × 10^4', 'Each element appears twice except one'],
        testCases: [{ input: '5\n2 3 2 4 4', expectedOutput: '3' }, { input: '1\n1', expectedOutput: '1' }],
        starterCode: {
          python: 'n = int(input())\nnums = list(map(int, input().split()))\n# Print the unique element',
          java: 'import java.util.Scanner;\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        // Print the unique element\n    }\n}',
          cpp: '#include <iostream>\nusing namespace std;\nint main() {\n    int n;\n    cin >> n;\n    // Read array and print the unique element\n    return 0;\n}',
        },
      }),
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
      mkProblem('leap-year', 'Leap Year Check', 'easy', 'Determine if a given year is a leap year. A year is leap if divisible by 4 but not 100, or divisible by 400.', {
        examples: [
          { input: 'year = 2024', output: 'true', explanation: '2024 is divisible by 4 but not by 100.' },
          { input: 'year = 1900', output: 'false', explanation: '1900 is divisible by 100 but not by 400.' },
          { input: 'year = 2000', output: 'true', explanation: '2000 is divisible by 400.' },
        ],
        constraints: ['1 <= year <= 10^5'],
        testCases: [{ input: '2024', expectedOutput: 'true' }, { input: '1900', expectedOutput: 'false' }, { input: '2000', expectedOutput: 'true' }],
        starterCode: {
          python: 'year = int(input())\n# Print "true" or "false"',
          java: 'import java.util.Scanner;\npublic class Solution {\n    public static void main(String[] args) {\n        int year = new Scanner(System.in).nextInt();\n        // Print "true" or "false"\n    }\n}',
          cpp: '#include <iostream>\nusing namespace std;\nint main() {\n    int year;\n    cin >> year;\n    // Print "true" or "false"\n    return 0;\n}',
        },
      }),
      mkProblem('triangle-type', 'Triangle Type', 'medium', 'Given three sides, determine if the triangle is equilateral, isosceles, or scalene. First check if a valid triangle can be formed.', {
        examples: [
          { input: 'a = 5, b = 5, c = 5', output: 'Equilateral' },
          { input: 'a = 5, b = 5, c = 3', output: 'Isosceles' },
          { input: 'a = 3, b = 4, c = 5', output: 'Scalene' },
        ],
        constraints: ['1 <= a, b, c <= 10^6'],
        testCases: [{ input: '5 5 5', expectedOutput: 'Equilateral' }, { input: '5 5 3', expectedOutput: 'Isosceles' }, { input: '3 4 5', expectedOutput: 'Scalene' }],
        starterCode: {
          python: 'a, b, c = map(int, input().split())\n# Print "Equilateral", "Isosceles", or "Scalene"',
          java: 'import java.util.Scanner;\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int a = sc.nextInt(), b = sc.nextInt(), c = sc.nextInt();\n        // Print triangle type\n    }\n}',
          cpp: '#include <iostream>\nusing namespace std;\nint main() {\n    int a, b, c;\n    cin >> a >> b >> c;\n    // Print triangle type\n    return 0;\n}',
        },
      }),
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
      mkProblem('sum-digits', 'Sum of Digits', 'easy', 'Find the sum of digits of a given number.', {
        examples: [
          { input: 'n = 1234', output: '10', explanation: '1 + 2 + 3 + 4 = 10' },
          { input: 'n = 9', output: '9' },
        ],
        constraints: ['0 <= n <= 10^9'],
        testCases: [{ input: '1234', expectedOutput: '10' }, { input: '9', expectedOutput: '9' }, { input: '0', expectedOutput: '0' }],
        starterCode: {
          python: 'n = int(input())\n# Print sum of digits',
          java: 'import java.util.Scanner;\npublic class Solution {\n    public static void main(String[] args) {\n        int n = new Scanner(System.in).nextInt();\n        // Print sum of digits\n    }\n}',
          cpp: '#include <iostream>\nusing namespace std;\nint main() {\n    int n;\n    cin >> n;\n    // Print sum of digits\n    return 0;\n}',
        },
      }),
      mkProblem('reverse-number', 'Reverse a Number', 'easy', 'Reverse the digits of an integer. Negative sign should be preserved.', {
        examples: [
          { input: 'n = 1234', output: '4321' },
          { input: 'n = -567', output: '-765' },
        ],
        constraints: ['-2^31 <= n <= 2^31 - 1'],
        testCases: [{ input: '1234', expectedOutput: '4321' }, { input: '-567', expectedOutput: '-765' }, { input: '100', expectedOutput: '1' }],
        starterCode: {
          python: 'n = int(input())\n# Print the reversed number',
          java: 'import java.util.Scanner;\npublic class Solution {\n    public static void main(String[] args) {\n        int n = new Scanner(System.in).nextInt();\n        // Print the reversed number\n    }\n}',
          cpp: '#include <iostream>\nusing namespace std;\nint main() {\n    int n;\n    cin >> n;\n    // Print the reversed number\n    return 0;\n}',
        },
      }),
      mkProblem('prime-check', 'Prime Number Check', 'medium', 'Check if a given number is prime. A prime number has exactly two divisors: 1 and itself.', {
        examples: [
          { input: 'n = 7', output: 'true', explanation: '7 is only divisible by 1 and 7.' },
          { input: 'n = 4', output: 'false', explanation: '4 is divisible by 2.' },
        ],
        constraints: ['1 <= n <= 10^9'],
        testCases: [{ input: '7', expectedOutput: 'true' }, { input: '4', expectedOutput: 'false' }, { input: '1', expectedOutput: 'false' }, { input: '2', expectedOutput: 'true' }],
        starterCode: {
          python: 'n = int(input())\n# Print "true" if prime, "false" otherwise',
          java: 'import java.util.Scanner;\npublic class Solution {\n    public static void main(String[] args) {\n        int n = new Scanner(System.in).nextInt();\n        // Print "true" or "false"\n    }\n}',
          cpp: '#include <iostream>\nusing namespace std;\nint main() {\n    int n;\n    cin >> n;\n    // Print "true" or "false"\n    return 0;\n}',
        },
      }),
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
      mkProblem('inverted-triangle', 'Inverted Triangle', 'easy', 'Print an inverted right triangle of n rows. Row 1 has n stars, row 2 has n-1, etc.', {
        examples: [
          { input: 'n = 4', output: '* * * *\n* * *\n* *\n*' },
        ],
        constraints: ['1 <= n <= 100'],
        testCases: [{ input: '4', expectedOutput: '* * * *\n* * *\n* *\n*' }, { input: '1', expectedOutput: '*' }],
        starterCode: {
          python: 'n = int(input())\n# Print inverted triangle',
          java: 'import java.util.Scanner;\npublic class Solution {\n    public static void main(String[] args) {\n        int n = new Scanner(System.in).nextInt();\n        // Print inverted triangle\n    }\n}',
          cpp: '#include <iostream>\nusing namespace std;\nint main() {\n    int n;\n    cin >> n;\n    // Print inverted triangle\n    return 0;\n}',
        },
      }),
      mkProblem('hollow-rectangle', 'Hollow Rectangle', 'medium', 'Print a hollow rectangle of stars with r rows and c columns. Only the border should have stars.', {
        examples: [
          { input: 'r = 4, c = 5', output: '* * * * *\n*       *\n*       *\n* * * * *' },
        ],
        constraints: ['2 <= r, c <= 100'],
        testCases: [{ input: '4 5', expectedOutput: '* * * * *\n*       *\n*       *\n* * * * *' }],
        starterCode: {
          python: 'r, c = map(int, input().split())\n# Print hollow rectangle',
          java: 'import java.util.Scanner;\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int r = sc.nextInt(), c = sc.nextInt();\n        // Print hollow rectangle\n    }\n}',
          cpp: '#include <iostream>\nusing namespace std;\nint main() {\n    int r, c;\n    cin >> r >> c;\n    // Print hollow rectangle\n    return 0;\n}',
        },
      }),
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
      mkProblem('factorial-func', 'Factorial Function', 'easy', 'Write a function that returns the factorial of n. n! = n × (n-1) × ... × 1.', {
        examples: [
          { input: 'n = 5', output: '120', explanation: '5! = 5 × 4 × 3 × 2 × 1 = 120' },
          { input: 'n = 0', output: '1', explanation: '0! = 1 by definition.' },
        ],
        constraints: ['0 <= n <= 20'],
        testCases: [{ input: '5', expectedOutput: '120' }, { input: '0', expectedOutput: '1' }, { input: '10', expectedOutput: '3628800' }],
        starterCode: {
          python: 'n = int(input())\n\ndef factorial(n):\n    # Return n!\n    pass\n\nprint(factorial(n))',
          java: 'import java.util.Scanner;\npublic class Solution {\n    static long factorial(int n) {\n        // Return n!\n        return 0;\n    }\n    public static void main(String[] args) {\n        int n = new Scanner(System.in).nextInt();\n        System.out.println(factorial(n));\n    }\n}',
          cpp: '#include <iostream>\nusing namespace std;\nlong long factorial(int n) {\n    // Return n!\n    return 0;\n}\nint main() {\n    int n;\n    cin >> n;\n    cout << factorial(n);\n    return 0;\n}',
        },
      }),
      mkProblem('palindrome-check', 'Palindrome Check', 'easy', 'Write a function to check if a string is a palindrome (reads the same forwards and backwards).', {
        examples: [
          { input: 's = "racecar"', output: 'true' },
          { input: 's = "hello"', output: 'false' },
        ],
        constraints: ['1 <= s.length <= 10^5', 'String contains only lowercase letters'],
        testCases: [{ input: 'racecar', expectedOutput: 'true' }, { input: 'hello', expectedOutput: 'false' }, { input: 'a', expectedOutput: 'true' }],
        starterCode: {
          python: 's = input()\n# Print "true" or "false"',
          java: 'import java.util.Scanner;\npublic class Solution {\n    public static void main(String[] args) {\n        String s = new Scanner(System.in).nextLine();\n        // Print "true" or "false"\n    }\n}',
          cpp: '#include <iostream>\n#include <string>\nusing namespace std;\nint main() {\n    string s;\n    cin >> s;\n    // Print "true" or "false"\n    return 0;\n}',
        },
      }),
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
      mkProblem('two-sum', 'Two Sum', 'easy', 'Given an array of integers and a target, return indices of two numbers that add up to target.', {
        examples: [
          { input: 'nums = [2,7,11,15], target = 9', output: '0 1', explanation: 'nums[0] + nums[1] = 2 + 7 = 9' },
          { input: 'nums = [3,2,4], target = 6', output: '1 2' },
        ],
        constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9', 'Exactly one valid answer exists'],
        testCases: [{ input: '4\n2 7 11 15\n9', expectedOutput: '0 1' }, { input: '3\n3 2 4\n6', expectedOutput: '1 2' }],
        starterCode: {
          python: 'n = int(input())\nnums = list(map(int, input().split()))\ntarget = int(input())\n# Print the two indices space-separated',
          java: 'import java.util.*;\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        int target = sc.nextInt();\n        // Print the two indices\n    }\n}',
          cpp: '#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n;\n    cin >> n;\n    vector<int> nums(n);\n    for (int i = 0; i < n; i++) cin >> nums[i];\n    int target;\n    cin >> target;\n    // Print the two indices\n    return 0;\n}',
        },
      }),
      mkProblem('max-subarray', 'Maximum Subarray', 'medium', 'Find the contiguous subarray with the largest sum (Kadane\'s Algorithm).', {
        examples: [
          { input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6', explanation: 'Subarray [4,-1,2,1] has sum 6.' },
          { input: 'nums = [1]', output: '1' },
        ],
        constraints: ['1 <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4'],
        testCases: [{ input: '9\n-2 1 -3 4 -1 2 1 -5 4', expectedOutput: '6' }, { input: '1\n1', expectedOutput: '1' }, { input: '5\n-1 -2 -3 -4 -5', expectedOutput: '-1' }],
        starterCode: {
          python: 'n = int(input())\nnums = list(map(int, input().split()))\n# Print the maximum subarray sum',
          java: 'import java.util.*;\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        // Print the maximum subarray sum\n    }\n}',
          cpp: '#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n;\n    cin >> n;\n    vector<int> nums(n);\n    for (int i = 0; i < n; i++) cin >> nums[i];\n    // Print the maximum subarray sum\n    return 0;\n}',
        },
      }),
      mkProblem('rotate-array', 'Rotate Array', 'hard', 'Rotate array right by k steps in-place with O(1) extra space.', {
        examples: [
          { input: 'nums = [1,2,3,4,5,6,7], k = 3', output: '5 6 7 1 2 3 4', explanation: 'Rotate right 3 times.' },
          { input: 'nums = [-1,-100,3,99], k = 2', output: '3 99 -1 -100' },
        ],
        constraints: ['1 <= nums.length <= 10^5', '-2^31 <= nums[i] <= 2^31 - 1', '0 <= k <= 10^5'],
        testCases: [{ input: '7\n1 2 3 4 5 6 7\n3', expectedOutput: '5 6 7 1 2 3 4' }, { input: '4\n-1 -100 3 99\n2', expectedOutput: '3 99 -1 -100' }],
        starterCode: {
          python: 'n = int(input())\nnums = list(map(int, input().split()))\nk = int(input())\n# Rotate and print space-separated',
          java: 'import java.util.*;\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        int k = sc.nextInt();\n        // Rotate and print\n    }\n}',
          cpp: '#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n;\n    cin >> n;\n    vector<int> nums(n);\n    for (int i = 0; i < n; i++) cin >> nums[i];\n    int k;\n    cin >> k;\n    // Rotate and print\n    return 0;\n}',
        },
      }),
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
      mkProblem('sort-array', 'Sort an Array', 'easy', 'Sort an array of integers in ascending order using any sorting algorithm.', {
        examples: [{ input: 'nums = [5,2,3,1]', output: '1 2 3 5' }, { input: 'nums = [5,1,1,2,0,0]', output: '0 0 1 1 2 5' }],
        constraints: ['1 <= nums.length <= 5 × 10^4', '-5 × 10^4 <= nums[i] <= 5 × 10^4'],
        testCases: [{ input: '4\n5 2 3 1', expectedOutput: '1 2 3 5' }, { input: '6\n5 1 1 2 0 0', expectedOutput: '0 0 1 1 2 5' }],
        starterCode: {
          python: 'n = int(input())\nnums = list(map(int, input().split()))\n# Sort and print space-separated',
          java: 'import java.util.*;\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        // Sort and print\n    }\n}',
          cpp: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\nint main() {\n    int n;\n    cin >> n;\n    vector<int> nums(n);\n    for (int i = 0; i < n; i++) cin >> nums[i];\n    // Sort and print\n    return 0;\n}',
        },
      }),
      mkProblem('merge-sorted-arrays', 'Merge Two Sorted Arrays', 'medium', 'Merge two sorted arrays into one sorted array in O(m+n) time.', {
        examples: [{ input: 'a = [1,3,5], b = [2,4,6]', output: '1 2 3 4 5 6' }],
        constraints: ['0 <= a.length, b.length <= 10^4'],
        testCases: [{ input: '3\n1 3 5\n3\n2 4 6', expectedOutput: '1 2 3 4 5 6' }, { input: '0\n\n3\n1 2 3', expectedOutput: '1 2 3' }],
        starterCode: {
          python: 'm = int(input())\na = list(map(int, input().split())) if m else []\nn = int(input())\nb = list(map(int, input().split())) if n else []\n# Merge and print',
          java: 'import java.util.*;\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Read two sorted arrays and merge\n    }\n}',
          cpp: '#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    // Read two sorted arrays and merge\n    return 0;\n}',
        },
      }),
      mkProblem('kth-largest', 'Kth Largest Element', 'hard', 'Find the kth largest element in an unsorted array. Expected O(n) average using quickselect.', {
        examples: [{ input: 'nums = [3,2,1,5,6,4], k = 2', output: '5', explanation: 'Sorted: [6,5,4,3,2,1], 2nd largest is 5.' }],
        constraints: ['1 <= k <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4'],
        testCases: [{ input: '6\n3 2 1 5 6 4\n2', expectedOutput: '5' }, { input: '9\n3 2 3 1 2 4 5 5 6\n4', expectedOutput: '4' }],
        starterCode: {
          python: 'n = int(input())\nnums = list(map(int, input().split()))\nk = int(input())\n# Print the kth largest element',
          java: 'import java.util.*;\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        int k = sc.nextInt();\n        // Print kth largest\n    }\n}',
          cpp: '#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n;\n    cin >> n;\n    vector<int> nums(n);\n    for (int i = 0; i < n; i++) cin >> nums[i];\n    int k;\n    cin >> k;\n    // Print kth largest\n    return 0;\n}',
        },
      }),
    ],
  },

  // ─── 10. 2D Arrays ───
  {
    id: '2d-arrays', title: '2D Arrays', icon: '⊞', color: 'amber', order: 10,
    prerequisites: [], nextTopics: [], estimatedHours: 4,
    definition: 'A 2D array (matrix) is an array of arrays, representing data in rows and columns like a spreadsheet or grid. Each element is accessed using two indices: row and column.',
    analogy: 'A 2D array is like a chess board — you need both a row and column number to identify any square.',
    whyUseIt: 'Matrices appear in image processing, game boards, graph adjacency matrices, and dynamic programming tables. Many interview problems revolve around matrix traversal and manipulation.',
    theoryLevels: {
      beginner: {
        title: 'Matrix Basics — Creation & Traversal',
        content: `A 2D array is simply an array where each element is itself an array (a row). You access elements with two indices: matrix[row][col].

Key concepts:
• Creation: Initialize with fixed dimensions or nested lists
• Row-major traversal: Visit each row left-to-right, top-to-bottom
• Column-major traversal: Visit each column top-to-bottom, left-to-right
• Boundary: rows = len(matrix), cols = len(matrix[0])

Common operations:
1. Print the matrix
2. Find the sum/max/min of all elements
3. Transpose (swap rows and columns)`,
        codeExample: {
          python: `# Create and traverse a 2D array
matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]
rows, cols = len(matrix), len(matrix[0])

# Row-major traversal
for i in range(rows):
    for j in range(cols):
        print(matrix[i][j], end=" ")
    print()

# Transpose
transpose = [[matrix[j][i] for j in range(rows)] for i in range(cols)]
print("Transpose:", transpose)`,
          java: `int[][] matrix = {{1,2,3},{4,5,6},{7,8,9}};
int rows = matrix.length, cols = matrix[0].length;

// Row-major traversal
for (int i = 0; i < rows; i++) {
    for (int j = 0; j < cols; j++) {
        System.out.print(matrix[i][j] + " ");
    }
    System.out.println();
}

// Transpose
int[][] transpose = new int[cols][rows];
for (int i = 0; i < rows; i++)
    for (int j = 0; j < cols; j++)
        transpose[j][i] = matrix[i][j];`,
          cpp: `#include <vector>
#include <iostream>
using namespace std;

vector<vector<int>> matrix = {{1,2,3},{4,5,6},{7,8,9}};
int rows = matrix.size(), cols = matrix[0].size();

// Row-major traversal
for (int i = 0; i < rows; i++) {
    for (int j = 0; j < cols; j++)
        cout << matrix[i][j] << " ";
    cout << endl;
}

// Transpose
vector<vector<int>> t(cols, vector<int>(rows));
for (int i = 0; i < rows; i++)
    for (int j = 0; j < cols; j++)
        t[j][i] = matrix[i][j];`,
        },
      },
      intermediate: {
        title: 'Rotation & Spiral Traversal',
        content: `Intermediate matrix operations involve more complex traversal patterns:

Rotate 90° clockwise:
1. Transpose the matrix (swap rows/columns)
2. Reverse each row

Spiral traversal:
Visit elements in a spiral order: right → down → left → up, shrinking boundaries each time.

Diagonal traversal:
Elements on the same diagonal share the property: row + col = constant (anti-diagonal) or row - col = constant (main diagonal).`,
        codeExample: {
          python: `# Rotate matrix 90° clockwise (in-place)
def rotate(matrix):
    n = len(matrix)
    # Transpose
    for i in range(n):
        for j in range(i+1, n):
            matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]
    # Reverse each row
    for row in matrix:
        row.reverse()

# Spiral order traversal
def spiral_order(matrix):
    result = []
    top, bottom = 0, len(matrix) - 1
    left, right = 0, len(matrix[0]) - 1
    while top <= bottom and left <= right:
        for j in range(left, right+1): result.append(matrix[top][j])
        top += 1
        for i in range(top, bottom+1): result.append(matrix[i][right])
        right -= 1
        if top <= bottom:
            for j in range(right, left-1, -1): result.append(matrix[bottom][j])
            bottom -= 1
        if left <= right:
            for i in range(bottom, top-1, -1): result.append(matrix[i][left])
            left += 1
    return result`,
          java: `// Rotate 90° clockwise
public void rotate(int[][] matrix) {
    int n = matrix.length;
    for (int i = 0; i < n; i++)
        for (int j = i+1; j < n; j++) {
            int temp = matrix[i][j];
            matrix[i][j] = matrix[j][i];
            matrix[j][i] = temp;
        }
    for (int[] row : matrix) {
        int l = 0, r = n-1;
        while (l < r) { int t = row[l]; row[l++] = row[r]; row[r--] = t; }
    }
}`,
          cpp: `void rotate(vector<vector<int>>& matrix) {
    int n = matrix.size();
    // Transpose
    for (int i = 0; i < n; i++)
        for (int j = i+1; j < n; j++)
            swap(matrix[i][j], matrix[j][i]);
    // Reverse rows
    for (auto& row : matrix)
        reverse(row.begin(), row.end());
}`,
        },
      },
      advanced: {
        title: 'Search in Sorted Matrix',
        content: `A sorted matrix has rows and columns in ascending order. You can search in O(m+n) by starting from the top-right corner:
• If target == current → found!
• If target < current → move left (eliminate column)
• If target > current → move down (eliminate row)

Matrix exponentiation is used to solve linear recurrences in O(log n) using fast matrix power — used in competitive programming for Fibonacci variants.`,
        codeExample: {
          python: `# Search in row-column sorted matrix — O(m+n)
def search_matrix(matrix, target):
    if not matrix: return False
    rows, cols = len(matrix), len(matrix[0])
    r, c = 0, cols - 1  # start top-right
    while r < rows and c >= 0:
        if matrix[r][c] == target:
            return True
        elif matrix[r][c] > target:
            c -= 1
        else:
            r += 1
    return False

# Matrix multiplication (for exponentiation)
def mat_mult(A, B):
    n = len(A)
    C = [[0]*n for _ in range(n)]
    for i in range(n):
        for j in range(n):
            for k in range(n):
                C[i][j] += A[i][k] * B[k][j]
    return C`,
          java: `public boolean searchMatrix(int[][] matrix, int target) {
    int r = 0, c = matrix[0].length - 1;
    while (r < matrix.length && c >= 0) {
        if (matrix[r][c] == target) return true;
        else if (matrix[r][c] > target) c--;
        else r++;
    }
    return false;
}`,
          cpp: `bool searchMatrix(vector<vector<int>>& matrix, int target) {
    int r = 0, c = matrix[0].size() - 1;
    while (r < (int)matrix.size() && c >= 0) {
        if (matrix[r][c] == target) return true;
        else if (matrix[r][c] > target) c--;
        else r++;
    }
    return false;
}`,
        },
      },
    },
    timeComplexity: [
      { operation: 'Access', best: 'O(1)', average: 'O(1)', worst: 'O(1)' },
      { operation: 'Traversal', best: 'O(m×n)', average: 'O(m×n)', worst: 'O(m×n)' },
      { operation: 'Search (sorted)', best: 'O(1)', average: 'O(m+n)', worst: 'O(m+n)' },
      { operation: 'Rotate', best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)' },
    ],
    spaceComplexity: 'O(m×n)',
    codeExamples: { python: '# See theory levels', java: '// See theory levels', cpp: '// See theory levels' },
    problems: [
      mkProblem('matrix-transpose', 'Transpose Matrix', 'easy', 'Given an m×n matrix, return its transpose (rows become columns).', {
        examples: [{ input: 'matrix = [[1,2,3],[4,5,6]]', output: '[[1,4],[2,5],[3,6]]' }],
        constraints: ['1 <= m, n <= 1000', '-10^9 <= matrix[i][j] <= 10^9'],
        testCases: [{ input: '2 3\n1 2 3\n4 5 6', expectedOutput: '1 4\n2 5\n3 6' }],
        starterCode: {
          python: 'r, c = map(int, input().split())\nmatrix = [list(map(int, input().split())) for _ in range(r)]\n# Print the transpose',
          java: 'import java.util.*;\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int r = sc.nextInt(), c = sc.nextInt();\n        int[][] matrix = new int[r][c];\n        for (int i = 0; i < r; i++) for (int j = 0; j < c; j++) matrix[i][j] = sc.nextInt();\n        // Print transpose\n    }\n}',
          cpp: '#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int r, c;\n    cin >> r >> c;\n    vector<vector<int>> matrix(r, vector<int>(c));\n    for (int i = 0; i < r; i++) for (int j = 0; j < c; j++) cin >> matrix[i][j];\n    // Print transpose\n    return 0;\n}',
        },
      }),
      mkProblem('spiral-matrix', 'Spiral Order Traversal', 'medium', 'Return all elements of the matrix in spiral order (right→down→left→up).', {
        examples: [{ input: 'matrix = [[1,2,3],[4,5,6],[7,8,9]]', output: '1 2 3 6 9 8 7 4 5' }],
        constraints: ['1 <= m, n <= 10', '-100 <= matrix[i][j] <= 100'],
        testCases: [{ input: '3 3\n1 2 3\n4 5 6\n7 8 9', expectedOutput: '1 2 3 6 9 8 7 4 5' }],
        starterCode: {
          python: 'r, c = map(int, input().split())\nmatrix = [list(map(int, input().split())) for _ in range(r)]\n# Print spiral order space-separated',
          java: 'import java.util.*;\npublic class Solution {\n    public static void main(String[] args) {\n        // Read matrix and print spiral order\n    }\n}',
          cpp: '#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    // Read matrix and print spiral order\n    return 0;\n}',
        },
      }),
      mkProblem('rotate-image', 'Rotate Image 90°', 'medium', 'Rotate an n×n matrix 90° clockwise in-place. Do not allocate another matrix.', {
        examples: [{ input: 'matrix = [[1,2,3],[4,5,6],[7,8,9]]', output: '7 4 1\n8 5 2\n9 6 3' }],
        constraints: ['1 <= n <= 20', '-1000 <= matrix[i][j] <= 1000'],
        testCases: [{ input: '3\n1 2 3\n4 5 6\n7 8 9', expectedOutput: '7 4 1\n8 5 2\n9 6 3' }],
        starterCode: {
          python: 'n = int(input())\nmatrix = [list(map(int, input().split())) for _ in range(n)]\n# Rotate in-place and print',
          java: 'import java.util.*;\npublic class Solution {\n    public static void main(String[] args) {\n        // Read n×n matrix, rotate 90° clockwise, print\n    }\n}',
          cpp: '#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    // Read n×n matrix, rotate 90° clockwise, print\n    return 0;\n}',
        },
      }),
      mkProblem('search-sorted-matrix', 'Search 2D Matrix', 'hard', 'Search for a target in a row-column sorted matrix in O(m+n). Each row and column is sorted in ascending order.', {
        examples: [
          { input: 'matrix = [[1,4,7],[2,5,8],[3,6,9]], target = 5', output: 'true' },
          { input: 'matrix = [[1,4,7],[2,5,8],[3,6,9]], target = 10', output: 'false' },
        ],
        constraints: ['1 <= m, n <= 300', '-10^9 <= matrix[i][j] <= 10^9'],
        testCases: [{ input: '3 3\n1 4 7\n2 5 8\n3 6 9\n5', expectedOutput: 'true' }, { input: '3 3\n1 4 7\n2 5 8\n3 6 9\n10', expectedOutput: 'false' }],
        starterCode: {
          python: 'r, c = map(int, input().split())\nmatrix = [list(map(int, input().split())) for _ in range(r)]\ntarget = int(input())\n# Print "true" or "false"',
          java: 'import java.util.*;\npublic class Solution {\n    public static void main(String[] args) {\n        // Read matrix and target, print "true" or "false"\n    }\n}',
          cpp: '#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    // Read matrix and target, print "true" or "false"\n    return 0;\n}',
        },
      }),
    ],
  },

  // ─── 11. Strings ───
  {
    id: 'strings', title: 'Strings', icon: '📝', color: 'green', order: 11,
    prerequisites: [], nextTopics: [], estimatedHours: 4,
    definition: 'Strings are sequences of characters. They support operations like concatenation, slicing, searching, and pattern matching. In most languages, strings are immutable.',
    analogy: 'A string is like a necklace of beads — each bead is a character, and you can examine, rearrange, or count them.',
    whyUseIt: 'String manipulation is essential for text processing, parsing, validation, and is one of the most common interview topics.',
    theoryLevels: {
      beginner: {
        title: 'String Basics & Operations',
        content: `Strings are sequences of characters. Key operations:
• Length: len(s), s.length(), s.size()
• Access: s[i] — access character at index i
• Slicing: s[start:end] — substring
• Concatenation: s1 + s2
• Comparison: s1 == s2 (content equality)
• Immutability: In Python/Java, strings cannot be modified in-place

Common tasks: reverse a string, check palindrome, count character frequency.`,
        codeExample: {
          python: `s = "hello world"
print(len(s))         # 11
print(s[0])           # 'h'
print(s[0:5])         # 'hello'
print(s[::-1])        # 'dlrow olleh' (reverse)

# Check palindrome
def is_palindrome(s):
    s = s.lower().replace(" ", "")
    return s == s[::-1]

print(is_palindrome("racecar"))  # True

# Character frequency
from collections import Counter
freq = Counter("banana")
print(freq)  # {'a': 3, 'n': 2, 'b': 1}`,
          java: `String s = "hello world";
System.out.println(s.length());      // 11
System.out.println(s.charAt(0));     // 'h'
System.out.println(s.substring(0,5)); // "hello"

// Reverse
String rev = new StringBuilder(s).reverse().toString();

// Palindrome check
public boolean isPalindrome(String s) {
    s = s.toLowerCase().replaceAll("[^a-z0-9]", "");
    int l = 0, r = s.length() - 1;
    while (l < r) {
        if (s.charAt(l++) != s.charAt(r--)) return false;
    }
    return true;
}`,
          cpp: `#include <string>
#include <algorithm>
using namespace std;

string s = "hello world";
cout << s.length();    // 11
cout << s[0];          // 'h'
cout << s.substr(0,5); // "hello"

// Reverse
string rev = s;
reverse(rev.begin(), rev.end());

// Palindrome
bool isPalindrome(string s) {
    int l = 0, r = s.size() - 1;
    while (l < r) {
        if (s[l++] != s[r--]) return false;
    }
    return true;
}`,
        },
      },
      intermediate: {
        title: 'Pattern Matching & Anagrams',
        content: `Intermediate string techniques:

Anagram detection: Two strings are anagrams if they have the same character frequencies. Use a frequency map or sort both and compare.

Sliding window on strings: Find the longest substring without repeating characters, or check if one string is a permutation of a substring of another.

String hashing: Convert strings to numbers for fast comparison (Rabin-Karp).`,
        codeExample: {
          python: `# Check anagram
def is_anagram(s, t):
    return sorted(s) == sorted(t)

# Longest substring without repeating chars
def longest_unique(s):
    char_set = set()
    left = max_len = 0
    for right in range(len(s)):
        while s[right] in char_set:
            char_set.remove(s[left])
            left += 1
        char_set.add(s[right])
        max_len = max(max_len, right - left + 1)
    return max_len

print(longest_unique("abcabcbb"))  # 3 ("abc")

# Group anagrams
from collections import defaultdict
def group_anagrams(strs):
    groups = defaultdict(list)
    for s in strs:
        key = tuple(sorted(s))
        groups[key].append(s)
    return list(groups.values())`,
          java: `// Anagram check using frequency array
public boolean isAnagram(String s, String t) {
    if (s.length() != t.length()) return false;
    int[] count = new int[26];
    for (char c : s.toCharArray()) count[c - 'a']++;
    for (char c : t.toCharArray()) count[c - 'a']--;
    for (int c : count) if (c != 0) return false;
    return true;
}

// Longest substring without repeating characters
public int lengthOfLongestSubstring(String s) {
    Set<Character> set = new HashSet<>();
    int left = 0, max = 0;
    for (int right = 0; right < s.length(); right++) {
        while (set.contains(s.charAt(right)))
            set.remove(s.charAt(left++));
        set.add(s.charAt(right));
        max = Math.max(max, right - left + 1);
    }
    return max;
}`,
          cpp: `bool isAnagram(string s, string t) {
    sort(s.begin(), s.end());
    sort(t.begin(), t.end());
    return s == t;
}

int lengthOfLongestSubstring(string s) {
    unordered_set<char> charSet;
    int left = 0, maxLen = 0;
    for (int right = 0; right < (int)s.size(); right++) {
        while (charSet.count(s[right]))
            charSet.erase(s[left++]);
        charSet.insert(s[right]);
        maxLen = max(maxLen, right - left + 1);
    }
    return maxLen;
}`,
        },
      },
      advanced: {
        title: 'KMP Algorithm & Z-Function',
        content: `KMP (Knuth-Morris-Pratt) finds pattern matches in O(n+m) by precomputing a "failure function" (longest prefix suffix array).

Z-function: Z[i] = length of the longest substring starting at i that is also a prefix. Useful for pattern matching and string compression.

These algorithms avoid the O(n×m) brute-force approach by never re-scanning characters.`,
        codeExample: {
          python: `# KMP pattern matching
def kmp_search(text, pattern):
    # Build failure function
    lps = [0] * len(pattern)
    j = 0
    for i in range(1, len(pattern)):
        while j > 0 and pattern[i] != pattern[j]:
            j = lps[j-1]
        if pattern[i] == pattern[j]:
            j += 1
        lps[i] = j

    # Search
    j = 0
    results = []
    for i in range(len(text)):
        while j > 0 and text[i] != pattern[j]:
            j = lps[j-1]
        if text[i] == pattern[j]:
            j += 1
        if j == len(pattern):
            results.append(i - j + 1)
            j = lps[j-1]
    return results

print(kmp_search("aabaabaa", "aab"))  # [0, 3]`,
          java: `// KMP Search
public List<Integer> kmpSearch(String text, String pattern) {
    int[] lps = computeLPS(pattern);
    List<Integer> result = new ArrayList<>();
    int j = 0;
    for (int i = 0; i < text.length(); i++) {
        while (j > 0 && text.charAt(i) != pattern.charAt(j))
            j = lps[j-1];
        if (text.charAt(i) == pattern.charAt(j)) j++;
        if (j == pattern.length()) {
            result.add(i - j + 1);
            j = lps[j-1];
        }
    }
    return result;
}`,
          cpp: `vector<int> kmpSearch(string text, string pattern) {
    int n = text.size(), m = pattern.size();
    vector<int> lps(m, 0), result;
    for (int i = 1, j = 0; i < m; ) {
        if (pattern[i] == pattern[j]) lps[i++] = ++j;
        else if (j) j = lps[j-1];
        else lps[i++] = 0;
    }
    for (int i = 0, j = 0; i < n; ) {
        if (text[i] == pattern[j]) { i++; j++; }
        if (j == m) { result.push_back(i-j); j = lps[j-1]; }
        else if (i < n && text[i] != pattern[j]) {
            if (j) j = lps[j-1]; else i++;
        }
    }
    return result;
}`,
        },
      },
    },
    timeComplexity: [
      { operation: 'Access char', best: 'O(1)', average: 'O(1)', worst: 'O(1)' },
      { operation: 'Concatenation', best: 'O(n)', average: 'O(n)', worst: 'O(n)' },
      { operation: 'Substring search', best: 'O(n)', average: 'O(n)', worst: 'O(n×m)' },
      { operation: 'KMP search', best: 'O(n+m)', average: 'O(n+m)', worst: 'O(n+m)' },
    ],
    spaceComplexity: 'O(n)',
    codeExamples: { python: '# See theory levels', java: '// See theory levels', cpp: '// See theory levels' },
    problems: [
      mkProblem('reverse-string', 'Reverse String', 'easy', 'Reverse a string in-place.', {
        examples: [{ input: 's = "hello"', output: 'olleh' }],
        constraints: ['1 <= s.length <= 10^5'],
        testCases: [{ input: 'hello', expectedOutput: 'olleh' }, { input: 'ab', expectedOutput: 'ba' }],
        starterCode: { python: 's = input()\n# Print the reversed string', java: 'import java.util.Scanner;\npublic class Solution {\n    public static void main(String[] args) {\n        String s = new Scanner(System.in).nextLine();\n        // Print reversed\n    }\n}', cpp: '#include <iostream>\n#include <string>\nusing namespace std;\nint main() {\n    string s;\n    cin >> s;\n    // Print reversed\n    return 0;\n}' },
      }),
      mkProblem('valid-anagram', 'Valid Anagram', 'easy', 'Check if two strings are anagrams of each other (contain the same characters with the same frequencies).', {
        examples: [{ input: 's = "anagram", t = "nagaram"', output: 'true' }, { input: 's = "rat", t = "car"', output: 'false' }],
        constraints: ['1 <= s.length, t.length <= 5 × 10^4', 'Strings contain only lowercase English letters'],
        testCases: [{ input: 'anagram\nnagaram', expectedOutput: 'true' }, { input: 'rat\ncar', expectedOutput: 'false' }],
        starterCode: { python: 's = input()\nt = input()\n# Print "true" or "false"', java: 'import java.util.Scanner;\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s = sc.nextLine(), t = sc.nextLine();\n        // Print "true" or "false"\n    }\n}', cpp: '#include <iostream>\n#include <string>\nusing namespace std;\nint main() {\n    string s, t;\n    cin >> s >> t;\n    // Print "true" or "false"\n    return 0;\n}' },
      }),
      mkProblem('longest-unique-substring', 'Longest Substring Without Repeating Characters', 'medium', 'Find the length of the longest substring without repeating characters.', {
        examples: [{ input: 's = "abcabcbb"', output: '3', explanation: 'The answer is "abc", length 3.' }, { input: 's = "bbbbb"', output: '1' }],
        constraints: ['0 <= s.length <= 5 × 10^4', 'String contains English letters, digits, symbols'],
        testCases: [{ input: 'abcabcbb', expectedOutput: '3' }, { input: 'bbbbb', expectedOutput: '1' }, { input: 'pwwkew', expectedOutput: '3' }],
        starterCode: { python: 's = input()\n# Print the length', java: 'import java.util.Scanner;\npublic class Solution {\n    public static void main(String[] args) {\n        String s = new Scanner(System.in).nextLine();\n        // Print the length\n    }\n}', cpp: '#include <iostream>\n#include <string>\nusing namespace std;\nint main() {\n    string s;\n    cin >> s;\n    // Print the length\n    return 0;\n}' },
      }),
      mkProblem('group-anagrams', 'Group Anagrams', 'medium', 'Group an array of strings into anagram groups. Strings that are anagrams go together.', {
        examples: [{ input: 'strs = ["eat","tea","tan","ate","nat","bat"]', output: '[["eat","tea","ate"],["tan","nat"],["bat"]]' }],
        constraints: ['1 <= strs.length <= 10^4', '0 <= strs[i].length <= 100'],
        testCases: [{ input: '6\neat tea tan ate nat bat', expectedOutput: 'eat tea ate\ntan nat\nbat' }],
        starterCode: { python: 'n = int(input())\nstrs = input().split()\n# Print each group on a line', java: 'import java.util.*;\npublic class Solution {\n    public static void main(String[] args) {\n        // Read strings and group anagrams\n    }\n}', cpp: '#include <iostream>\n#include <vector>\n#include <string>\nusing namespace std;\nint main() {\n    // Read strings and group anagrams\n    return 0;\n}' },
      }),
      mkProblem('kmp-pattern-match', 'Pattern Matching (KMP)', 'hard', 'Implement KMP algorithm to find all occurrences of a pattern in a text. Print starting indices.', {
        examples: [{ input: 'text = "aabaabaa", pattern = "aab"', output: '0 3', explanation: 'Pattern "aab" found at indices 0 and 3.' }],
        constraints: ['1 <= text.length <= 10^5', '1 <= pattern.length <= text.length'],
        testCases: [{ input: 'aabaabaa\naab', expectedOutput: '0 3' }, { input: 'abcdef\nxyz', expectedOutput: '-1' }],
        starterCode: { python: 'text = input()\npattern = input()\n# Print indices or -1 if not found', java: 'import java.util.*;\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String text = sc.nextLine(), pattern = sc.nextLine();\n        // Print indices or -1\n    }\n}', cpp: '#include <iostream>\n#include <string>\n#include <vector>\nusing namespace std;\nint main() {\n    string text, pattern;\n    cin >> text >> pattern;\n    // Print indices or -1\n    return 0;\n}' },
      }),
    ],
  },

  // ─── 12. Bit Manipulation ───
  {
    id: 'bit-manipulation', title: 'Bit Manipulation', icon: '🔢', color: 'cyan', order: 12,
    prerequisites: [], nextTopics: [], estimatedHours: 3,
    definition: 'Bit manipulation operates directly on binary representations of numbers using bitwise operators (&, |, ^, ~, <<, >>).',
    analogy: 'Bits are like light switches — each one is either on (1) or off (0). Bit manipulation flips, checks, and combines these switches efficiently.',
    whyUseIt: 'Bitwise operations are O(1) and memory-efficient. Used in cryptography, compression, network protocols, and competitive programming.',
    theoryLevels: {
      beginner: {
        title: 'Binary Representation & Basic Operations',
        content: `Every number is stored as binary. Bitwise operators:
• AND (&): Both bits 1 → 1
• OR (|): Either bit 1 → 1
• XOR (^): Different bits → 1, same → 0
• NOT (~): Flip all bits
• Left shift (<<): Multiply by 2
• Right shift (>>): Divide by 2

Key tricks:
• Check if even: n & 1 == 0
• Check power of 2: n & (n-1) == 0`,
        codeExample: {
          python: `n = 13  # binary: 1101
print(bin(n))       # '0b1101'
print(n & 1)        # 1 (odd)
print(n >> 1)       # 6 (divide by 2)
print(n << 1)       # 26 (multiply by 2)

# Check power of 2
def is_power_of_2(n):
    return n > 0 and (n & (n-1)) == 0

print(is_power_of_2(16))  # True
print(is_power_of_2(18))  # False

# Count set bits (1s)
def count_bits(n):
    count = 0
    while n:
        count += n & 1
        n >>= 1
    return count
print(count_bits(13))  # 3`,
          java: `int n = 13; // 1101
System.out.println(Integer.toBinaryString(n)); // "1101"
System.out.println(n & 1);        // 1 (odd)
System.out.println(n >> 1);       // 6
System.out.println(n << 1);       // 26

boolean isPowerOf2 = n > 0 && (n & (n-1)) == 0;
int bitCount = Integer.bitCount(n); // 3`,
          cpp: `int n = 13;
cout << (n & 1) << endl;  // 1 (odd)
cout << (n >> 1) << endl; // 6
cout << (n << 1) << endl; // 26

bool isPow2 = n > 0 && (n & (n-1)) == 0;
int bits = __builtin_popcount(n); // 3`,
        },
      },
      intermediate: {
        title: 'Set, Clear, Toggle Bits',
        content: `Manipulate individual bits at position i:
• Set bit: n | (1 << i) — forces bit i to 1
• Clear bit: n & ~(1 << i) — forces bit i to 0
• Toggle bit: n ^ (1 << i) — flips bit i
• Check bit: (n >> i) & 1 — returns bit i

XOR properties:
• a ^ a = 0 (cancel)
• a ^ 0 = a (identity)
• Find the single non-duplicate in an array by XOR-ing all elements.`,
        codeExample: {
          python: `# Bit manipulation at position i
def set_bit(n, i):    return n | (1 << i)
def clear_bit(n, i):  return n & ~(1 << i)
def toggle_bit(n, i): return n ^ (1 << i)
def check_bit(n, i):  return (n >> i) & 1

n = 10  # 1010
print(bin(set_bit(n, 0)))    # 0b1011 (11)
print(bin(clear_bit(n, 1)))  # 0b1000 (8)

# Find single number (all others appear twice)
def single_number(nums):
    result = 0
    for n in nums:
        result ^= n
    return result

print(single_number([2, 3, 2, 4, 4]))  # 3`,
          java: `// Single number using XOR
public int singleNumber(int[] nums) {
    int result = 0;
    for (int n : nums) result ^= n;
    return result;
}

// Set/Clear/Toggle
int setBit(int n, int i)    { return n | (1 << i); }
int clearBit(int n, int i)  { return n & ~(1 << i); }
int toggleBit(int n, int i) { return n ^ (1 << i); }`,
          cpp: `int singleNumber(vector<int>& nums) {
    int result = 0;
    for (int n : nums) result ^= n;
    return result;
}

int setBit(int n, int i)    { return n | (1 << i); }
int clearBit(int n, int i)  { return n & ~(1 << i); }
int toggleBit(int n, int i) { return n ^ (1 << i); }`,
        },
      },
      advanced: {
        title: 'Power Set & Bit DP',
        content: `Generate all subsets using bitmask: for a set of n elements, iterate from 0 to 2^n-1. Each number's binary representation tells which elements to include.

Bitmask DP uses bits to represent states. Example: Traveling Salesman Problem — dp[mask] represents the minimum cost to visit all cities in the bitmask.

Brian Kernighan's algorithm: n & (n-1) removes the lowest set bit — useful for counting bits in O(k) where k = number of set bits.`,
        codeExample: {
          python: `# Generate all subsets using bitmask
def power_set(nums):
    n = len(nums)
    subsets = []
    for mask in range(1 << n):  # 0 to 2^n - 1
        subset = []
        for i in range(n):
            if mask & (1 << i):
                subset.append(nums[i])
        subsets.append(subset)
    return subsets

print(power_set([1, 2, 3]))
# [[], [1], [2], [1,2], [3], [1,3], [2,3], [1,2,3]]

# Count bits using Brian Kernighan's
def count_bits(n):
    count = 0
    while n:
        n &= (n - 1)  # remove lowest set bit
        count += 1
    return count`,
          java: `// Power set
public List<List<Integer>> subsets(int[] nums) {
    List<List<Integer>> result = new ArrayList<>();
    int n = nums.length;
    for (int mask = 0; mask < (1 << n); mask++) {
        List<Integer> subset = new ArrayList<>();
        for (int i = 0; i < n; i++)
            if ((mask & (1 << i)) != 0)
                subset.add(nums[i]);
        result.add(subset);
    }
    return result;
}`,
          cpp: `vector<vector<int>> subsets(vector<int>& nums) {
    int n = nums.size();
    vector<vector<int>> result;
    for (int mask = 0; mask < (1 << n); mask++) {
        vector<int> subset;
        for (int i = 0; i < n; i++)
            if (mask & (1 << i))
                subset.push_back(nums[i]);
        result.push_back(subset);
    }
    return result;
}`,
        },
      },
    },
    timeComplexity: [
      { operation: 'Bitwise op', best: 'O(1)', average: 'O(1)', worst: 'O(1)' },
      { operation: 'Count bits', best: 'O(1)', average: 'O(k)', worst: 'O(log n)' },
      { operation: 'Power set', best: 'O(2^n)', average: 'O(2^n)', worst: 'O(2^n)' },
    ],
    spaceComplexity: 'O(1) for basic ops, O(2^n) for subsets',
    codeExamples: { python: '# See theory levels', java: '// See theory levels', cpp: '// See theory levels' },
    problems: [
      mkProblem('count-set-bits', 'Count Set Bits', 'easy', 'Count the number of 1-bits in a number\'s binary representation.', {
        examples: [{ input: 'n = 13', output: '3', explanation: '13 = 1101 in binary, three 1-bits.' }],
        constraints: ['0 <= n <= 2^31 - 1'],
        testCases: [{ input: '13', expectedOutput: '3' }, { input: '0', expectedOutput: '0' }, { input: '255', expectedOutput: '8' }],
        starterCode: { python: 'n = int(input())\n# Print the count of set bits', java: 'import java.util.Scanner;\npublic class Solution {\n    public static void main(String[] args) {\n        int n = new Scanner(System.in).nextInt();\n        // Print count of 1-bits\n    }\n}', cpp: '#include <iostream>\nusing namespace std;\nint main() {\n    int n;\n    cin >> n;\n    // Print count of 1-bits\n    return 0;\n}' },
      }),
      mkProblem('single-number', 'Single Number', 'easy', 'Find the element that appears only once when all others appear twice.', {
        examples: [{ input: 'nums = [4,1,2,1,2]', output: '4' }],
        constraints: ['1 <= nums.length <= 3 × 10^4', 'Each element appears twice except one'],
        testCases: [{ input: '5\n4 1 2 1 2', expectedOutput: '4' }, { input: '3\n2 2 1', expectedOutput: '1' }],
        starterCode: { python: 'n = int(input())\nnums = list(map(int, input().split()))\n# Print the single number', java: 'import java.util.*;\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        // Print single number\n    }\n}', cpp: '#include <iostream>\nusing namespace std;\nint main() {\n    int n;\n    cin >> n;\n    // Read array, print single number\n    return 0;\n}' },
      }),
      mkProblem('power-set-bits', 'Generate Power Set', 'medium', 'Generate all subsets of a set using bitmask. Print each subset on a line.', {
        examples: [{ input: 'nums = [1,2,3]', output: '[]\n[1]\n[2]\n[1,2]\n[3]\n[1,3]\n[2,3]\n[1,2,3]' }],
        constraints: ['1 <= nums.length <= 10', '-10 <= nums[i] <= 10', 'All elements are unique'],
        testCases: [{ input: '3\n1 2 3', expectedOutput: '\n1\n2\n1 2\n3\n1 3\n2 3\n1 2 3' }],
        starterCode: { python: 'n = int(input())\nnums = list(map(int, input().split()))\n# Print all subsets, one per line', java: 'import java.util.*;\npublic class Solution {\n    public static void main(String[] args) {\n        // Read array, print all subsets\n    }\n}', cpp: '#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    // Read array, print all subsets\n    return 0;\n}' },
      }),
      mkProblem('two-non-repeating', 'Two Non-Repeating Elements', 'hard', 'Find two elements that appear once when all others appear twice. Use XOR and bit manipulation.', {
        examples: [{ input: 'nums = [1,2,3,2,1,4]', output: '3 4', explanation: '3 and 4 appear once.' }],
        constraints: ['2 <= nums.length <= 3 × 10^4', 'Exactly two elements appear once'],
        testCases: [{ input: '6\n1 2 3 2 1 4', expectedOutput: '3 4' }],
        starterCode: { python: 'n = int(input())\nnums = list(map(int, input().split()))\n# Print two unique numbers in ascending order', java: 'import java.util.*;\npublic class Solution {\n    public static void main(String[] args) {\n        // Print two unique numbers\n    }\n}', cpp: '#include <iostream>\nusing namespace std;\nint main() {\n    // Print two unique numbers\n    return 0;\n}' },
      }),
    ],
  },

  // ─── 13. OOPs ───
  {
    id: 'oops', title: 'OOPs', icon: '🧩', color: 'purple', order: 13,
    prerequisites: [], nextTopics: [], estimatedHours: 4,
    definition: 'Object-Oriented Programming organizes code into classes and objects with four pillars: Encapsulation, Abstraction, Inheritance, and Polymorphism.',
    analogy: 'OOP is like building with LEGO — each class is a blueprint for a type of brick, and objects are the actual bricks you snap together.',
    whyUseIt: 'OOP enables code reuse, modularity, and real-world modeling. Most large-scale software (games, web apps, operating systems) uses OOP.',
    theoryLevels: {
      beginner: {
        title: 'Classes, Objects & Constructors',
        content: `A class is a blueprint. An object is an instance of that class.

Key concepts:
• Class: defines attributes (data) and methods (behavior)
• Constructor: special method called when creating an object (__init__, constructor)
• self/this: reference to the current object
• Attributes: variables belonging to an object
• Methods: functions belonging to a class`,
        codeExample: {
          python: `class Dog:
    def __init__(self, name, breed):
        self.name = name
        self.breed = breed
        self.tricks = []

    def learn_trick(self, trick):
        self.tricks.append(trick)

    def show_tricks(self):
        return f"{self.name} knows: {', '.join(self.tricks)}"

buddy = Dog("Buddy", "Golden Retriever")
buddy.learn_trick("sit")
buddy.learn_trick("shake")
print(buddy.show_tricks())  # Buddy knows: sit, shake`,
          java: `class Dog {
    String name, breed;
    List<String> tricks = new ArrayList<>();

    Dog(String name, String breed) {
        this.name = name;
        this.breed = breed;
    }

    void learnTrick(String trick) { tricks.add(trick); }
    String showTricks() { return name + " knows: " + String.join(", ", tricks); }
}

Dog buddy = new Dog("Buddy", "Golden Retriever");
buddy.learnTrick("sit");
System.out.println(buddy.showTricks());`,
          cpp: `#include <iostream>
#include <vector>
#include <string>
using namespace std;

class Dog {
public:
    string name, breed;
    vector<string> tricks;

    Dog(string n, string b) : name(n), breed(b) {}
    void learnTrick(string t) { tricks.push_back(t); }
    void showTricks() {
        cout << name << " knows: ";
        for (auto& t : tricks) cout << t << " ";
    }
};`,
        },
      },
      intermediate: {
        title: 'Inheritance & Polymorphism',
        content: `Inheritance: A child class inherits attributes/methods from a parent class, then adds or overrides them.

Polymorphism: Different classes can have methods with the same name but different implementations. "Many forms."

Method overriding: Child class redefines a parent's method.
Method overloading: Same method name, different parameter lists (Java/C++).`,
        codeExample: {
          python: `class Animal:
    def __init__(self, name):
        self.name = name

    def speak(self):
        return "..."

class Dog(Animal):
    def speak(self):
        return f"{self.name} says Woof!"

class Cat(Animal):
    def speak(self):
        return f"{self.name} says Meow!"

# Polymorphism
animals = [Dog("Rex"), Cat("Whiskers"), Dog("Buddy")]
for animal in animals:
    print(animal.speak())
# Rex says Woof!
# Whiskers says Meow!
# Buddy says Woof!`,
          java: `abstract class Animal {
    String name;
    Animal(String name) { this.name = name; }
    abstract String speak();
}

class Dog extends Animal {
    Dog(String name) { super(name); }
    String speak() { return name + " says Woof!"; }
}

class Cat extends Animal {
    Cat(String name) { super(name); }
    String speak() { return name + " says Meow!"; }
}

// Polymorphism
Animal[] animals = {new Dog("Rex"), new Cat("Whiskers")};
for (Animal a : animals) System.out.println(a.speak());`,
          cpp: `class Animal {
public:
    string name;
    Animal(string n) : name(n) {}
    virtual string speak() = 0; // pure virtual
};

class Dog : public Animal {
public:
    Dog(string n) : Animal(n) {}
    string speak() override { return name + " says Woof!"; }
};

class Cat : public Animal {
public:
    Cat(string n) : Animal(n) {}
    string speak() override { return name + " says Meow!"; }
};`,
        },
      },
      advanced: {
        title: 'Design Patterns & SOLID Principles',
        content: `SOLID principles:
• S — Single Responsibility: One class, one job
• O — Open/Closed: Open for extension, closed for modification
• L — Liskov Substitution: Subtypes must be substitutable for base types
• I — Interface Segregation: Many specific interfaces > one general
• D — Dependency Inversion: Depend on abstractions, not concretions

Common patterns: Singleton (one instance), Factory (create objects without specifying class), Observer (publish/subscribe).`,
        codeExample: {
          python: `# Singleton pattern
class Database:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance.connection = "Connected"
        return cls._instance

db1 = Database()
db2 = Database()
print(db1 is db2)  # True — same instance

# Factory pattern
class Shape:
    @staticmethod
    def create(shape_type):
        if shape_type == "circle": return Circle()
        elif shape_type == "square": return Square()

# Observer pattern
class EventEmitter:
    def __init__(self):
        self.listeners = {}
    def on(self, event, callback):
        self.listeners.setdefault(event, []).append(callback)
    def emit(self, event, data=None):
        for cb in self.listeners.get(event, []):
            cb(data)`,
          java: `// Singleton
class Database {
    private static Database instance;
    private Database() {}
    public static Database getInstance() {
        if (instance == null) instance = new Database();
        return instance;
    }
}

// Factory
interface Shape { void draw(); }
class Circle implements Shape { public void draw() { System.out.println("Circle"); }}
class Square implements Shape { public void draw() { System.out.println("Square"); }}

class ShapeFactory {
    public static Shape create(String type) {
        return switch (type) {
            case "circle" -> new Circle();
            case "square" -> new Square();
            default -> throw new IllegalArgumentException();
        };
    }
}`,
          cpp: `// Singleton
class Database {
    static Database* instance;
    Database() {}
public:
    static Database* getInstance() {
        if (!instance) instance = new Database();
        return instance;
    }
};
Database* Database::instance = nullptr;

// Factory
class Shape {
public:
    virtual void draw() = 0;
    static unique_ptr<Shape> create(const string& type);
};`,
        },
      },
    },
    timeComplexity: [{ operation: 'Method call', best: 'O(1)', average: 'O(1)', worst: 'O(1)' }],
    spaceComplexity: 'O(1) per object + attributes',
    codeExamples: { python: '# See theory levels', java: '// See theory levels', cpp: '// See theory levels' },
    problems: [
      mkProblem('design-class', 'Design a Student Class', 'easy', 'Create a Student class with name, marks array, and a method to compute the average grade.', {
        examples: [{ input: 'name = "Alice", marks = [85, 90, 78]', output: 'Alice: 84.33', explanation: 'Average = (85+90+78)/3 = 84.33' }],
        constraints: ['1 <= marks.length <= 10', '0 <= marks[i] <= 100'],
        testCases: [{ input: 'Alice\n3\n85 90 78', expectedOutput: '84.33' }],
        starterCode: { python: 'name = input()\nn = int(input())\nmarks = list(map(int, input().split()))\n# Create Student class, compute and print average (2 decimal places)', java: 'import java.util.*;\npublic class Solution {\n    // Define Student class and compute average\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Read and print average\n    }\n}', cpp: '#include <iostream>\n#include <vector>\nusing namespace std;\n// Define Student class\nint main() {\n    // Read and print average\n    return 0;\n}' },
      }),
      mkProblem('inheritance-shape', 'Shape Hierarchy', 'medium', 'Design a Shape class with area() method. Create Circle and Rectangle subclasses. Compute and print areas.', {
        examples: [{ input: 'Circle r=5', output: '78.54', explanation: 'π × 5² ≈ 78.54' }],
        constraints: ['0 < dimensions <= 1000'],
        testCases: [{ input: 'circle 5', expectedOutput: '78.54' }, { input: 'rectangle 4 6', expectedOutput: '24.00' }],
        starterCode: { python: 'import math\nline = input().split()\n# Parse shape type and dimensions, print area (2 decimal places)', java: 'import java.util.*;\npublic class Solution {\n    // Define Shape hierarchy\n    public static void main(String[] args) {\n        // Parse and compute area\n    }\n}', cpp: '#include <iostream>\n#include <cmath>\nusing namespace std;\nint main() {\n    // Parse shape and compute area\n    return 0;\n}' },
      }),
      mkProblem('design-pattern', 'Implement Singleton', 'hard', 'Implement the Singleton pattern — only one instance should ever be created. Print the instance count.', {
        examples: [{ input: '3 getInstance calls', output: '1', explanation: 'Only one instance exists regardless of calls.' }],
        constraints: ['1 <= calls <= 100'],
        testCases: [{ input: '3', expectedOutput: '1' }],
        starterCode: { python: 'n = int(input())\n# Implement Singleton, create n instances, print unique count', java: 'import java.util.*;\npublic class Solution {\n    // Implement Singleton\n    public static void main(String[] args) {\n        // Create instances and verify singleton\n    }\n}', cpp: '#include <iostream>\nusing namespace std;\nint main() {\n    // Implement and verify singleton\n    return 0;\n}' },
      }),
    ],
  },

  // ─── 14. Recursion ───
  {
    id: 'recursion', title: 'Recursion', icon: '↩', color: 'amber', order: 14,
    prerequisites: [], nextTopics: [], estimatedHours: 5,
    definition: 'Recursion is a technique where a function calls itself to solve smaller subproblems. Every recursive solution has a base case (stopping condition) and a recursive case.',
    analogy: 'Imagine standing in a line and asking the person in front their position. They ask the person in front of them, and so on until person #1 says "I\'m first!"',
    whyUseIt: 'Recursion elegantly solves trees, divide-and-conquer, backtracking, and dynamic programming problems.',
    theoryLevels: {
      beginner: {
        title: 'Base Case, Factorial & Fibonacci',
        content: `Every recursive function needs:
1. Base case — when to stop (prevents infinite recursion)
2. Recursive case — breaks the problem into smaller pieces

The call stack stores each function call. Too many calls → stack overflow.

Start with simple examples: factorial (n! = n × (n-1)!), fibonacci, sum of array.`,
        codeExample: {
          python: `# Factorial: n! = n * (n-1)!
def factorial(n):
    if n <= 1: return 1     # base case
    return n * factorial(n-1)  # recursive case

print(factorial(5))  # 120

# Fibonacci
def fib(n):
    if n <= 1: return n
    return fib(n-1) + fib(n-2)

# Sum of array
def array_sum(arr):
    if not arr: return 0
    return arr[0] + array_sum(arr[1:])

print(array_sum([1,2,3,4,5]))  # 15`,
          java: `int factorial(int n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}

int fib(int n) {
    if (n <= 1) return n;
    return fib(n-1) + fib(n-2);
}`,
          cpp: `int factorial(int n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}

int fib(int n) {
    if (n <= 1) return n;
    return fib(n-1) + fib(n-2);
}`,
        },
      },
      intermediate: {
        title: 'Tower of Hanoi & Subset Generation',
        content: `Tower of Hanoi: Move n disks from source to destination using an auxiliary peg. Recursive approach: move n-1 disks to aux, move largest to dest, move n-1 from aux to dest.

Subset generation: For each element, either include it or exclude it. This creates a binary tree of choices with 2^n leaves.

Power computation: x^n = x^(n/2) * x^(n/2) gives O(log n).`,
        codeExample: {
          python: `# Tower of Hanoi
def hanoi(n, source, dest, aux):
    if n == 1:
        print(f"Move disk 1 from {source} to {dest}")
        return
    hanoi(n-1, source, aux, dest)
    print(f"Move disk {n} from {source} to {dest}")
    hanoi(n-1, aux, dest, source)

hanoi(3, 'A', 'C', 'B')

# Generate all subsets
def subsets(nums, i=0, current=[]):
    if i == len(nums):
        print(current)
        return
    # Include nums[i]
    subsets(nums, i+1, current + [nums[i]])
    # Exclude nums[i]
    subsets(nums, i+1, current)

subsets([1, 2, 3])`,
          java: `void hanoi(int n, char src, char dest, char aux) {
    if (n == 1) { System.out.println("Move 1: " + src + " -> " + dest); return; }
    hanoi(n-1, src, aux, dest);
    System.out.println("Move " + n + ": " + src + " -> " + dest);
    hanoi(n-1, aux, dest, src);
}

void subsets(int[] nums, int i, List<Integer> curr, List<List<Integer>> res) {
    if (i == nums.length) { res.add(new ArrayList<>(curr)); return; }
    curr.add(nums[i]); subsets(nums, i+1, curr, res); curr.remove(curr.size()-1);
    subsets(nums, i+1, curr, res);
}`,
          cpp: `void hanoi(int n, char src, char dest, char aux) {
    if (n == 1) { cout << "Move 1: " << src << " -> " << dest << endl; return; }
    hanoi(n-1, src, aux, dest);
    cout << "Move " << n << ": " << src << " -> " << dest << endl;
    hanoi(n-1, aux, dest, src);
}`,
        },
      },
      advanced: {
        title: 'Memoization & Tree Recursion',
        content: `Memoization stores results of expensive function calls to avoid recomputation. Fibonacci with memoization: O(n) instead of O(2^n).

Tree recursion occurs when a function makes multiple recursive calls (like fib). Visualize as a tree — each node spawns children.

Tail recursion: Recursive call is the last operation. Some compilers optimize it to a loop (tail call optimization).`,
        codeExample: {
          python: `# Memoized Fibonacci — O(n) instead of O(2^n)
from functools import lru_cache

@lru_cache(maxsize=None)
def fib(n):
    if n <= 1: return n
    return fib(n-1) + fib(n-2)

print(fib(100))  # 354224848179261915075 (instant!)

# Manual memoization
def fib_memo(n, memo={}):
    if n in memo: return memo[n]
    if n <= 1: return n
    memo[n] = fib_memo(n-1, memo) + fib_memo(n-2, memo)
    return memo[n]

# Tail recursion (Python doesn't optimize, but concept matters)
def factorial_tail(n, acc=1):
    if n <= 1: return acc
    return factorial_tail(n-1, n * acc)`,
          java: `// Memoized Fibonacci
int[] memo = new int[101];
Arrays.fill(memo, -1);

int fib(int n) {
    if (n <= 1) return n;
    if (memo[n] != -1) return memo[n];
    return memo[n] = fib(n-1) + fib(n-2);
}`,
          cpp: `// Memoized Fibonacci
unordered_map<int, long long> memo;
long long fib(int n) {
    if (n <= 1) return n;
    if (memo.count(n)) return memo[n];
    return memo[n] = fib(n-1) + fib(n-2);
}`,
        },
      },
    },
    timeComplexity: [
      { operation: 'Factorial', best: 'O(n)', average: 'O(n)', worst: 'O(n)' },
      { operation: 'Fibonacci (naive)', best: 'O(2^n)', average: 'O(2^n)', worst: 'O(2^n)' },
      { operation: 'Fibonacci (memo)', best: 'O(n)', average: 'O(n)', worst: 'O(n)' },
      { operation: 'Tower of Hanoi', best: 'O(2^n)', average: 'O(2^n)', worst: 'O(2^n)' },
    ],
    spaceComplexity: 'O(n) call stack',
    codeExamples: { python: '# See theory levels', java: '// See theory levels', cpp: '// See theory levels' },
    problems: [
      mkProblem('power-function', 'Power Function', 'easy', 'Compute x^n recursively in O(log n) using fast exponentiation.', {
        examples: [{ input: 'x = 2, n = 10', output: '1024' }, { input: 'x = 3, n = 5', output: '243' }],
        constraints: ['-100 <= x <= 100', '0 <= n <= 30'],
        testCases: [{ input: '2 10', expectedOutput: '1024' }, { input: '3 5', expectedOutput: '243' }],
        starterCode: { python: 'x, n = map(int, input().split())\n# Print x^n', java: 'import java.util.*;\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int x = sc.nextInt(), n = sc.nextInt();\n        // Print x^n\n    }\n}', cpp: '#include <iostream>\nusing namespace std;\nint main() {\n    int x, n;\n    cin >> x >> n;\n    // Print x^n\n    return 0;\n}' },
      }),
      mkProblem('tower-of-hanoi', 'Tower of Hanoi', 'medium', 'Print all moves to solve Tower of Hanoi for n disks. Move from A to C using B as auxiliary.', {
        examples: [{ input: 'n = 2', output: 'Move disk 1 from A to B\nMove disk 2 from A to C\nMove disk 1 from B to C' }],
        constraints: ['1 <= n <= 15'],
        testCases: [{ input: '2', expectedOutput: 'Move disk 1 from A to B\nMove disk 2 from A to C\nMove disk 1 from B to C' }],
        starterCode: { python: 'n = int(input())\n# Print moves: "Move disk X from Y to Z"', java: 'import java.util.*;\npublic class Solution {\n    public static void main(String[] args) {\n        int n = new Scanner(System.in).nextInt();\n        // Print moves\n    }\n}', cpp: '#include <iostream>\nusing namespace std;\nint main() {\n    int n;\n    cin >> n;\n    // Print moves\n    return 0;\n}' },
      }),
      mkProblem('generate-subsets', 'Generate All Subsets', 'medium', 'Generate all subsets of a given set using recursion. Print each subset on a line.', {
        examples: [{ input: 'nums = [1,2,3]', output: '[1,2,3]\n[1,2]\n[1,3]\n[1]\n[2,3]\n[2]\n[3]\n[]' }],
        constraints: ['1 <= nums.length <= 10'],
        testCases: [{ input: '3\n1 2 3', expectedOutput: '1 2 3\n1 2\n1 3\n1\n2 3\n2\n3\n' }],
        starterCode: { python: 'n = int(input())\nnums = list(map(int, input().split()))\n# Print all subsets', java: 'import java.util.*;\npublic class Solution {\n    public static void main(String[] args) {\n        // Generate and print subsets\n    }\n}', cpp: '#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    // Generate and print subsets\n    return 0;\n}' },
      }),
      mkProblem('string-permutations', 'String Permutations', 'hard', 'Generate all permutations of a string. Print each permutation on a line in lexicographic order.', {
        examples: [{ input: 's = "abc"', output: 'abc\nacb\nbac\nbca\ncab\ncba' }],
        constraints: ['1 <= s.length <= 8', 'String contains unique lowercase letters'],
        testCases: [{ input: 'abc', expectedOutput: 'abc\nacb\nbac\nbca\ncab\ncba' }, { input: 'ab', expectedOutput: 'ab\nba' }],
        starterCode: { python: 's = input()\n# Print all permutations in lexicographic order', java: 'import java.util.*;\npublic class Solution {\n    public static void main(String[] args) {\n        String s = new Scanner(System.in).nextLine();\n        // Print permutations\n    }\n}', cpp: '#include <iostream>\n#include <string>\n#include <algorithm>\nusing namespace std;\nint main() {\n    string s;\n    cin >> s;\n    // Print permutations\n    return 0;\n}' },
      }),
    ],
  },

  // ─── 15. Divide & Conquer ───
  {
    id: 'divide-conquer', title: 'Divide & Conquer', icon: '✂️', color: 'green', order: 15,
    prerequisites: [], nextTopics: [], estimatedHours: 4,
    definition: 'Divide and Conquer breaks a problem into smaller subproblems, solves them independently, and combines the results.',
    analogy: 'Like sorting a deck of cards by splitting it in half, sorting each half, then merging them back together.',
    whyUseIt: 'Powers efficient algorithms like Merge Sort, Quick Sort, Binary Search, and Strassen\'s matrix multiplication.',
    theoryLevels: {
      beginner: {
        title: 'Binary Search & Concept',
        content: `The three steps of Divide & Conquer:
1. Divide: Split the problem into smaller subproblems
2. Conquer: Solve each subproblem recursively
3. Combine: Merge the solutions

Binary search is the simplest D&C: divide the sorted array in half, check middle, recurse on the relevant half. O(log n).`,
        codeExample: {
          python: `# Binary Search — O(log n)
def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1

arr = [1, 3, 5, 7, 9, 11, 13]
print(binary_search(arr, 7))   # 3
print(binary_search(arr, 10))  # -1`,
          java: `int binarySearch(int[] arr, int target) {
    int left = 0, right = arr.length - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) return mid;
        else if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}`,
          cpp: `int binarySearch(vector<int>& arr, int target) {
    int left = 0, right = arr.size() - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) return mid;
        else if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}`,
        },
      },
      intermediate: {
        title: 'Merge Sort & Quick Sort',
        content: `Merge Sort: Divide array in half → sort each half → merge sorted halves. Always O(n log n), stable, but O(n) extra space.

Quick Sort: Pick a pivot → partition array (smaller left, larger right) → recurse. Average O(n log n), worst O(n²) with bad pivot. In-place.

Choose Merge Sort when stability matters. Choose Quick Sort for average-case speed.`,
        codeExample: {
          python: `# Merge Sort
def merge_sort(arr):
    if len(arr) <= 1: return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)

def merge(left, right):
    result, i, j = [], 0, 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i]); i += 1
        else:
            result.append(right[j]); j += 1
    return result + left[i:] + right[j:]

# Quick Sort (Lomuto partition)
def quick_sort(arr, low=0, high=None):
    if high is None: high = len(arr) - 1
    if low < high:
        pi = partition(arr, low, high)
        quick_sort(arr, low, pi - 1)
        quick_sort(arr, pi + 1, high)

def partition(arr, low, high):
    pivot = arr[high]
    i = low - 1
    for j in range(low, high):
        if arr[j] < pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i+1], arr[high] = arr[high], arr[i+1]
    return i + 1`,
          java: `// Quick Sort
void quickSort(int[] arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}

int partition(int[] arr, int low, int high) {
    int pivot = arr[high], i = low - 1;
    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            int tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
        }
    }
    int tmp = arr[i+1]; arr[i+1] = arr[high]; arr[high] = tmp;
    return i + 1;
}`,
          cpp: `int partition(vector<int>& arr, int low, int high) {
    int pivot = arr[high], i = low - 1;
    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) swap(arr[++i], arr[j]);
    }
    swap(arr[i+1], arr[high]);
    return i + 1;
}

void quickSort(vector<int>& arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}`,
        },
      },
      advanced: {
        title: 'Closest Pair & Matrix Multiply',
        content: `Closest pair of points: Divide points by x-coordinate, solve each half recursively, then check the strip near the dividing line. O(n log n).

Strassen's matrix multiplication: Multiply two n×n matrices in O(n^2.81) instead of O(n³) by reducing 8 sub-multiplications to 7.

Count inversions using modified merge sort — count how many pairs (i,j) have i < j but arr[i] > arr[j].`,
        codeExample: {
          python: `# Count inversions using merge sort — O(n log n)
def count_inversions(arr):
    if len(arr) <= 1:
        return arr, 0
    mid = len(arr) // 2
    left, left_inv = count_inversions(arr[:mid])
    right, right_inv = count_inversions(arr[mid:])
    merged, split_inv = merge_count(left, right)
    return merged, left_inv + right_inv + split_inv

def merge_count(left, right):
    result, inversions = [], 0
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i]); i += 1
        else:
            result.append(right[j]); j += 1
            inversions += len(left) - i  # all remaining left > right[j]
    result += left[i:] + right[j:]
    return result, inversions

_, inv = count_inversions([5, 3, 2, 4, 1])
print(f"Inversions: {inv}")  # 8`,
          java: `// Count inversions
long mergeCount(int[] arr, int l, int r) {
    if (l >= r) return 0;
    int mid = (l + r) / 2;
    long count = mergeCount(arr, l, mid) + mergeCount(arr, mid+1, r);
    int[] temp = new int[r - l + 1];
    int i = l, j = mid+1, k = 0;
    while (i <= mid && j <= r) {
        if (arr[i] <= arr[j]) temp[k++] = arr[i++];
        else { temp[k++] = arr[j++]; count += mid - i + 1; }
    }
    while (i <= mid) temp[k++] = arr[i++];
    while (j <= r) temp[k++] = arr[j++];
    System.arraycopy(temp, 0, arr, l, temp.length);
    return count;
}`,
          cpp: `long long mergeCount(vector<int>& arr, int l, int r) {
    if (l >= r) return 0;
    int mid = (l + r) / 2;
    long long cnt = mergeCount(arr, l, mid) + mergeCount(arr, mid+1, r);
    vector<int> temp;
    int i = l, j = mid + 1;
    while (i <= mid && j <= r) {
        if (arr[i] <= arr[j]) temp.push_back(arr[i++]);
        else { temp.push_back(arr[j++]); cnt += mid - i + 1; }
    }
    while (i <= mid) temp.push_back(arr[i++]);
    while (j <= r) temp.push_back(arr[j++]);
    copy(temp.begin(), temp.end(), arr.begin() + l);
    return cnt;
}`,
        },
      },
    },
    timeComplexity: [
      { operation: 'Binary Search', best: 'O(1)', average: 'O(log n)', worst: 'O(log n)' },
      { operation: 'Merge Sort', best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
      { operation: 'Quick Sort', best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)' },
    ],
    spaceComplexity: 'O(n) for Merge Sort, O(log n) for Quick Sort',
    codeExamples: { python: '# See theory levels', java: '// See theory levels', cpp: '// See theory levels' },
    problems: [
      mkProblem('binary-search-impl', 'Binary Search', 'easy', 'Implement binary search on a sorted array. Return the index or -1 if not found.', {
        examples: [{ input: 'arr = [1,3,5,7,9], target = 5', output: '2' }, { input: 'arr = [1,3,5,7,9], target = 4', output: '-1' }],
        constraints: ['1 <= arr.length <= 10^4', '-10^4 <= arr[i] <= 10^4', 'Array is sorted'],
        testCases: [{ input: '5\n1 3 5 7 9\n5', expectedOutput: '2' }, { input: '5\n1 3 5 7 9\n4', expectedOutput: '-1' }],
        starterCode: { python: 'n = int(input())\narr = list(map(int, input().split()))\ntarget = int(input())\n# Print index or -1', java: 'import java.util.*;\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] arr = new int[n];\n        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();\n        int target = sc.nextInt();\n        // Print index or -1\n    }\n}', cpp: '#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n;\n    cin >> n;\n    vector<int> arr(n);\n    for (int i = 0; i < n; i++) cin >> arr[i];\n    int target;\n    cin >> target;\n    // Print index or -1\n    return 0;\n}' },
      }),
      mkProblem('merge-sort-impl', 'Merge Sort', 'medium', 'Implement merge sort and sort an array. Print the sorted result.', {
        examples: [{ input: 'arr = [38,27,43,3,9,82,10]', output: '3 9 10 27 38 43 82' }],
        constraints: ['1 <= arr.length <= 5 × 10^4'],
        testCases: [{ input: '7\n38 27 43 3 9 82 10', expectedOutput: '3 9 10 27 38 43 82' }],
        starterCode: { python: 'n = int(input())\narr = list(map(int, input().split()))\n# Implement merge sort and print sorted array', java: 'import java.util.*;\npublic class Solution {\n    public static void main(String[] args) {\n        // Implement merge sort\n    }\n}', cpp: '#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    // Implement merge sort\n    return 0;\n}' },
      }),
      mkProblem('count-inversions', 'Count Inversions', 'hard', 'Count the number of inversions in an array. An inversion is a pair (i,j) where i < j but arr[i] > arr[j].', {
        examples: [{ input: 'arr = [5,3,2,4,1]', output: '8' }],
        constraints: ['1 <= arr.length <= 10^5'],
        testCases: [{ input: '5\n5 3 2 4 1', expectedOutput: '8' }, { input: '5\n1 2 3 4 5', expectedOutput: '0' }],
        starterCode: { python: 'n = int(input())\narr = list(map(int, input().split()))\n# Print number of inversions', java: 'import java.util.*;\npublic class Solution {\n    public static void main(String[] args) {\n        // Count inversions using merge sort\n    }\n}', cpp: '#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    // Count inversions\n    return 0;\n}' },
      }),
    ],
  },

  // ─── 16. Backtracking ───
  {
    id: 'backtracking', title: 'Backtracking', icon: '🔙', color: 'cyan', order: 16,
    prerequisites: [], nextTopics: [], estimatedHours: 5,
    definition: 'Backtracking explores all possible solutions by building candidates incrementally and abandoning (backtracking from) candidates that fail constraints.',
    analogy: 'Like solving a maze — you try a path, hit a dead end, go back to the last junction, and try another path.',
    whyUseIt: 'Solves constraint satisfaction problems: N-Queens, Sudoku, permutations, combinations, and subset generation.',
    theoryLevels: {
      beginner: {
        title: 'Permutations & Combinations',
        content: `Backtracking is recursion with a "undo" step. The pattern:
1. Choose: Pick an option
2. Explore: Recurse with that choice
3. Unchoose: Undo the choice (backtrack)

Permutations: All possible orderings of elements.
Combinations: All possible selections of k elements from n.`,
        codeExample: {
          python: `# Generate all permutations
def permutations(nums):
    result = []
    def backtrack(path, remaining):
        if not remaining:
            result.append(path[:])
            return
        for i in range(len(remaining)):
            path.append(remaining[i])
            backtrack(path, remaining[:i] + remaining[i+1:])
            path.pop()  # backtrack!
    backtrack([], nums)
    return result

print(permutations([1, 2, 3]))

# Combinations: choose k from n
def combinations(n, k):
    result = []
    def backtrack(start, path):
        if len(path) == k:
            result.append(path[:])
            return
        for i in range(start, n+1):
            path.append(i)
            backtrack(i+1, path)
            path.pop()
    backtrack(1, [])
    return result`,
          java: `void permute(int[] nums, List<Integer> path, boolean[] used, List<List<Integer>> result) {
    if (path.size() == nums.length) { result.add(new ArrayList<>(path)); return; }
    for (int i = 0; i < nums.length; i++) {
        if (used[i]) continue;
        used[i] = true; path.add(nums[i]);
        permute(nums, path, used, result);
        path.remove(path.size()-1); used[i] = false;
    }
}`,
          cpp: `void permute(vector<int>& nums, vector<int>& path, vector<bool>& used, vector<vector<int>>& result) {
    if (path.size() == nums.size()) { result.push_back(path); return; }
    for (int i = 0; i < (int)nums.size(); i++) {
        if (used[i]) continue;
        used[i] = true; path.push_back(nums[i]);
        permute(nums, path, used, result);
        path.pop_back(); used[i] = false;
    }
}`,
        },
      },
      intermediate: {
        title: 'N-Queens & Sudoku Solver',
        content: `N-Queens: Place N queens on an N×N board so no two attack each other. Place one queen per row, checking column and diagonal constraints.

Sudoku Solver: Fill empty cells with digits 1-9, checking row, column, and 3×3 box constraints. Backtrack when no valid digit exists.`,
        codeExample: {
          python: `# N-Queens
def solve_nqueens(n):
    board = [['.' for _ in range(n)] for _ in range(n)]
    solutions = []
    cols, diag1, diag2 = set(), set(), set()

    def backtrack(row):
        if row == n:
            solutions.append([''.join(r) for r in board])
            return
        for col in range(n):
            if col in cols or (row-col) in diag1 or (row+col) in diag2:
                continue
            board[row][col] = 'Q'
            cols.add(col); diag1.add(row-col); diag2.add(row+col)
            backtrack(row + 1)
            board[row][col] = '.'
            cols.remove(col); diag1.remove(row-col); diag2.remove(row+col)

    backtrack(0)
    return solutions

print(f"4-Queens has {len(solve_nqueens(4))} solutions")  # 2`,
          java: `// N-Queens
void solveNQueens(int n, int row, Set<Integer> cols, Set<Integer> d1, Set<Integer> d2, char[][] board, List<List<String>> res) {
    if (row == n) { res.add(boardToList(board)); return; }
    for (int c = 0; c < n; c++) {
        if (cols.contains(c) || d1.contains(row-c) || d2.contains(row+c)) continue;
        board[row][c] = 'Q';
        cols.add(c); d1.add(row-c); d2.add(row+c);
        solveNQueens(n, row+1, cols, d1, d2, board, res);
        board[row][c] = '.';
        cols.remove(c); d1.remove(row-c); d2.remove(row+c);
    }
}`,
          cpp: `void solveNQueens(int n, int row, vector<bool>& cols, vector<bool>& d1, vector<bool>& d2,
                   vector<string>& board, vector<vector<string>>& res) {
    if (row == n) { res.push_back(board); return; }
    for (int c = 0; c < n; c++) {
        if (cols[c] || d1[row-c+n] || d2[row+c]) continue;
        board[row][c] = 'Q';
        cols[c] = d1[row-c+n] = d2[row+c] = true;
        solveNQueens(n, row+1, cols, d1, d2, board, res);
        board[row][c] = '.';
        cols[c] = d1[row-c+n] = d2[row+c] = false;
    }
}`,
        },
      },
      advanced: {
        title: 'Word Search & Graph Coloring',
        content: `Word Search: Given a 2D grid and a word, find if the word exists by moving to adjacent cells. Each cell can be used only once per path — backtrack by unmarking visited cells.

Graph Coloring: Assign colors to graph vertices so no two adjacent vertices share a color. The chromatic number is the minimum colors needed.

Pruning: Improve backtracking by detecting dead ends early (constraint propagation).`,
        codeExample: {
          python: `# Word Search in grid
def word_search(board, word):
    rows, cols = len(board), len(board[0])

    def backtrack(r, c, i):
        if i == len(word): return True
        if r < 0 or r >= rows or c < 0 or c >= cols: return False
        if board[r][c] != word[i]: return False

        temp = board[r][c]
        board[r][c] = '#'  # mark visited

        for dr, dc in [(0,1),(0,-1),(1,0),(-1,0)]:
            if backtrack(r+dr, c+dc, i+1):
                return True

        board[r][c] = temp  # backtrack!
        return False

    for r in range(rows):
        for c in range(cols):
            if backtrack(r, c, 0):
                return True
    return False`,
          java: `boolean wordSearch(char[][] board, String word) {
    for (int r = 0; r < board.length; r++)
        for (int c = 0; c < board[0].length; c++)
            if (dfs(board, word, r, c, 0)) return true;
    return false;
}

boolean dfs(char[][] board, String word, int r, int c, int i) {
    if (i == word.length()) return true;
    if (r < 0 || r >= board.length || c < 0 || c >= board[0].length) return false;
    if (board[r][c] != word.charAt(i)) return false;
    char tmp = board[r][c]; board[r][c] = '#';
    boolean found = dfs(board,word,r+1,c,i+1) || dfs(board,word,r-1,c,i+1)
                  || dfs(board,word,r,c+1,i+1) || dfs(board,word,r,c-1,i+1);
    board[r][c] = tmp;
    return found;
}`,
          cpp: `bool dfs(vector<vector<char>>& board, string& word, int r, int c, int i) {
    if (i == (int)word.size()) return true;
    if (r < 0 || r >= (int)board.size() || c < 0 || c >= (int)board[0].size()) return false;
    if (board[r][c] != word[i]) return false;
    char tmp = board[r][c]; board[r][c] = '#';
    bool found = dfs(board,word,r+1,c,i+1) || dfs(board,word,r-1,c,i+1)
              || dfs(board,word,r,c+1,i+1) || dfs(board,word,r,c-1,i+1);
    board[r][c] = tmp;
    return found;
}`,
        },
      },
    },
    timeComplexity: [
      { operation: 'Permutations', best: 'O(n!)', average: 'O(n!)', worst: 'O(n!)' },
      { operation: 'N-Queens', best: 'O(n!)', average: 'O(n!)', worst: 'O(n!)' },
      { operation: 'Subsets', best: 'O(2^n)', average: 'O(2^n)', worst: 'O(2^n)' },
    ],
    spaceComplexity: 'O(n) recursion depth',
    codeExamples: { python: '# See theory levels', java: '// See theory levels', cpp: '// See theory levels' },
    problems: [
      mkProblem('generate-permutations', 'Generate Permutations', 'medium', 'Generate all permutations of an array of distinct integers.', {
        examples: [{ input: 'nums = [1,2,3]', output: '[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]' }],
        constraints: ['1 <= nums.length <= 6', '-10 <= nums[i] <= 10', 'All elements are unique'],
        testCases: [{ input: '3\n1 2 3', expectedOutput: '1 2 3\n1 3 2\n2 1 3\n2 3 1\n3 1 2\n3 2 1' }],
        starterCode: { python: 'n = int(input())\nnums = list(map(int, input().split()))\n# Print all permutations, one per line', java: 'import java.util.*;\npublic class Solution {\n    public static void main(String[] args) {\n        // Generate and print permutations\n    }\n}', cpp: '#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    // Generate and print permutations\n    return 0;\n}' },
      }),
      mkProblem('n-queens', 'N-Queens Problem', 'hard', 'Place N queens on an N×N board so no two queens attack each other. Print the number of solutions.', {
        examples: [{ input: 'n = 4', output: '2', explanation: 'There are 2 valid arrangements for 4 queens.' }],
        constraints: ['1 <= n <= 9'],
        testCases: [{ input: '4', expectedOutput: '2' }, { input: '1', expectedOutput: '1' }, { input: '8', expectedOutput: '92' }],
        starterCode: { python: 'n = int(input())\n# Print number of solutions', java: 'import java.util.*;\npublic class Solution {\n    public static void main(String[] args) {\n        int n = new Scanner(System.in).nextInt();\n        // Print number of solutions\n    }\n}', cpp: '#include <iostream>\nusing namespace std;\nint main() {\n    int n;\n    cin >> n;\n    // Print number of solutions\n    return 0;\n}' },
      }),
      mkProblem('word-search', 'Word Search', 'hard', 'Find if a word exists in a 2D character grid by moving to adjacent cells (up/down/left/right). Each cell can be used once.', {
        examples: [{ input: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"', output: 'true' }],
        constraints: ['1 <= m, n <= 6', '1 <= word.length <= 15'],
        testCases: [{ input: '3 4\nA B C E\nS F C S\nA D E E\nABCCED', expectedOutput: 'true' }, { input: '3 4\nA B C E\nS F C S\nA D E E\nABCB', expectedOutput: 'false' }],
        starterCode: { python: 'r, c = map(int, input().split())\nboard = [input().split() for _ in range(r)]\nword = input()\n# Print "true" or "false"', java: 'import java.util.*;\npublic class Solution {\n    public static void main(String[] args) {\n        // Read board and word, print "true" or "false"\n    }\n}', cpp: '#include <iostream>\n#include <vector>\n#include <string>\nusing namespace std;\nint main() {\n    // Read board and word\n    return 0;\n}' },
      }),
    ],
  },

  // ─── 17. Time & Space Complexity ───
  {
    id: 'complexity', title: 'Time & Space Complexity', icon: '⏱️', color: 'purple', order: 17,
    prerequisites: [], nextTopics: [], estimatedHours: 3,
    definition: 'Big O notation describes how an algorithm\'s runtime or memory usage grows as input size increases. Common: O(1), O(log n), O(n), O(n log n), O(n²), O(2^n).',
    analogy: 'Big O is like asking "how much worse does traffic get as more cars join?" O(1) = no change, O(n) = linear increase, O(n²) = gridlock.',
    whyUseIt: 'Understanding complexity lets you choose the right algorithm. The difference between O(n) and O(n²) can mean seconds vs hours for large inputs.',
    theoryLevels: {
      beginner: {
        title: 'Big O Basics',
        content: `Big O describes the worst-case growth rate:
• O(1) — Constant: array access, hash lookup
• O(log n) — Logarithmic: binary search
• O(n) — Linear: single loop through array
• O(n log n) — Linearithmic: merge sort
• O(n²) — Quadratic: nested loops
• O(2^n) — Exponential: recursive subsets
• O(n!) — Factorial: permutations

Rules:
1. Drop constants: O(2n) = O(n)
2. Drop lower-order terms: O(n² + n) = O(n²)
3. Different inputs → different variables: O(n × m)`,
        codeExample: {
          python: `# O(1) — Constant time
def get_first(arr):
    return arr[0]

# O(n) — Linear time
def find_max(arr):
    maximum = arr[0]
    for num in arr:          # n iterations
        maximum = max(maximum, num)
    return maximum

# O(n²) — Quadratic time
def has_duplicate(arr):
    for i in range(len(arr)):       # n
        for j in range(i+1, len(arr)): # n
            if arr[i] == arr[j]:
                return True
    return False

# O(log n) — Logarithmic time
def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:       # halves each time
        mid = (left + right) // 2
        if arr[mid] == target: return mid
        elif arr[mid] < target: left = mid + 1
        else: right = mid - 1
    return -1`,
          java: `// O(1)
int getFirst(int[] arr) { return arr[0]; }

// O(n)
int findMax(int[] arr) {
    int max = arr[0];
    for (int n : arr) max = Math.max(max, n);
    return max;
}

// O(n²)
boolean hasDuplicate(int[] arr) {
    for (int i = 0; i < arr.length; i++)
        for (int j = i+1; j < arr.length; j++)
            if (arr[i] == arr[j]) return true;
    return false;
}`,
          cpp: `// O(1)
int getFirst(vector<int>& arr) { return arr[0]; }

// O(n)
int findMax(vector<int>& arr) {
    return *max_element(arr.begin(), arr.end());
}

// O(n²)
bool hasDuplicate(vector<int>& arr) {
    for (int i = 0; i < (int)arr.size(); i++)
        for (int j = i+1; j < (int)arr.size(); j++)
            if (arr[i] == arr[j]) return true;
    return false;
}`,
        },
      },
      intermediate: {
        title: 'Amortized Analysis & Space Complexity',
        content: `Amortized analysis: Average cost over a sequence of operations. Dynamic array append is O(1) amortized despite occasional O(n) resizing.

Space complexity: How much extra memory an algorithm uses.
• O(1) — in-place (no extra arrays)
• O(n) — proportional to input (creating a copy)
• O(log n) — recursion depth for divide-and-conquer

Time-space tradeoff: Often you can trade memory for speed (hash maps for O(1) lookup vs O(n) search).`,
        codeExample: {
          python: `# Time-space tradeoff example

# O(n²) time, O(1) space — brute force
def two_sum_slow(arr, target):
    for i in range(len(arr)):
        for j in range(i+1, len(arr)):
            if arr[i] + arr[j] == target:
                return [i, j]
    return []

# O(n) time, O(n) space — hash map
def two_sum_fast(arr, target):
    seen = {}  # extra O(n) space
    for i, num in enumerate(arr):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []

# Space: O(n) for creating a new list
def double_array(arr):
    return [x * 2 for x in arr]  # O(n) space

# Space: O(1) in-place modification
def double_in_place(arr):
    for i in range(len(arr)):
        arr[i] *= 2  # O(1) extra space`,
          java: `// O(n) time O(n) space
int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> map = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        int comp = target - nums[i];
        if (map.containsKey(comp)) return new int[]{map.get(comp), i};
        map.put(nums[i], i);
    }
    return new int[]{};
}`,
          cpp: `// O(n) time O(n) space
vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> map;
    for (int i = 0; i < (int)nums.size(); i++) {
        int comp = target - nums[i];
        if (map.count(comp)) return {map[comp], i};
        map[nums[i]] = i;
    }
    return {};
}`,
        },
      },
      advanced: {
        title: 'Master Theorem & Recurrence Relations',
        content: `Master Theorem solves recurrences of the form T(n) = aT(n/b) + O(n^d):
• If d < log_b(a): T(n) = O(n^(log_b a))
• If d = log_b(a): T(n) = O(n^d × log n)
• If d > log_b(a): T(n) = O(n^d)

Examples:
• Binary Search: T(n) = T(n/2) + O(1) → O(log n)
• Merge Sort: T(n) = 2T(n/2) + O(n) → O(n log n)
• Strassen: T(n) = 7T(n/2) + O(n²) → O(n^2.81)

NP-completeness: Some problems have no known polynomial-time solution (traveling salesman, subset sum).`,
        codeExample: {
          python: `# Analyzing recurrence relations

# T(n) = 2T(n/2) + O(n)  → Merge Sort = O(n log n)
# a=2, b=2, d=1 → d = log_b(a) = 1 → O(n log n)

# T(n) = T(n/2) + O(1)   → Binary Search = O(log n)
# a=1, b=2, d=0 → d = log_b(a) = 0 → O(log n)

# Practical: measure your algorithm
import time

def measure_time(func, *args):
    start = time.time()
    result = func(*args)
    elapsed = time.time() - start
    return result, elapsed

# Compare O(n) vs O(n²)
def linear_search(arr, t):
    for x in arr: 
        if x == t: return True
    return False

def quadratic_check(arr):
    for i in range(len(arr)):
        for j in range(i+1, len(arr)):
            if arr[i] == arr[j]: return True
    return False

# For n=10000: linear ~0.001s, quadratic ~5s`,
          java: `// Empirical complexity testing
long startTime = System.nanoTime();
// ... algorithm ...
long elapsed = System.nanoTime() - startTime;
System.out.println("Time: " + elapsed / 1e6 + " ms");`,
          cpp: `#include <chrono>
auto start = chrono::high_resolution_clock::now();
// ... algorithm ...
auto end = chrono::high_resolution_clock::now();
auto dur = chrono::duration_cast<chrono::microseconds>(end - start);
cout << "Time: " << dur.count() << " µs" << endl;`,
        },
      },
    },
    timeComplexity: [
      { operation: 'O(1) example', best: 'O(1)', average: 'O(1)', worst: 'O(1)' },
      { operation: 'O(log n) example', best: 'O(1)', average: 'O(log n)', worst: 'O(log n)' },
      { operation: 'O(n) example', best: 'O(1)', average: 'O(n)', worst: 'O(n)' },
      { operation: 'O(n²) example', best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
    ],
    spaceComplexity: 'Varies by algorithm',
    codeExamples: { python: '# See theory levels', java: '// See theory levels', cpp: '// See theory levels' },
    problems: [
      mkProblem('identify-complexity', 'Identify Big O', 'easy', 'Given code snippets, identify their time complexity. Read a code pattern keyword and print the Big O.', {
        examples: [{ input: 'single-loop', output: 'O(n)' }, { input: 'nested-loop', output: 'O(n^2)' }],
        constraints: ['Input is one of: constant, single-loop, nested-loop, binary-search, sort'],
        testCases: [{ input: 'single-loop', expectedOutput: 'O(n)' }, { input: 'nested-loop', expectedOutput: 'O(n^2)' }, { input: 'binary-search', expectedOutput: 'O(log n)' }],
        starterCode: { python: 'pattern = input()\n# Print the Big O notation', java: 'import java.util.*;\npublic class Solution {\n    public static void main(String[] args) {\n        String pattern = new Scanner(System.in).nextLine();\n        // Print Big O\n    }\n}', cpp: '#include <iostream>\n#include <string>\nusing namespace std;\nint main() {\n    string pattern;\n    cin >> pattern;\n    // Print Big O\n    return 0;\n}' },
      }),
      mkProblem('optimize-brute-force', 'Optimize Brute Force', 'medium', 'Given an array of n integers, check if any two elements sum to a target. Optimize from O(n²) to O(n) using a hash set.', {
        examples: [{ input: 'nums = [1,4,6,3], target = 7', output: 'true', explanation: '1 + 6 = 7 or 4 + 3 = 7.' }],
        constraints: ['1 <= n <= 10^5', '-10^9 <= nums[i] <= 10^9'],
        testCases: [{ input: '4\n1 4 6 3\n7', expectedOutput: 'true' }, { input: '3\n1 2 3\n10', expectedOutput: 'false' }],
        starterCode: { python: 'n = int(input())\nnums = list(map(int, input().split()))\ntarget = int(input())\n# Print "true" or "false" using O(n) solution', java: 'import java.util.*;\npublic class Solution {\n    public static void main(String[] args) {\n        // O(n) pair sum check\n    }\n}', cpp: '#include <iostream>\n#include <unordered_set>\nusing namespace std;\nint main() {\n    // O(n) pair sum check\n    return 0;\n}' },
      }),
      mkProblem('recurrence-solve', 'Solve Recurrence', 'hard', 'Apply the Master Theorem: given a, b, d, determine the complexity of T(n) = aT(n/b) + O(n^d).', {
        examples: [{ input: 'a=2, b=2, d=1', output: 'O(n log n)', explanation: 'd = log_b(a) = 1, so T(n) = O(n log n).' }],
        constraints: ['1 <= a, b <= 100', '0 <= d <= 10'],
        testCases: [{ input: '2 2 1', expectedOutput: 'O(n log n)' }, { input: '1 2 0', expectedOutput: 'O(log n)' }, { input: '4 2 1', expectedOutput: 'O(n^2)' }],
        starterCode: { python: 'a, b, d = map(int, input().split())\n# Apply Master Theorem and print complexity', java: 'import java.util.*;\npublic class Solution {\n    public static void main(String[] args) {\n        // Apply Master Theorem\n    }\n}', cpp: '#include <iostream>\n#include <cmath>\nusing namespace std;\nint main() {\n    // Apply Master Theorem\n    return 0;\n}' },
      }),
    ],
  },

  // ─── 18. ArrayLists ───
  {
    id: 'arraylists', title: 'ArrayLists', icon: '📋', color: 'amber', order: 18,
    prerequisites: [], nextTopics: [], estimatedHours: 2,
    definition: 'An ArrayList (dynamic array) automatically resizes when capacity is exceeded. Python lists, Java ArrayList, and C++ vector are all dynamic arrays.',
    analogy: 'An ArrayList is like an expandable folder — it starts with some capacity and grows as you add more papers.',
    whyUseIt: 'Dynamic arrays are the most commonly used data structure. They combine array-like O(1) random access with automatic resizing.',
    theoryLevels: {
      beginner: {
        title: 'Dynamic Array Basics',
        content: `Key operations:
• Add to end: O(1) amortized
• Insert at index: O(n) — shift elements
• Remove by index: O(n) — shift elements
• Access by index: O(1)
• Size/length: O(1)

When capacity is full and you add an element, the array doubles its size and copies everything — this is why insert is O(1) amortized.`,
        codeExample: {
          python: `# Python list IS a dynamic array
arr = []
arr.append(1)        # O(1) amortized
arr.append(2)
arr.append(3)
arr.insert(1, 10)    # O(n) — insert at index 1
print(arr)           # [1, 10, 2, 3]
arr.pop()            # O(1) — remove last
arr.pop(1)           # O(n) — remove at index 1
print(arr)           # [1, 2]
print(len(arr))      # 2
print(arr[0])        # 1 — O(1) access

# List comprehension
squares = [x**2 for x in range(10)]
evens = [x for x in range(20) if x % 2 == 0]`,
          java: `ArrayList<Integer> list = new ArrayList<>();
list.add(1);           // O(1)
list.add(2);
list.add(3);
list.add(1, 10);       // insert at index 1 — O(n)
System.out.println(list); // [1, 10, 2, 3]
list.remove(list.size()-1); // remove last
list.get(0);           // O(1) access
list.set(0, 99);       // O(1) update
System.out.println(list.size());`,
          cpp: `#include <vector>
vector<int> vec;
vec.push_back(1);     // O(1) amortized
vec.push_back(2);
vec.push_back(3);
vec.insert(vec.begin()+1, 10); // O(n)
vec.pop_back();       // O(1)
cout << vec[0];       // O(1) access
cout << vec.size();   // size`,
        },
      },
      intermediate: {
        title: 'Iterators & Common Patterns',
        content: `Iterating with care: Don't modify a list while iterating over it (use a copy or iterate backwards).

Common patterns:
• Two-pointer on ArrayList
• Remove duplicates in-place
• Rotate elements
• Partition elements (move zeros to end)`,
        codeExample: {
          python: `# Remove duplicates from sorted list (in-place)
def remove_duplicates(nums):
    if not nums: return 0
    write = 1
    for read in range(1, len(nums)):
        if nums[read] != nums[read-1]:
            nums[write] = nums[read]
            write += 1
    return write

# Move zeros to end
def move_zeros(nums):
    write = 0
    for read in range(len(nums)):
        if nums[read] != 0:
            nums[write], nums[read] = nums[read], nums[write]
            write += 1

arr = [0, 1, 0, 3, 12]
move_zeros(arr)
print(arr)  # [1, 3, 12, 0, 0]`,
          java: `// Remove duplicates
int removeDuplicates(int[] nums) {
    int write = 1;
    for (int read = 1; read < nums.length; read++) {
        if (nums[read] != nums[read-1]) nums[write++] = nums[read];
    }
    return write;
}

// Move zeros to end
void moveZeroes(int[] nums) {
    int w = 0;
    for (int r = 0; r < nums.length; r++) {
        if (nums[r] != 0) { int t = nums[w]; nums[w] = nums[r]; nums[r] = t; w++; }
    }
}`,
          cpp: `int removeDuplicates(vector<int>& nums) {
    int w = 1;
    for (int r = 1; r < (int)nums.size(); r++) {
        if (nums[r] != nums[r-1]) nums[w++] = nums[r];
    }
    return w;
}

void moveZeroes(vector<int>& nums) {
    int w = 0;
    for (int r = 0; r < (int)nums.size(); r++) {
        if (nums[r] != 0) swap(nums[w++], nums[r]);
    }
}`,
        },
      },
      advanced: {
        title: 'Custom Dynamic Array Implementation',
        content: `Build your own dynamic array to understand the internals:
• Start with capacity 4
• When full, double the capacity
• Copy old elements to new array
• Track both size (elements in use) and capacity (allocated space)

This teaches amortized analysis: n appends cost O(n) total, so each append is O(1) amortized.`,
        codeExample: {
          python: `class DynamicArray:
    def __init__(self):
        self.size = 0
        self.capacity = 4
        self.data = [None] * self.capacity

    def append(self, val):
        if self.size == self.capacity:
            self._resize(self.capacity * 2)
        self.data[self.size] = val
        self.size += 1

    def get(self, index):
        if index < 0 or index >= self.size:
            raise IndexError("Index out of bounds")
        return self.data[index]

    def _resize(self, new_capacity):
        new_data = [None] * new_capacity
        for i in range(self.size):
            new_data[i] = self.data[i]
        self.data = new_data
        self.capacity = new_capacity

    def __len__(self):
        return self.size

arr = DynamicArray()
for i in range(10):
    arr.append(i)
    print(f"Size: {arr.size}, Capacity: {arr.capacity}")`,
          java: `class DynamicArray {
    private int[] data;
    private int size, capacity;

    DynamicArray() { capacity = 4; data = new int[capacity]; size = 0; }

    void append(int val) {
        if (size == capacity) resize(capacity * 2);
        data[size++] = val;
    }

    int get(int i) { return data[i]; }

    private void resize(int newCap) {
        int[] newData = new int[newCap];
        System.arraycopy(data, 0, newData, 0, size);
        data = newData; capacity = newCap;
    }
}`,
          cpp: `class DynamicArray {
    int* data;
    int sz, cap;
public:
    DynamicArray() : sz(0), cap(4) { data = new int[cap]; }
    void append(int val) {
        if (sz == cap) resize(cap * 2);
        data[sz++] = val;
    }
    int get(int i) { return data[i]; }
    int size() { return sz; }
private:
    void resize(int newCap) {
        int* newData = new int[newCap];
        for (int i = 0; i < sz; i++) newData[i] = data[i];
        delete[] data;
        data = newData; cap = newCap;
    }
};`,
        },
      },
    },
    timeComplexity: [
      { operation: 'Access', best: 'O(1)', average: 'O(1)', worst: 'O(1)' },
      { operation: 'Append', best: 'O(1)', average: 'O(1)', worst: 'O(n)' },
      { operation: 'Insert/Delete', best: 'O(1)', average: 'O(n)', worst: 'O(n)' },
    ],
    spaceComplexity: 'O(n)',
    codeExamples: { python: '# See theory levels', java: '// See theory levels', cpp: '// See theory levels' },
    problems: [
      mkProblem('remove-duplicates-sorted', 'Remove Duplicates from Sorted Array', 'easy', 'Remove duplicates in-place from a sorted array. Return and print the new length.', {
        examples: [{ input: 'nums = [1,1,2]', output: '2', explanation: 'After removal: [1,2], new length = 2.' }],
        constraints: ['1 <= nums.length <= 3 × 10^4', '-100 <= nums[i] <= 100', 'Array is sorted'],
        testCases: [{ input: '3\n1 1 2', expectedOutput: '2' }, { input: '10\n0 0 1 1 1 2 2 3 3 4', expectedOutput: '5' }],
        starterCode: { python: 'n = int(input())\nnums = list(map(int, input().split()))\n# Print new length after removing duplicates', java: 'import java.util.*;\npublic class Solution {\n    public static void main(String[] args) {\n        // Remove duplicates in-place, print new length\n    }\n}', cpp: '#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    // Remove duplicates in-place, print new length\n    return 0;\n}' },
      }),
      mkProblem('move-zeroes', 'Move Zeroes', 'easy', 'Move all zeros to the end of the array while maintaining the relative order of non-zero elements. Do it in-place.', {
        examples: [{ input: 'nums = [0,1,0,3,12]', output: '1 3 12 0 0' }],
        constraints: ['1 <= nums.length <= 10^4'],
        testCases: [{ input: '5\n0 1 0 3 12', expectedOutput: '1 3 12 0 0' }, { input: '1\n0', expectedOutput: '0' }],
        starterCode: { python: 'n = int(input())\nnums = list(map(int, input().split()))\n# Move zeroes and print', java: 'import java.util.*;\npublic class Solution {\n    public static void main(String[] args) {\n        // Move zeroes, print result\n    }\n}', cpp: '#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    // Move zeroes, print result\n    return 0;\n}' },
      }),
      mkProblem('implement-dynamic-array', 'Implement Dynamic Array', 'medium', 'Build a dynamic array class with append, get, and resize. Process commands and print results.', {
        examples: [{ input: 'append 1, append 2, get 0, append 3, get 2', output: '1\n3' }],
        constraints: ['1 <= operations <= 10^4'],
        testCases: [{ input: '5\nappend 1\nappend 2\nget 0\nappend 3\nget 2', expectedOutput: '1\n3' }],
        starterCode: { python: 'n = int(input())\n# Implement DynamicArray class\n# Process commands: append X, get I', java: 'import java.util.*;\npublic class Solution {\n    public static void main(String[] args) {\n        // Implement dynamic array\n    }\n}', cpp: '#include <iostream>\n#include <string>\nusing namespace std;\nint main() {\n    // Implement dynamic array\n    return 0;\n}' },
      }),
    ],
  },

  // ─── 19. Linked Lists ───
  {
    id: 'linked-lists', title: 'Linked Lists', icon: '⇒', color: 'green', order: 19,
    prerequisites: [], nextTopics: [], estimatedHours: 5,
    definition: 'A linked list stores elements in nodes where each node contains data and a pointer to the next node. Not stored in contiguous memory.',
    analogy: 'Like a treasure hunt where each clue tells you the location of the next clue — you must follow the chain from the start.',
    whyUseIt: 'O(1) insertion/deletion at known positions. Backbone of stacks, queues, and hash table collision resolution.',
    theoryLevels: {
      beginner: {
        title: 'Singly Linked List',
        content: `A linked list consists of nodes. Each node has:
• data — the value stored
• next — pointer to the next node (or null)

The "head" points to the first node. Operations:
• Traverse: Follow next pointers from head
• Insert at head: O(1) — create node, point to old head
• Insert at tail: O(n) — traverse to end, then add
• Delete: O(n) — find node, update previous.next`,
        codeExample: {
          python: `class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

class LinkedList:
    def __init__(self):
        self.head = None

    def insert_head(self, data):
        new_node = Node(data)
        new_node.next = self.head
        self.head = new_node

    def display(self):
        curr = self.head
        while curr:
            print(curr.data, end=" -> ")
            curr = curr.next
        print("None")

    def length(self):
        count, curr = 0, self.head
        while curr:
            count += 1
            curr = curr.next
        return count

ll = LinkedList()
ll.insert_head(3)
ll.insert_head(2)
ll.insert_head(1)
ll.display()  # 1 -> 2 -> 3 -> None`,
          java: `class Node {
    int data;
    Node next;
    Node(int d) { data = d; next = null; }
}

class LinkedList {
    Node head;
    void insertHead(int data) {
        Node newNode = new Node(data);
        newNode.next = head;
        head = newNode;
    }
    void display() {
        Node curr = head;
        while (curr != null) {
            System.out.print(curr.data + " -> ");
            curr = curr.next;
        }
        System.out.println("null");
    }
}`,
          cpp: `struct Node {
    int data;
    Node* next;
    Node(int d) : data(d), next(nullptr) {}
};

class LinkedList {
public:
    Node* head = nullptr;
    void insertHead(int data) {
        Node* newNode = new Node(data);
        newNode->next = head;
        head = newNode;
    }
    void display() {
        Node* curr = head;
        while (curr) {
            cout << curr->data << " -> ";
            curr = curr->next;
        }
        cout << "nullptr" << endl;
    }
};`,
        },
      },
      intermediate: {
        title: 'Doubly Linked List & Reversal',
        content: `Doubly linked list: Each node has prev and next pointers. Allows O(1) deletion when you have a reference to the node.

Reversing a linked list is a classic interview question. Use three pointers: prev, curr, next. Iterate through, reversing links.

Finding the middle: Use slow/fast pointers — slow moves 1 step, fast moves 2. When fast reaches the end, slow is at the middle.`,
        codeExample: {
          python: `# Reverse a linked list (iterative)
def reverse(head):
    prev = None
    curr = head
    while curr:
        next_node = curr.next
        curr.next = prev
        prev = curr
        curr = next_node
    return prev  # new head

# Find middle using slow/fast pointers
def find_middle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    return slow.data

# Detect if list has a cycle
def has_cycle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            return True
    return False`,
          java: `Node reverse(Node head) {
    Node prev = null, curr = head;
    while (curr != null) {
        Node next = curr.next;
        curr.next = prev;
        prev = curr;
        curr = next;
    }
    return prev;
}

boolean hasCycle(Node head) {
    Node slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
        if (slow == fast) return true;
    }
    return false;
}`,
          cpp: `Node* reverse(Node* head) {
    Node* prev = nullptr, *curr = head;
    while (curr) {
        Node* next = curr->next;
        curr->next = prev;
        prev = curr;
        curr = next;
    }
    return prev;
}

bool hasCycle(Node* head) {
    Node* slow = head, *fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
        if (slow == fast) return true;
    }
    return false;
}`,
        },
      },
      advanced: {
        title: 'Cycle Detection & Merge K Lists',
        content: `Floyd's cycle detection: Slow and fast pointers. If they meet → cycle exists. To find cycle start: reset one pointer to head, move both one step at a time until they meet.

Merge K sorted lists: Use a min-heap (priority queue). Push all heads, extract min, push its next. O(n log k) where n = total nodes, k = number of lists.

LRU Cache: Combine doubly linked list (O(1) removal) with hash map (O(1) lookup).`,
        codeExample: {
          python: `# Find cycle start using Floyd's algorithm
def detect_cycle_start(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            # Reset one pointer to head
            slow = head
            while slow != fast:
                slow = slow.next
                fast = fast.next
            return slow  # cycle start
    return None

# Merge K sorted linked lists using heap
import heapq
def merge_k_lists(lists):
    heap = []
    for i, lst in enumerate(lists):
        if lst:
            heapq.heappush(heap, (lst.data, i, lst))

    dummy = Node(0)
    curr = dummy
    while heap:
        val, i, node = heapq.heappop(heap)
        curr.next = node
        curr = curr.next
        if node.next:
            heapq.heappush(heap, (node.next.data, i, node.next))
    return dummy.next`,
          java: `// Merge K sorted lists
ListNode mergeKLists(ListNode[] lists) {
    PriorityQueue<ListNode> pq = new PriorityQueue<>((a,b) -> a.val - b.val);
    for (ListNode l : lists) if (l != null) pq.offer(l);
    ListNode dummy = new ListNode(0), curr = dummy;
    while (!pq.isEmpty()) {
        ListNode node = pq.poll();
        curr.next = node; curr = curr.next;
        if (node.next != null) pq.offer(node.next);
    }
    return dummy.next;
}`,
          cpp: `ListNode* mergeKLists(vector<ListNode*>& lists) {
    auto cmp = [](ListNode* a, ListNode* b) { return a->val > b->val; };
    priority_queue<ListNode*, vector<ListNode*>, decltype(cmp)> pq(cmp);
    for (auto l : lists) if (l) pq.push(l);
    ListNode dummy(0), *curr = &dummy;
    while (!pq.empty()) {
        auto node = pq.top(); pq.pop();
        curr->next = node; curr = curr->next;
        if (node->next) pq.push(node->next);
    }
    return dummy.next;
}`,
        },
      },
    },
    timeComplexity: [
      { operation: 'Access', best: 'O(1)', average: 'O(n)', worst: 'O(n)' },
      { operation: 'Insert (head)', best: 'O(1)', average: 'O(1)', worst: 'O(1)' },
      { operation: 'Insert (tail)', best: 'O(n)', average: 'O(n)', worst: 'O(n)' },
      { operation: 'Delete', best: 'O(1)', average: 'O(n)', worst: 'O(n)' },
      { operation: 'Reverse', best: 'O(n)', average: 'O(n)', worst: 'O(n)' },
    ],
    spaceComplexity: 'O(n)',
    codeExamples: { python: '# See theory levels', java: '// See theory levels', cpp: '// See theory levels' },
    problems: [
      mkProblem('reverse-linked-list', 'Reverse Linked List', 'easy', 'Reverse a singly linked list iteratively. Given space-separated elements, print the reversed list.', {
        examples: [{ input: '1 2 3 4 5', output: '5 4 3 2 1' }],
        constraints: ['0 <= list.length <= 5000', '-5000 <= node.val <= 5000'],
        testCases: [{ input: '1 2 3 4 5', expectedOutput: '5 4 3 2 1' }, { input: '1 2', expectedOutput: '2 1' }],
        starterCode: { python: 'nums = list(map(int, input().split()))\n# Reverse the list and print', java: 'import java.util.*;\npublic class Solution {\n    public static void main(String[] args) {\n        // Read list, reverse, print\n    }\n}', cpp: '#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    // Read, reverse, print\n    return 0;\n}' },
      }),
      mkProblem('detect-cycle', 'Detect Cycle', 'medium', 'Determine if a linked list has a cycle. Given array and a cycle position (-1 for no cycle), print true/false.', {
        examples: [{ input: 'nums = [3,2,0,-4], pos = 1', output: 'true', explanation: 'Tail connects to index 1.' }],
        constraints: ['0 <= list.length <= 10^4', '-1 <= pos < list.length'],
        testCases: [{ input: '4\n3 2 0 -4\n1', expectedOutput: 'true' }, { input: '1\n1\n-1', expectedOutput: 'false' }],
        starterCode: { python: 'n = int(input())\nnums = list(map(int, input().split()))\npos = int(input())\n# Print "true" or "false"', java: 'import java.util.*;\npublic class Solution {\n    public static void main(String[] args) {\n        // Detect cycle\n    }\n}', cpp: '#include <iostream>\nusing namespace std;\nint main() {\n    // Detect cycle\n    return 0;\n}' },
      }),
      mkProblem('merge-k-sorted', 'Merge K Sorted Lists', 'hard', 'Merge k sorted linked lists into one sorted list. Given k sorted arrays, merge and print.', {
        examples: [{ input: 'lists = [[1,4,5],[1,3,4],[2,6]]', output: '1 1 2 3 4 4 5 6' }],
        constraints: ['0 <= k <= 10^4', '0 <= list[i].length <= 500', '-10^4 <= node.val <= 10^4'],
        testCases: [{ input: '3\n3\n1 4 5\n3\n1 3 4\n2\n2 6', expectedOutput: '1 1 2 3 4 4 5 6' }],
        starterCode: { python: 'k = int(input())\nlists = []\nfor _ in range(k):\n    n = int(input())\n    lists.append(list(map(int, input().split())))\n# Merge and print', java: 'import java.util.*;\npublic class Solution {\n    public static void main(String[] args) {\n        // Merge k sorted lists\n    }\n}', cpp: '#include <iostream>\n#include <vector>\n#include <queue>\nusing namespace std;\nint main() {\n    // Merge k sorted lists\n    return 0;\n}' },
      }),
    ],
  },

  // ─── 20. Stacks ───
  {
    id: 'stacks', title: 'Stacks', icon: '📚', color: 'cyan', order: 20,
    prerequisites: [], nextTopics: [], estimatedHours: 3,
    definition: 'A Stack is a LIFO (Last In, First Out) data structure. Elements are added and removed from the same end (top).',
    analogy: 'A stack of plates — you always add and remove from the top.',
    whyUseIt: 'Powers function call stacks, undo/redo, expression evaluation, DFS, and monotonic stack problems.',
    theoryLevels: {
      beginner: {
        title: 'Push, Pop & Balanced Parentheses',
        content: `Stack operations (all O(1)):
• push(x): Add element to top
• pop(): Remove and return top element
• peek()/top(): View top without removing
• isEmpty(): Check if stack is empty

Classic problem: Check balanced parentheses — push opening brackets, pop on closing brackets, match them.`,
        codeExample: {
          python: `# Stack using Python list
stack = []
stack.append(1)   # push
stack.append(2)
stack.append(3)
print(stack[-1])  # peek: 3
stack.pop()       # pop: 3
print(stack)      # [1, 2]

# Balanced parentheses
def is_balanced(s):
    stack = []
    pairs = {')': '(', ']': '[', '}': '{'}
    for char in s:
        if char in '([{':
            stack.append(char)
        elif char in ')]}':
            if not stack or stack[-1] != pairs[char]:
                return False
            stack.pop()
    return len(stack) == 0

print(is_balanced("({[]})"))  # True
print(is_balanced("({[}])"))  # False`,
          java: `Stack<Integer> stack = new Stack<>();
stack.push(1);
stack.push(2);
stack.peek();  // 2
stack.pop();   // 2

// Balanced parentheses
boolean isBalanced(String s) {
    Stack<Character> stack = new Stack<>();
    for (char c : s.toCharArray()) {
        if (c == '(' || c == '[' || c == '{') stack.push(c);
        else {
            if (stack.isEmpty()) return false;
            char top = stack.pop();
            if (c == ')' && top != '(') return false;
            if (c == ']' && top != '[') return false;
            if (c == '}' && top != '{') return false;
        }
    }
    return stack.isEmpty();
}`,
          cpp: `stack<int> s;
s.push(1);
s.push(2);
cout << s.top();  // 2
s.pop();

bool isBalanced(string str) {
    stack<char> s;
    for (char c : str) {
        if (c == '(' || c == '[' || c == '{') s.push(c);
        else {
            if (s.empty()) return false;
            char top = s.top(); s.pop();
            if (c == ')' && top != '(') return false;
            if (c == ']' && top != '[') return false;
            if (c == '}' && top != '{') return false;
        }
    }
    return s.empty();
}`,
        },
      },
      intermediate: {
        title: 'Infix to Postfix & Expression Evaluation',
        content: `Infix: A + B × C (operator between operands)
Postfix: A B C × + (operator after operands) — no parentheses needed!

Conversion: Use a stack for operators. Output operands directly. Push operators with precedence handling.

Evaluation: Scan postfix left-to-right. Push numbers. When you see an operator, pop two operands, compute, push result.`,
        codeExample: {
          python: `# Evaluate postfix expression
def eval_postfix(tokens):
    stack = []
    for token in tokens:
        if token.isdigit():
            stack.append(int(token))
        else:
            b, a = stack.pop(), stack.pop()
            if token == '+': stack.append(a + b)
            elif token == '-': stack.append(a - b)
            elif token == '*': stack.append(a * b)
            elif token == '/': stack.append(int(a / b))
    return stack[0]

# "3 + 4 * 2" → postfix: "3 4 2 * +"
print(eval_postfix(["3", "4", "2", "*", "+"]))  # 11

# Min stack — O(1) getMin
class MinStack:
    def __init__(self):
        self.stack = []
        self.min_stack = []

    def push(self, val):
        self.stack.append(val)
        if not self.min_stack or val <= self.min_stack[-1]:
            self.min_stack.append(val)

    def pop(self):
        val = self.stack.pop()
        if val == self.min_stack[-1]:
            self.min_stack.pop()

    def get_min(self):
        return self.min_stack[-1]`,
          java: `// Evaluate postfix
int evalPostfix(String[] tokens) {
    Stack<Integer> stack = new Stack<>();
    for (String t : tokens) {
        if (t.matches("-?\\\\d+")) stack.push(Integer.parseInt(t));
        else {
            int b = stack.pop(), a = stack.pop();
            switch (t) {
                case "+": stack.push(a+b); break;
                case "-": stack.push(a-b); break;
                case "*": stack.push(a*b); break;
                case "/": stack.push(a/b); break;
            }
        }
    }
    return stack.pop();
}`,
          cpp: `int evalPostfix(vector<string>& tokens) {
    stack<int> s;
    for (auto& t : tokens) {
        if (isdigit(t.back())) s.push(stoi(t));
        else {
            int b = s.top(); s.pop();
            int a = s.top(); s.pop();
            if (t == "+") s.push(a+b);
            else if (t == "-") s.push(a-b);
            else if (t == "*") s.push(a*b);
            else s.push(a/b);
        }
    }
    return s.top();
}`,
        },
      },
      advanced: {
        title: 'Monotonic Stack & Largest Rectangle',
        content: `Monotonic stack: A stack that maintains elements in sorted order (either increasing or decreasing). Used to find the "next greater element" or "previous smaller element" in O(n).

Largest rectangle in histogram: For each bar, find how far left and right it can extend. Use a monotonic increasing stack — when a shorter bar is found, pop and calculate areas.`,
        codeExample: {
          python: `# Next greater element
def next_greater(nums):
    result = [-1] * len(nums)
    stack = []  # stores indices
    for i in range(len(nums)):
        while stack and nums[i] > nums[stack[-1]]:
            idx = stack.pop()
            result[idx] = nums[i]
        stack.append(i)
    return result

print(next_greater([4, 5, 2, 10, 8]))
# [5, 10, 10, -1, -1]

# Largest rectangle in histogram
def largest_rectangle(heights):
    stack = []
    max_area = 0
    for i, h in enumerate(heights + [0]):
        while stack and heights[stack[-1]] > h:
            height = heights[stack.pop()]
            width = i if not stack else i - stack[-1] - 1
            max_area = max(max_area, height * width)
        stack.append(i)
    return max_area

print(largest_rectangle([2, 1, 5, 6, 2, 3]))  # 10`,
          java: `int largestRectangle(int[] heights) {
    Stack<Integer> stack = new Stack<>();
    int maxArea = 0;
    for (int i = 0; i <= heights.length; i++) {
        int h = (i == heights.length) ? 0 : heights[i];
        while (!stack.isEmpty() && heights[stack.peek()] > h) {
            int height = heights[stack.pop()];
            int width = stack.isEmpty() ? i : i - stack.peek() - 1;
            maxArea = Math.max(maxArea, height * width);
        }
        stack.push(i);
    }
    return maxArea;
}`,
          cpp: `int largestRectangle(vector<int>& heights) {
    stack<int> s;
    int maxArea = 0;
    heights.push_back(0);
    for (int i = 0; i < (int)heights.size(); i++) {
        while (!s.empty() && heights[s.top()] > heights[i]) {
            int h = heights[s.top()]; s.pop();
            int w = s.empty() ? i : i - s.top() - 1;
            maxArea = max(maxArea, h * w);
        }
        s.push(i);
    }
    return maxArea;
}`,
        },
      },
    },
    timeComplexity: [
      { operation: 'Push/Pop/Peek', best: 'O(1)', average: 'O(1)', worst: 'O(1)' },
      { operation: 'Next Greater (mono stack)', best: 'O(n)', average: 'O(n)', worst: 'O(n)' },
    ],
    spaceComplexity: 'O(n)',
    codeExamples: { python: '# See theory levels', java: '// See theory levels', cpp: '// See theory levels' },
    problems: [
      mkProblem('valid-parentheses', 'Valid Parentheses', 'easy', 'Check if a string of brackets (){}[] is balanced.', {
        examples: [{ input: 's = "({[]})"', output: 'true' }, { input: 's = "({[}])"', output: 'false' }],
        constraints: ['1 <= s.length <= 10^4', 'String contains only (){}[]'],
        testCases: [{ input: '({[]})', expectedOutput: 'true' }, { input: '({[}])', expectedOutput: 'false' }, { input: '()', expectedOutput: 'true' }],
        starterCode: { python: 's = input()\n# Print "true" or "false"', java: 'import java.util.*;\npublic class Solution {\n    public static void main(String[] args) {\n        String s = new Scanner(System.in).nextLine();\n        // Print "true" or "false"\n    }\n}', cpp: '#include <iostream>\n#include <stack>\n#include <string>\nusing namespace std;\nint main() {\n    string s;\n    cin >> s;\n    // Print "true" or "false"\n    return 0;\n}' },
      }),
      mkProblem('next-greater-element', 'Next Greater Element', 'medium', 'For each element, find the next greater element to its right. Print -1 if none exists.', {
        examples: [{ input: 'nums = [4,5,2,10,8]', output: '5 10 10 -1 -1' }],
        constraints: ['1 <= nums.length <= 10^4'],
        testCases: [{ input: '5\n4 5 2 10 8', expectedOutput: '5 10 10 -1 -1' }, { input: '3\n3 2 1', expectedOutput: '-1 -1 -1' }],
        starterCode: { python: 'n = int(input())\nnums = list(map(int, input().split()))\n# Print next greater elements space-separated', java: 'import java.util.*;\npublic class Solution {\n    public static void main(String[] args) {\n        // Find next greater elements\n    }\n}', cpp: '#include <iostream>\n#include <vector>\n#include <stack>\nusing namespace std;\nint main() {\n    // Find next greater elements\n    return 0;\n}' },
      }),
      mkProblem('largest-rectangle-histogram', 'Largest Rectangle in Histogram', 'hard', 'Find the largest rectangular area in a histogram represented by an array of bar heights.', {
        examples: [{ input: 'heights = [2,1,5,6,2,3]', output: '10', explanation: 'Rectangle of height 5 and width 2.' }],
        constraints: ['1 <= heights.length <= 10^5', '0 <= heights[i] <= 10^4'],
        testCases: [{ input: '6\n2 1 5 6 2 3', expectedOutput: '10' }, { input: '2\n2 4', expectedOutput: '4' }],
        starterCode: { python: 'n = int(input())\nheights = list(map(int, input().split()))\n# Print largest rectangle area', java: 'import java.util.*;\npublic class Solution {\n    public static void main(String[] args) {\n        // Largest rectangle in histogram\n    }\n}', cpp: '#include <iostream>\n#include <vector>\n#include <stack>\nusing namespace std;\nint main() {\n    // Largest rectangle\n    return 0;\n}' },
      }),
    ],
  },

  // ─── 21. Queues ───
  {
    id: 'queues', title: 'Queues', icon: '🚶', color: 'purple', order: 21,
    prerequisites: [], nextTopics: [], estimatedHours: 3,
    definition: 'A Queue is a FIFO (First In, First Out) data structure. Elements are added at the rear and removed from the front.',
    analogy: 'Like a line at a coffee shop — first person in line is first to be served.',
    whyUseIt: 'Powers BFS, task scheduling, producer-consumer systems, and CPU process management.',
    theoryLevels: {
      beginner: {
        title: 'Enqueue, Dequeue & Circular Queue',
        content: `Queue operations (all O(1)):
• enqueue(x): Add to rear
• dequeue(): Remove from front
• front(): View front element
• isEmpty()

Circular queue: Uses a fixed-size array with front and rear pointers that wrap around. Avoids wasting space.`,
        codeExample: {
          python: `from collections import deque

q = deque()
q.append(1)    # enqueue
q.append(2)
q.append(3)
print(q[0])    # front: 1
q.popleft()    # dequeue: 1
print(q)       # deque([2, 3])

# Circular queue
class CircularQueue:
    def __init__(self, k):
        self.data = [None] * k
        self.front = self.rear = -1
        self.size = k

    def enqueue(self, val):
        if (self.rear + 1) % self.size == self.front:
            return False  # full
        if self.front == -1: self.front = 0
        self.rear = (self.rear + 1) % self.size
        self.data[self.rear] = val
        return True

    def dequeue(self):
        if self.front == -1: return None
        val = self.data[self.front]
        if self.front == self.rear:
            self.front = self.rear = -1
        else:
            self.front = (self.front + 1) % self.size
        return val`,
          java: `Queue<Integer> q = new LinkedList<>();
q.offer(1);    // enqueue
q.offer(2);
q.peek();      // front: 1
q.poll();      // dequeue: 1`,
          cpp: `queue<int> q;
q.push(1);     // enqueue
q.push(2);
cout << q.front(); // 1
q.pop();       // dequeue`,
        },
      },
      intermediate: {
        title: 'Deque & Priority Queue',
        content: `Deque (double-ended queue): Insert and remove from both front and rear in O(1). Useful for sliding window problems.

Priority Queue: Elements are dequeued by priority (not insertion order). Implemented using a heap.
• Min-heap: smallest element has highest priority
• Max-heap: largest element has highest priority`,
        codeExample: {
          python: `from collections import deque
import heapq

# Deque
dq = deque()
dq.appendleft(1)  # front
dq.append(2)      # rear
dq.appendleft(0)
print(dq)          # deque([0, 1, 2])
dq.popleft()       # 0
dq.pop()           # 2

# Priority Queue (min-heap)
pq = []
heapq.heappush(pq, 3)
heapq.heappush(pq, 1)
heapq.heappush(pq, 2)
print(heapq.heappop(pq))  # 1 (smallest)

# Task scheduler
tasks = [(2, "Low"), (0, "High"), (1, "Medium")]
heapq.heapify(tasks)
while tasks:
    priority, task = heapq.heappop(tasks)
    print(f"Processing: {task} (priority {priority})")`,
          java: `// Priority Queue (min-heap by default)
PriorityQueue<Integer> pq = new PriorityQueue<>();
pq.offer(3); pq.offer(1); pq.offer(2);
System.out.println(pq.poll()); // 1

// Max-heap
PriorityQueue<Integer> maxPQ = new PriorityQueue<>(Collections.reverseOrder());
maxPQ.offer(3); maxPQ.offer(1); maxPQ.offer(2);
System.out.println(maxPQ.poll()); // 3`,
          cpp: `// Priority queue (max-heap by default)
priority_queue<int> pq;
pq.push(3); pq.push(1); pq.push(2);
cout << pq.top(); // 3
pq.pop();

// Min-heap
priority_queue<int, vector<int>, greater<int>> minPQ;
minPQ.push(3); minPQ.push(1); minPQ.push(2);
cout << minPQ.top(); // 1`,
        },
      },
      advanced: {
        title: 'Sliding Window Maximum & BFS',
        content: `Sliding window maximum: Find the max in every window of size k as it slides across the array. Use a deque that stores indices in decreasing order of values. O(n) total.

BFS (Breadth-First Search) uses a queue to explore all neighbors at the current depth before moving deeper. Used for shortest path in unweighted graphs.`,
        codeExample: {
          python: `# Sliding window maximum — O(n)
from collections import deque

def max_sliding_window(nums, k):
    dq = deque()  # stores indices
    result = []
    for i in range(len(nums)):
        # Remove elements outside window
        while dq and dq[0] < i - k + 1:
            dq.popleft()
        # Remove smaller elements (they can't be max)
        while dq and nums[dq[-1]] < nums[i]:
            dq.pop()
        dq.append(i)
        if i >= k - 1:
            result.append(nums[dq[0]])
    return result

print(max_sliding_window([1,3,-1,-3,5,3,6,7], 3))
# [3, 3, 5, 5, 6, 7]

# BFS shortest path
def bfs(graph, start, target):
    queue = deque([(start, 0)])
    visited = {start}
    while queue:
        node, dist = queue.popleft()
        if node == target: return dist
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append((neighbor, dist + 1))
    return -1`,
          java: `int[] maxSlidingWindow(int[] nums, int k) {
    Deque<Integer> dq = new ArrayDeque<>();
    int[] result = new int[nums.length - k + 1];
    for (int i = 0; i < nums.length; i++) {
        while (!dq.isEmpty() && dq.peekFirst() < i-k+1) dq.pollFirst();
        while (!dq.isEmpty() && nums[dq.peekLast()] < nums[i]) dq.pollLast();
        dq.offerLast(i);
        if (i >= k-1) result[i-k+1] = nums[dq.peekFirst()];
    }
    return result;
}`,
          cpp: `vector<int> maxSlidingWindow(vector<int>& nums, int k) {
    deque<int> dq;
    vector<int> result;
    for (int i = 0; i < (int)nums.size(); i++) {
        while (!dq.empty() && dq.front() < i-k+1) dq.pop_front();
        while (!dq.empty() && nums[dq.back()] < nums[i]) dq.pop_back();
        dq.push_back(i);
        if (i >= k-1) result.push_back(nums[dq.front()]);
    }
    return result;
}`,
        },
      },
    },
    timeComplexity: [
      { operation: 'Enqueue/Dequeue', best: 'O(1)', average: 'O(1)', worst: 'O(1)' },
      { operation: 'Priority Queue ops', best: 'O(1)', average: 'O(log n)', worst: 'O(log n)' },
      { operation: 'Sliding Window Max', best: 'O(n)', average: 'O(n)', worst: 'O(n)' },
    ],
    spaceComplexity: 'O(n)',
    codeExamples: { python: '# See theory levels', java: '// See theory levels', cpp: '// See theory levels' },
    problems: [
      mkProblem('implement-queue-stacks', 'Queue using Stacks', 'easy', 'Implement a FIFO queue using two stacks. Process enqueue/dequeue commands and print dequeue results.', {
        examples: [{ input: 'enqueue 1, enqueue 2, dequeue, enqueue 3, dequeue', output: '1\n2' }],
        constraints: ['1 <= operations <= 100'],
        testCases: [{ input: '5\nenqueue 1\nenqueue 2\ndequeue\nenqueue 3\ndequeue', expectedOutput: '1\n2' }],
        starterCode: { python: 'n = int(input())\n# Implement queue using two stacks\n# Process enqueue/dequeue commands', java: 'import java.util.*;\npublic class Solution {\n    public static void main(String[] args) {\n        // Queue using two stacks\n    }\n}', cpp: '#include <iostream>\n#include <stack>\n#include <string>\nusing namespace std;\nint main() {\n    // Queue using two stacks\n    return 0;\n}' },
      }),
      mkProblem('sliding-window-max', 'Sliding Window Maximum', 'hard', 'Find the maximum in every contiguous window of size k as it slides across the array.', {
        examples: [{ input: 'nums = [1,3,-1,-3,5,3,6,7], k = 3', output: '3 3 5 5 6 7' }],
        constraints: ['1 <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4', '1 <= k <= nums.length'],
        testCases: [{ input: '8\n1 3 -1 -3 5 3 6 7\n3', expectedOutput: '3 3 5 5 6 7' }],
        starterCode: { python: 'n = int(input())\nnums = list(map(int, input().split()))\nk = int(input())\n# Print window maximums space-separated', java: 'import java.util.*;\npublic class Solution {\n    public static void main(String[] args) {\n        // Sliding window max\n    }\n}', cpp: '#include <iostream>\n#include <vector>\n#include <deque>\nusing namespace std;\nint main() {\n    // Sliding window max\n    return 0;\n}' },
      }),
      mkProblem('rotting-oranges', 'Rotting Oranges (BFS)', 'medium', 'In a grid, 0=empty, 1=fresh, 2=rotten. Each minute rotten oranges infect adjacent fresh ones. Find min minutes until no fresh oranges remain, or -1.', {
        examples: [{ input: 'grid = [[2,1,1],[1,1,0],[0,1,1]]', output: '4' }],
        constraints: ['1 <= m, n <= 10'],
        testCases: [{ input: '3 3\n2 1 1\n1 1 0\n0 1 1', expectedOutput: '4' }, { input: '3 3\n2 1 1\n0 1 1\n1 0 1', expectedOutput: '-1' }],
        starterCode: { python: 'r, c = map(int, input().split())\ngrid = [list(map(int, input().split())) for _ in range(r)]\n# Print min minutes or -1', java: 'import java.util.*;\npublic class Solution {\n    public static void main(String[] args) {\n        // Multi-source BFS\n    }\n}', cpp: '#include <iostream>\n#include <vector>\n#include <queue>\nusing namespace std;\nint main() {\n    // Multi-source BFS\n    return 0;\n}' },
      }),
    ],
  },

  // ─── 22. Greedy ───
  {
    id: 'greedy', title: 'Greedy Algorithms', icon: '🤑', color: 'amber', order: 22,
    prerequisites: [], nextTopics: [], estimatedHours: 4,
    definition: 'Greedy algorithms make the locally optimal choice at each step, hoping to find the global optimum. They don\'t reconsider past decisions.',
    analogy: 'Like picking the biggest coin first when making change — always grab the largest value available.',
    whyUseIt: 'Efficient for optimization problems like activity selection, Huffman coding, and interval scheduling.',
    theoryLevels: {
      beginner: {
        title: 'Activity Selection & Coin Change',
        content: `Greedy works when the "greedy choice property" holds: a locally optimal choice leads to a globally optimal solution.

Activity selection: Given activities with start/end times, select the maximum non-overlapping activities. Greedy: always pick the activity that ends earliest.

Coin change (greedy): For standard denominations, always pick the largest coin ≤ remaining amount.`,
        codeExample: {
          python: `# Activity Selection — greedy by earliest finish time
def max_activities(activities):
    # Sort by end time
    activities.sort(key=lambda x: x[1])
    selected = [activities[0]]
    last_end = activities[0][1]

    for start, end in activities[1:]:
        if start >= last_end:
            selected.append((start, end))
            last_end = end

    return selected

activities = [(1,4), (3,5), (0,6), (5,7), (3,8), (5,9), (6,10), (8,11)]
print(max_activities(activities))
# [(1,4), (5,7), (8,11)]

# Coin change (greedy for standard denominations)
def coin_change(amount, coins=[25, 10, 5, 1]):
    result = []
    for coin in coins:
        while amount >= coin:
            result.append(coin)
            amount -= coin
    return result

print(coin_change(67))  # [25, 25, 10, 5, 1, 1]`,
          java: `// Activity selection
int maxActivities(int[][] activities) {
    Arrays.sort(activities, (a,b) -> a[1] - b[1]);
    int count = 1, lastEnd = activities[0][1];
    for (int i = 1; i < activities.length; i++) {
        if (activities[i][0] >= lastEnd) {
            count++;
            lastEnd = activities[i][1];
        }
    }
    return count;
}`,
          cpp: `int maxActivities(vector<pair<int,int>>& acts) {
    sort(acts.begin(), acts.end(), [](auto& a, auto& b) { return a.second < b.second; });
    int count = 1, lastEnd = acts[0].second;
    for (int i = 1; i < (int)acts.size(); i++) {
        if (acts[i].first >= lastEnd) {
            count++; lastEnd = acts[i].second;
        }
    }
    return count;
}`,
        },
      },
      intermediate: {
        title: 'Fractional Knapsack & Huffman Coding',
        content: `Fractional knapsack: Items have weight and value. You can take fractions. Greedy: sort by value/weight ratio, take items with highest ratio first.

Huffman coding: Build an optimal prefix code for compression. Use a min-heap: repeatedly merge the two least-frequent characters.`,
        codeExample: {
          python: `# Fractional Knapsack
def fractional_knapsack(capacity, items):
    # items: [(value, weight), ...]
    items.sort(key=lambda x: x[0]/x[1], reverse=True)
    total_value = 0
    for value, weight in items:
        if capacity >= weight:
            total_value += value
            capacity -= weight
        else:
            total_value += value * (capacity / weight)
            break
    return total_value

items = [(60, 10), (100, 20), (120, 30)]  # (value, weight)
print(fractional_knapsack(50, items))  # 240.0

# Jump Game — can you reach the last index?
def can_jump(nums):
    max_reach = 0
    for i in range(len(nums)):
        if i > max_reach: return False
        max_reach = max(max_reach, i + nums[i])
    return True`,
          java: `// Fractional Knapsack
double fractionalKnapsack(int cap, int[][] items) {
    Arrays.sort(items, (a,b) -> Double.compare((double)b[0]/b[1], (double)a[0]/a[1]));
    double total = 0;
    for (int[] item : items) {
        if (cap >= item[1]) { total += item[0]; cap -= item[1]; }
        else { total += item[0] * ((double)cap / item[1]); break; }
    }
    return total;
}`,
          cpp: `double fractionalKnapsack(int cap, vector<pair<int,int>>& items) {
    sort(items.begin(), items.end(), [](auto& a, auto& b) {
        return (double)a.first/a.second > (double)b.first/b.second;
    });
    double total = 0;
    for (auto& [val, wt] : items) {
        if (cap >= wt) { total += val; cap -= wt; }
        else { total += val * ((double)cap / wt); break; }
    }
    return total;
}`,
        },
      },
      advanced: {
        title: 'Interval Scheduling & Job Sequencing',
        content: `Interval scheduling maximization: Select the maximum number of non-overlapping intervals. Sort by end time, greedily pick.

Interval partitioning: Find the minimum number of resources needed (rooms for meetings). Sort by start time, use a min-heap of end times.

Job sequencing with deadlines: Given jobs with deadlines and profits, maximize profit. Sort by profit, assign to latest available slot before deadline.`,
        codeExample: {
          python: `# Minimum meeting rooms (interval partitioning)
import heapq

def min_meeting_rooms(intervals):
    if not intervals: return 0
    intervals.sort(key=lambda x: x[0])
    heap = [intervals[0][1]]  # end times
    for start, end in intervals[1:]:
        if start >= heap[0]:
            heapq.heapreplace(heap, end)
        else:
            heapq.heappush(heap, end)
    return len(heap)

meetings = [(0,30), (5,10), (15,20)]
print(min_meeting_rooms(meetings))  # 2

# Job sequencing with deadlines
def job_sequencing(jobs):
    # jobs: [(id, deadline, profit)]
    jobs.sort(key=lambda x: x[2], reverse=True)
    max_deadline = max(j[1] for j in jobs)
    slots = [False] * (max_deadline + 1)
    total_profit = 0
    for job_id, deadline, profit in jobs:
        for t in range(deadline, 0, -1):
            if not slots[t]:
                slots[t] = True
                total_profit += profit
                break
    return total_profit`,
          java: `int minMeetingRooms(int[][] intervals) {
    Arrays.sort(intervals, (a,b) -> a[0] - b[0]);
    PriorityQueue<Integer> pq = new PriorityQueue<>();
    pq.offer(intervals[0][1]);
    for (int i = 1; i < intervals.length; i++) {
        if (intervals[i][0] >= pq.peek()) pq.poll();
        pq.offer(intervals[i][1]);
    }
    return pq.size();
}`,
          cpp: `int minMeetingRooms(vector<vector<int>>& intervals) {
    sort(intervals.begin(), intervals.end());
    priority_queue<int, vector<int>, greater<int>> pq;
    pq.push(intervals[0][1]);
    for (int i = 1; i < (int)intervals.size(); i++) {
        if (intervals[i][0] >= pq.top()) pq.pop();
        pq.push(intervals[i][1]);
    }
    return pq.size();
}`,
        },
      },
    },
    timeComplexity: [
      { operation: 'Activity selection', best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
      { operation: 'Fractional knapsack', best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
    ],
    spaceComplexity: 'O(n)',
    codeExamples: { python: '# See theory levels', java: '// See theory levels', cpp: '// See theory levels' },
    problems: [
      mkProblem('activity-selection', 'Activity Selection', 'easy', 'Select the maximum number of non-overlapping activities. Given activities with start/end times.', {
        examples: [{ input: 'activities = [(1,4),(3,5),(0,6),(5,7),(3,8),(5,9),(6,10),(8,11)]', output: '3', explanation: 'Select (1,4), (5,7), (8,11).' }],
        constraints: ['1 <= n <= 10^5'],
        testCases: [{ input: '8\n1 4\n3 5\n0 6\n5 7\n3 8\n5 9\n6 10\n8 11', expectedOutput: '3' }],
        starterCode: { python: 'n = int(input())\nactivities = [tuple(map(int, input().split())) for _ in range(n)]\n# Print max non-overlapping activities', java: 'import java.util.*;\npublic class Solution {\n    public static void main(String[] args) {\n        // Activity selection\n    }\n}', cpp: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\nint main() {\n    // Activity selection\n    return 0;\n}' },
      }),
      mkProblem('jump-game', 'Jump Game', 'medium', 'Given an array where each element is the max jump length, determine if you can reach the last index.', {
        examples: [{ input: 'nums = [2,3,1,1,4]', output: 'true' }, { input: 'nums = [3,2,1,0,4]', output: 'false' }],
        constraints: ['1 <= nums.length <= 10^4', '0 <= nums[i] <= 10^5'],
        testCases: [{ input: '5\n2 3 1 1 4', expectedOutput: 'true' }, { input: '5\n3 2 1 0 4', expectedOutput: 'false' }],
        starterCode: { python: 'n = int(input())\nnums = list(map(int, input().split()))\n# Print "true" or "false"', java: 'import java.util.*;\npublic class Solution {\n    public static void main(String[] args) {\n        // Jump game\n    }\n}', cpp: '#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    // Jump game\n    return 0;\n}' },
      }),
      mkProblem('minimum-meeting-rooms', 'Minimum Meeting Rooms', 'hard', 'Find the minimum number of conference rooms needed for all meetings given their intervals.', {
        examples: [{ input: 'intervals = [(0,30),(5,10),(15,20)]', output: '2' }],
        constraints: ['1 <= intervals.length <= 10^4'],
        testCases: [{ input: '3\n0 30\n5 10\n15 20', expectedOutput: '2' }, { input: '2\n7 10\n2 4', expectedOutput: '1' }],
        starterCode: { python: 'n = int(input())\nintervals = [tuple(map(int, input().split())) for _ in range(n)]\n# Print min rooms', java: 'import java.util.*;\npublic class Solution {\n    public static void main(String[] args) {\n        // Min meeting rooms\n    }\n}', cpp: '#include <iostream>\n#include <vector>\n#include <queue>\nusing namespace std;\nint main() {\n    // Min meeting rooms\n    return 0;\n}' },
      }),
    ],
  },

  // ─── 23. Binary Trees ───
  {
    id: 'binary-trees', title: 'Binary Trees', icon: '🌳', color: 'green', order: 23,
    prerequisites: [], nextTopics: [], estimatedHours: 5,
    definition: 'A binary tree is a hierarchical structure where each node has at most two children (left and right). Supports DFS and BFS traversals.',
    analogy: 'Like a family tree where each person has at most two children.',
    whyUseIt: 'Foundation for BSTs, heaps, expression trees, and Huffman trees. Tree traversals are fundamental to CS.',
    theoryLevels: {
      beginner: {
        title: 'Tree Creation & DFS Traversals',
        content: `A binary tree node has: value, left child, right child.

Three DFS traversal orders:
• Inorder (Left, Root, Right): sorted order for BST
• Preorder (Root, Left, Right): copy/serialize tree
• Postorder (Left, Right, Root): delete tree, evaluate expression

Each traversal visits every node exactly once — O(n).`,
        codeExample: {
          python: `class TreeNode:
    def __init__(self, val, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

# Build tree:      1
#                 / \\
#                2   3
#               / \\
#              4   5

root = TreeNode(1, TreeNode(2, TreeNode(4), TreeNode(5)), TreeNode(3))

def inorder(node):
    if not node: return []
    return inorder(node.left) + [node.val] + inorder(node.right)

def preorder(node):
    if not node: return []
    return [node.val] + preorder(node.left) + preorder(node.right)

def postorder(node):
    if not node: return []
    return postorder(node.left) + postorder(node.right) + [node.val]

print("Inorder:", inorder(root))    # [4, 2, 5, 1, 3]
print("Preorder:", preorder(root))  # [1, 2, 4, 5, 3]
print("Postorder:", postorder(root))# [4, 5, 2, 3, 1]`,
          java: `class TreeNode {
    int val;
    TreeNode left, right;
    TreeNode(int v) { val = v; }
}

void inorder(TreeNode node) {
    if (node == null) return;
    inorder(node.left);
    System.out.print(node.val + " ");
    inorder(node.right);
}`,
          cpp: `struct TreeNode {
    int val;
    TreeNode *left, *right;
    TreeNode(int v) : val(v), left(nullptr), right(nullptr) {}
};

void inorder(TreeNode* node) {
    if (!node) return;
    inorder(node->left);
    cout << node->val << " ";
    inorder(node->right);
}`,
        },
      },
      intermediate: {
        title: 'BFS, Height & Diameter',
        content: `BFS (Level-order): Visit nodes level by level using a queue.

Height of tree: max(height(left), height(right)) + 1. Base case: empty node = -1 (or 0 depending on definition).

Diameter: Longest path between any two nodes. For each node, diameter passing through it = height(left) + height(right) + 2.`,
        codeExample: {
          python: `from collections import deque

# BFS / Level-order traversal
def level_order(root):
    if not root: return []
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

# Height
def height(node):
    if not node: return -1
    return 1 + max(height(node.left), height(node.right))

# Diameter
def diameter(root):
    max_d = [0]
    def dfs(node):
        if not node: return -1
        left_h = dfs(node.left)
        right_h = dfs(node.right)
        max_d[0] = max(max_d[0], left_h + right_h + 2)
        return 1 + max(left_h, right_h)
    dfs(root)
    return max_d[0]`,
          java: `List<List<Integer>> levelOrder(TreeNode root) {
    List<List<Integer>> result = new ArrayList<>();
    if (root == null) return result;
    Queue<TreeNode> q = new LinkedList<>();
    q.offer(root);
    while (!q.isEmpty()) {
        List<Integer> level = new ArrayList<>();
        int size = q.size();
        for (int i = 0; i < size; i++) {
            TreeNode n = q.poll();
            level.add(n.val);
            if (n.left != null) q.offer(n.left);
            if (n.right != null) q.offer(n.right);
        }
        result.add(level);
    }
    return result;
}`,
          cpp: `vector<vector<int>> levelOrder(TreeNode* root) {
    vector<vector<int>> result;
    if (!root) return result;
    queue<TreeNode*> q;
    q.push(root);
    while (!q.empty()) {
        vector<int> level;
        int sz = q.size();
        for (int i = 0; i < sz; i++) {
            auto n = q.front(); q.pop();
            level.push_back(n->val);
            if (n->left) q.push(n->left);
            if (n->right) q.push(n->right);
        }
        result.push_back(level);
    }
    return result;
}`,
        },
      },
      advanced: {
        title: 'LCA, Serialization & Path Sum',
        content: `Lowest Common Ancestor (LCA): The deepest node that is ancestor of both nodes p and q. Recursive: if current node is p or q, return it. Otherwise, search left and right subtrees.

Serialization: Convert tree to string and back. Use preorder with null markers.

Maximum path sum: Find the path (any start/end) with maximum sum. At each node, consider: node alone, node + left path, node + right path, node + both (but don't propagate both upward).`,
        codeExample: {
          python: `# Lowest Common Ancestor
def lca(root, p, q):
    if not root or root == p or root == q:
        return root
    left = lca(root.left, p, q)
    right = lca(root.right, p, q)
    if left and right: return root  # p and q in different subtrees
    return left or right

# Maximum path sum
def max_path_sum(root):
    max_sum = [float('-inf')]
    def dfs(node):
        if not node: return 0
        left = max(0, dfs(node.left))   # ignore negative paths
        right = max(0, dfs(node.right))
        max_sum[0] = max(max_sum[0], node.val + left + right)
        return node.val + max(left, right)
    dfs(root)
    return max_sum[0]

# Serialize / Deserialize
def serialize(root):
    if not root: return "null,"
    return str(root.val) + "," + serialize(root.left) + serialize(root.right)`,
          java: `TreeNode lca(TreeNode root, TreeNode p, TreeNode q) {
    if (root == null || root == p || root == q) return root;
    TreeNode left = lca(root.left, p, q);
    TreeNode right = lca(root.right, p, q);
    if (left != null && right != null) return root;
    return left != null ? left : right;
}`,
          cpp: `TreeNode* lca(TreeNode* root, TreeNode* p, TreeNode* q) {
    if (!root || root == p || root == q) return root;
    auto left = lca(root->left, p, q);
    auto right = lca(root->right, p, q);
    if (left && right) return root;
    return left ? left : right;
}`,
        },
      },
    },
    timeComplexity: [
      { operation: 'Traversal (DFS/BFS)', best: 'O(n)', average: 'O(n)', worst: 'O(n)' },
      { operation: 'Height', best: 'O(n)', average: 'O(n)', worst: 'O(n)' },
      { operation: 'LCA', best: 'O(1)', average: 'O(n)', worst: 'O(n)' },
    ],
    spaceComplexity: 'O(h) where h = height',
    codeExamples: { python: '# See theory levels', java: '// See theory levels', cpp: '// See theory levels' },
    problems: [
      mkProblem('tree-inorder', 'Inorder Traversal', 'easy', 'Return the inorder traversal of a binary tree given as array representation.', {
        examples: [{ input: 'tree = [1,null,2,3]', output: '1 3 2' }],
        constraints: ['0 <= nodes <= 100'],
        testCases: [{ input: '1 null 2 3', expectedOutput: '1 3 2' }],
        starterCode: { python: 'vals = input().split()\n# Build tree and print inorder traversal', java: 'import java.util.*;\npublic class Solution {\n    public static void main(String[] args) {\n        // Inorder traversal\n    }\n}', cpp: '#include <iostream>\nusing namespace std;\nint main() {\n    // Inorder traversal\n    return 0;\n}' },
      }),
      mkProblem('level-order-traversal', 'Level Order Traversal', 'medium', 'Return the level order traversal of a binary tree. Print each level on a separate line.', {
        examples: [{ input: 'tree = [3,9,20,null,null,15,7]', output: '3\n9 20\n15 7' }],
        constraints: ['0 <= nodes <= 2000'],
        testCases: [{ input: '3 9 20 null null 15 7', expectedOutput: '3\n9 20\n15 7' }],
        starterCode: { python: 'vals = input().split()\n# Build tree, print level order', java: 'import java.util.*;\npublic class Solution {\n    public static void main(String[] args) {\n        // Level order traversal\n    }\n}', cpp: '#include <iostream>\n#include <queue>\nusing namespace std;\nint main() {\n    // Level order traversal\n    return 0;\n}' },
      }),
      mkProblem('max-path-sum', 'Maximum Path Sum', 'hard', 'Find the maximum sum path in a binary tree. A path can start and end at any node.', {
        examples: [{ input: 'tree = [-10,9,20,null,null,15,7]', output: '42', explanation: 'Path: 15 → 20 → 7' }],
        constraints: ['1 <= nodes <= 3 × 10^4', '-1000 <= node.val <= 1000'],
        testCases: [{ input: '-10 9 20 null null 15 7', expectedOutput: '42' }, { input: '1 2 3', expectedOutput: '6' }],
        starterCode: { python: 'vals = input().split()\n# Build tree, print max path sum', java: 'import java.util.*;\npublic class Solution {\n    public static void main(String[] args) {\n        // Max path sum\n    }\n}', cpp: '#include <iostream>\nusing namespace std;\nint main() {\n    // Max path sum\n    return 0;\n}' },
      }),
    ],
  },

  // ─── 24-30: Remaining topics (shorter for brevity but still complete) ───
  ...[
    {
      id: 'bst', title: 'Binary Search Trees', icon: '🔍', color: 'cyan', order: 24, hours: 4,
      def: 'A BST is a binary tree where left child < parent < right child, enabling O(log n) search, insert, and delete when balanced.',
      analogy: 'Like a dictionary — open to the middle, check if your word comes before or after, and repeat.',
      why: 'BSTs power database indexes, symbol tables, and sorted data storage.',
      beg: { title: 'Insert, Search & Inorder', content: 'BST property: all left descendants < node < all right descendants. Inorder traversal gives sorted order. Insert by comparing with current node and going left/right.',
        py: `class BST:\n    def __init__(self, val):\n        self.val = val\n        self.left = self.right = None\n\n    def insert(self, val):\n        if val < self.val:\n            if self.left: self.left.insert(val)\n            else: self.left = BST(val)\n        else:\n            if self.right: self.right.insert(val)\n            else: self.right = BST(val)\n\n    def search(self, val):\n        if val == self.val: return True\n        if val < self.val: return self.left.search(val) if self.left else False\n        return self.right.search(val) if self.right else False\n\n    def inorder(self):\n        result = []\n        if self.left: result += self.left.inorder()\n        result.append(self.val)\n        if self.right: result += self.right.inorder()\n        return result\n\ntree = BST(5)\nfor v in [3,7,1,4,6,8]: tree.insert(v)\nprint(tree.inorder())  # [1, 3, 4, 5, 6, 7, 8]`,
        java: `TreeNode insert(TreeNode root, int val) {\n    if (root == null) return new TreeNode(val);\n    if (val < root.val) root.left = insert(root.left, val);\n    else root.right = insert(root.right, val);\n    return root;\n}`,
        cpp: `TreeNode* insert(TreeNode* root, int val) {\n    if (!root) return new TreeNode(val);\n    if (val < root->val) root->left = insert(root->left, val);\n    else root->right = insert(root->right, val);\n    return root;\n}` },
      mid: { title: 'Delete, Validate & Floor/Ceil', content: 'Delete has 3 cases: leaf (remove), one child (replace), two children (replace with inorder successor). Validate BST: check that every node is within valid range (min, max).',
        py: `def is_valid_bst(node, min_val=float('-inf'), max_val=float('inf')):\n    if not node: return True\n    if node.val <= min_val or node.val >= max_val:\n        return False\n    return (is_valid_bst(node.left, min_val, node.val) and\n            is_valid_bst(node.right, node.val, max_val))\n\ndef delete_node(root, key):\n    if not root: return None\n    if key < root.val: root.left = delete_node(root.left, key)\n    elif key > root.val: root.right = delete_node(root.right, key)\n    else:\n        if not root.left: return root.right\n        if not root.right: return root.left\n        # Find inorder successor\n        succ = root.right\n        while succ.left: succ = succ.left\n        root.val = succ.val\n        root.right = delete_node(root.right, succ.val)\n    return root`,
        java: `boolean isValidBST(TreeNode node, long min, long max) {\n    if (node == null) return true;\n    if (node.val <= min || node.val >= max) return false;\n    return isValidBST(node.left, min, node.val) &&\n           isValidBST(node.right, node.val, max);\n}`,
        cpp: `bool isValidBST(TreeNode* n, long mn=LONG_MIN, long mx=LONG_MAX) {\n    if (!n) return true;\n    if (n->val <= mn || n->val >= mx) return false;\n    return isValidBST(n->left, mn, n->val) && isValidBST(n->right, n->val, mx);\n}` },
      adv: { title: 'AVL Rotations & Balanced Trees', content: 'AVL tree: Self-balancing BST where heights of left and right subtrees differ by at most 1. Uses rotations (left, right, left-right, right-left) to maintain balance after insert/delete.',
        py: `# AVL rotation concept\ndef right_rotate(y):\n    x = y.left\n    T2 = x.right\n    x.right = y\n    y.left = T2\n    return x\n\ndef left_rotate(x):\n    y = x.right\n    T2 = y.left\n    y.left = x\n    x.right = T2\n    return y\n\n# Balance factor = height(left) - height(right)\n# If > 1: right rotate (or left-right rotate)\n# If < -1: left rotate (or right-left rotate)`,
        java: `// AVL right rotation\nTreeNode rightRotate(TreeNode y) {\n    TreeNode x = y.left, T2 = x.right;\n    x.right = y; y.left = T2;\n    return x;\n}`,
        cpp: `TreeNode* rightRotate(TreeNode* y) {\n    TreeNode* x = y->left;\n    TreeNode* T2 = x->right;\n    x->right = y; y->left = T2;\n    return x;\n}` },
      tc: [{ operation: 'Search/Insert/Delete', best: 'O(log n)', average: 'O(log n)', worst: 'O(n)' }],
      sc: 'O(n)',
      probs: [
        mkProblem('bst-insert-search', 'BST Insert & Search', 'easy', 'Implement insert and search in a BST. Given values to insert and a search target.', {
          examples: [{ input: 'insert: [5,3,7,1,4], search: 4', output: 'true' }],
          constraints: ['1 <= n <= 10^4', '-10^4 <= val <= 10^4'],
          testCases: [{ input: '5\n5 3 7 1 4\n4', expectedOutput: 'true' }, { input: '3\n5 3 7\n6', expectedOutput: 'false' }],
          starterCode: { python: 'n = int(input())\nvals = list(map(int, input().split()))\ntarget = int(input())\n# Build BST, search, print "true"/"false"', java: 'import java.util.*;\npublic class Solution {\n    public static void main(String[] args) { /* BST insert & search */ }\n}', cpp: '#include <iostream>\nusing namespace std;\nint main() { /* BST insert & search */ return 0; }' },
        }),
        mkProblem('validate-bst', 'Validate BST', 'medium', 'Check if a binary tree is a valid BST.', {
          examples: [{ input: 'tree = [2,1,3]', output: 'true' }, { input: 'tree = [5,1,4,null,null,3,6]', output: 'false' }],
          constraints: ['1 <= nodes <= 10^4'],
          testCases: [{ input: '2 1 3', expectedOutput: 'true' }, { input: '5 1 4 null null 3 6', expectedOutput: 'false' }],
          starterCode: { python: 'vals = input().split()\n# Build tree, print "true"/"false"', java: 'import java.util.*;\npublic class Solution {\n    public static void main(String[] args) { /* Validate BST */ }\n}', cpp: '#include <iostream>\nusing namespace std;\nint main() { /* Validate BST */ return 0; }' },
        }),
        mkProblem('bst-delete', 'Delete Node in BST', 'hard', 'Delete a node from a BST and maintain BST property. Print inorder after deletion.', {
          examples: [{ input: 'tree = [5,3,6,2,4,null,7], key = 3', output: '2 4 5 6 7' }],
          constraints: ['1 <= nodes <= 10^4'],
          testCases: [{ input: '5 3 6 2 4 null 7\n3', expectedOutput: '2 4 5 6 7' }],
          starterCode: { python: 'vals = input().split()\nkey = int(input())\n# Delete key, print inorder', java: 'import java.util.*;\npublic class Solution {\n    public static void main(String[] args) { /* Delete BST node */ }\n}', cpp: '#include <iostream>\nusing namespace std;\nint main() { /* Delete BST node */ return 0; }' },
        }),
      ]
    },
    {
      id: 'heaps', title: 'Heaps / Priority Queues', icon: '⛰️', color: 'purple', order: 25, hours: 4,
      def: 'A heap is a complete binary tree where every parent is greater (max-heap) or smaller (min-heap) than its children.',
      analogy: 'Like a tournament bracket — the winner of each match moves up, so the champion is always at the top.',
      why: 'O(log n) insert and extract-min/max. Used in Dijkstra\'s, heap sort, median finding, and task scheduling.',
      beg: { title: 'Min/Max Heap & Operations', content: 'A heap is stored as an array. For node at index i: left child = 2i+1, right child = 2i+2, parent = (i-1)/2. Insert: add at end, bubble up. Extract: remove root, replace with last, bubble down.',
        py: `import heapq\n\n# Min-heap\nheap = []\nheapq.heappush(heap, 5)\nheapq.heappush(heap, 3)\nheapq.heappush(heap, 7)\nheapq.heappush(heap, 1)\n\nprint(heapq.heappop(heap))  # 1 (smallest)\nprint(heapq.heappop(heap))  # 3\n\n# Build heap from list\narr = [5, 3, 7, 1, 4]\nheapq.heapify(arr)  # O(n)\nprint(arr)  # [1, 3, 7, 5, 4]\n\n# Max-heap trick: negate values\nmax_heap = []\nheapq.heappush(max_heap, -5)\nheapq.heappush(max_heap, -3)\nprint(-heapq.heappop(max_heap))  # 5`,
        java: `PriorityQueue<Integer> minHeap = new PriorityQueue<>();\nminHeap.offer(5); minHeap.offer(3); minHeap.offer(1);\nSystem.out.println(minHeap.poll()); // 1\n\nPriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());\nmaxHeap.offer(5); maxHeap.offer(3); maxHeap.offer(1);\nSystem.out.println(maxHeap.poll()); // 5`,
        cpp: `// Max-heap (default)\npriority_queue<int> maxH;\nmaxH.push(5); maxH.push(3); maxH.push(1);\ncout << maxH.top(); // 5\n\n// Min-heap\npriority_queue<int, vector<int>, greater<int>> minH;\nminH.push(5); minH.push(3); minH.push(1);\ncout << minH.top(); // 1` },
      mid: { title: 'Heap Sort & Kth Smallest', content: 'Heap sort: Build max-heap, repeatedly extract max and place at end. O(n log n), in-place. Kth smallest: use a max-heap of size k. If new element < top, replace top. Final top = kth smallest.',
        py: `# Kth smallest element\ndef kth_smallest(nums, k):\n    import heapq\n    return heapq.nsmallest(k, nums)[-1]\n\n# Kth largest\ndef kth_largest(nums, k):\n    import heapq\n    heap = nums[:k]\n    heapq.heapify(heap)\n    for num in nums[k:]:\n        if num > heap[0]:\n            heapq.heapreplace(heap, num)\n    return heap[0]\n\nprint(kth_largest([3,2,1,5,6,4], 2))  # 5`,
        java: `int kthLargest(int[] nums, int k) {\n    PriorityQueue<Integer> pq = new PriorityQueue<>();\n    for (int n : nums) {\n        pq.offer(n);\n        if (pq.size() > k) pq.poll();\n    }\n    return pq.peek();\n}`,
        cpp: `int kthLargest(vector<int>& nums, int k) {\n    priority_queue<int, vector<int>, greater<int>> pq;\n    for (int n : nums) {\n        pq.push(n);\n        if ((int)pq.size() > k) pq.pop();\n    }\n    return pq.top();\n}` },
      adv: { title: 'Median Stream & Merge K Sorted', content: 'Find median from data stream: Use two heaps — max-heap for lower half, min-heap for upper half. Balance sizes. Median = top of max-heap (or average of both tops).',
        py: `import heapq\n\nclass MedianFinder:\n    def __init__(self):\n        self.lo = []  # max-heap (negated)\n        self.hi = []  # min-heap\n\n    def add(self, num):\n        heapq.heappush(self.lo, -num)\n        heapq.heappush(self.hi, -heapq.heappop(self.lo))\n        if len(self.hi) > len(self.lo):\n            heapq.heappush(self.lo, -heapq.heappop(self.hi))\n\n    def median(self):\n        if len(self.lo) > len(self.hi):\n            return -self.lo[0]\n        return (-self.lo[0] + self.hi[0]) / 2\n\nmf = MedianFinder()\nfor n in [5, 15, 1, 3]: mf.add(n)\nprint(mf.median())  # 4.0`,
        java: `class MedianFinder {\n    PriorityQueue<Integer> lo = new PriorityQueue<>(Collections.reverseOrder());\n    PriorityQueue<Integer> hi = new PriorityQueue<>();\n    void addNum(int num) {\n        lo.offer(num); hi.offer(lo.poll());\n        if (hi.size() > lo.size()) lo.offer(hi.poll());\n    }\n    double findMedian() {\n        return lo.size() > hi.size() ? lo.peek() : (lo.peek() + hi.peek()) / 2.0;\n    }\n}`,
        cpp: `class MedianFinder {\n    priority_queue<int> lo;\n    priority_queue<int, vector<int>, greater<int>> hi;\npublic:\n    void addNum(int num) {\n        lo.push(num); hi.push(lo.top()); lo.pop();\n        if (hi.size() > lo.size()) { lo.push(hi.top()); hi.pop(); }\n    }\n    double findMedian() {\n        return lo.size() > hi.size() ? lo.top() : (lo.top() + hi.top()) / 2.0;\n    }\n};` },
      tc: [{ operation: 'Insert', best: 'O(1)', average: 'O(log n)', worst: 'O(log n)' }, { operation: 'Extract Min/Max', best: 'O(log n)', average: 'O(log n)', worst: 'O(log n)' }, { operation: 'Heapify', best: 'O(n)', average: 'O(n)', worst: 'O(n)' }],
      sc: 'O(n)',
      probs: [
        mkProblem('kth-largest-element', 'Kth Largest Element', 'medium', 'Find the kth largest element in an unsorted array using a heap.', {
          examples: [{ input: 'nums = [3,2,1,5,6,4], k = 2', output: '5' }],
          constraints: ['1 <= k <= n <= 10^5'],
          testCases: [{ input: '6\n3 2 1 5 6 4\n2', expectedOutput: '5' }],
          starterCode: { python: 'n = int(input())\nnums = list(map(int, input().split()))\nk = int(input())\n# Print kth largest', java: 'import java.util.*;\npublic class Solution {\n    public static void main(String[] args) { /* Kth largest */ }\n}', cpp: '#include <iostream>\n#include <queue>\nusing namespace std;\nint main() { /* Kth largest */ return 0; }' },
        }),
        mkProblem('find-median-stream', 'Find Median from Stream', 'hard', 'Find the median from a continuous stream of numbers using two heaps.', {
          examples: [{ input: 'stream = [5,15,1,3]', output: '5.0\n10.0\n5.0\n4.0' }],
          constraints: ['-10^5 <= num <= 10^5', 'Up to 5 × 10^4 calls'],
          testCases: [{ input: '4\n5 15 1 3', expectedOutput: '5.0\n10.0\n5.0\n4.0' }],
          starterCode: { python: 'n = int(input())\nnums = list(map(int, input().split()))\n# After each number, print current median', java: 'import java.util.*;\npublic class Solution {\n    public static void main(String[] args) { /* Median stream */ }\n}', cpp: '#include <iostream>\n#include <queue>\nusing namespace std;\nint main() { /* Median stream */ return 0; }' },
        }),
      ]
    },
    {
      id: 'hashing', title: 'Hashing', icon: '#️⃣', color: 'amber', order: 26, hours: 3,
      def: 'Hashing maps data to fixed-size values using a hash function. Hash tables provide average O(1) lookup, insert, and delete.',
      analogy: 'Like a library catalog — compute a shelf number from the book title and go directly there.',
      why: 'Hash maps are the most used data structure in interviews. O(1) average operations power caching, databases, and deduplication.',
      beg: { title: 'Hash Map Basics & Frequency Count', content: 'A hash map stores key-value pairs. Hash function converts key → index. Collision: when two keys map to same index.',
        py: `# Hash map (dictionary) basics\nfreq = {}\nfor char in "hello":\n    freq[char] = freq.get(char, 0) + 1\nprint(freq)  # {'h': 1, 'e': 1, 'l': 2, 'o': 1}\n\n# Two Sum using hash map\ndef two_sum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        comp = target - num\n        if comp in seen:\n            return [seen[comp], i]\n        seen[num] = i\n    return []\n\nprint(two_sum([2, 7, 11, 15], 9))  # [0, 1]`,
        java: `Map<Character, Integer> freq = new HashMap<>();\nfor (char c : "hello".toCharArray())\n    freq.merge(c, 1, Integer::sum);\nSystem.out.println(freq);`,
        cpp: `unordered_map<char, int> freq;\nfor (char c : string("hello")) freq[c]++;\nfor (auto& [k,v] : freq) cout << k << ":" << v << " ";` },
      mid: { title: 'Collision Handling & Chaining', content: 'Collision resolution:\n• Chaining: Each bucket holds a linked list of entries\n• Open addressing: Find another slot (linear probing, quadratic probing)\n\nLoad factor = n/m (entries/buckets). Rehash when load factor > 0.75.',
        py: `# Simple hash table with chaining\nclass HashTable:\n    def __init__(self, size=16):\n        self.size = size\n        self.buckets = [[] for _ in range(size)]\n\n    def _hash(self, key):\n        return hash(key) % self.size\n\n    def put(self, key, value):\n        idx = self._hash(key)\n        for i, (k, v) in enumerate(self.buckets[idx]):\n            if k == key:\n                self.buckets[idx][i] = (key, value)\n                return\n        self.buckets[idx].append((key, value))\n\n    def get(self, key):\n        idx = self._hash(key)\n        for k, v in self.buckets[idx]:\n            if k == key: return v\n        return None\n\nht = HashTable()\nht.put("name", "Alice")\nprint(ht.get("name"))  # Alice`,
        java: `// Java HashMap uses chaining with red-black trees (Java 8+)\nMap<String, Integer> map = new HashMap<>();\nmap.put("apple", 3);\nmap.put("banana", 5);\nSystem.out.println(map.getOrDefault("cherry", 0)); // 0`,
        cpp: `// C++ unordered_map uses chaining\nunordered_map<string, int> map;\nmap["apple"] = 3;\nmap["banana"] = 5;\ncout << map.count("cherry"); // 0` },
      adv: { title: 'Open Addressing & Custom Hash', content: 'Open addressing: Linear probing (check next slot), quadratic probing (check i² slots away), double hashing. Rolling hash (Rabin-Karp): Hash a window of characters, slide by removing first char\'s contribution and adding new char\'s.',
        py: `# Rabin-Karp string matching with rolling hash\ndef rabin_karp(text, pattern):\n    base, mod = 256, 10**9 + 7\n    m, n = len(pattern), len(text)\n    p_hash = t_hash = 0\n    h = pow(base, m-1, mod)\n\n    for i in range(m):\n        p_hash = (p_hash * base + ord(pattern[i])) % mod\n        t_hash = (t_hash * base + ord(text[i])) % mod\n\n    results = []\n    for i in range(n - m + 1):\n        if p_hash == t_hash and text[i:i+m] == pattern:\n            results.append(i)\n        if i < n - m:\n            t_hash = (t_hash - ord(text[i]) * h) * base + ord(text[i+m])\n            t_hash %= mod\n    return results`,
        java: `// Rabin-Karp concept\nlong hash = 0;\nfor (int i = 0; i < m; i++)\n    hash = (hash * 256 + pattern.charAt(i)) % MOD;`,
        cpp: `// Rolling hash\nlong long h = 0;\nfor (int i = 0; i < m; i++)\n    h = (h * 256 + pattern[i]) % MOD;` },
      tc: [{ operation: 'Insert/Delete/Search', best: 'O(1)', average: 'O(1)', worst: 'O(n)' }],
      sc: 'O(n)',
      probs: [
        mkProblem('two-sum-hash', 'Two Sum (Hash Map)', 'easy', 'Find two numbers that add up to target using a hash map. Return indices.', {
          examples: [{ input: 'nums = [2,7,11,15], target = 9', output: '0 1' }],
          constraints: ['2 <= n <= 10^4'],
          testCases: [{ input: '4\n2 7 11 15\n9', expectedOutput: '0 1' }],
          starterCode: { python: 'n = int(input())\nnums = list(map(int, input().split()))\ntarget = int(input())\n# Print indices', java: 'import java.util.*;\npublic class Solution {\n    public static void main(String[] args) { /* Two sum hash */ }\n}', cpp: '#include <iostream>\n#include <unordered_map>\nusing namespace std;\nint main() { /* Two sum hash */ return 0; }' },
        }),
        mkProblem('group-anagrams-hash', 'Group Anagrams', 'medium', 'Group strings that are anagrams using hash maps.', {
          examples: [{ input: 'strs = ["eat","tea","tan","ate","nat","bat"]', output: 'eat tea ate\ntan nat\nbat' }],
          constraints: ['1 <= strs.length <= 10^4'],
          testCases: [{ input: '6\neat tea tan ate nat bat', expectedOutput: 'eat tea ate\ntan nat\nbat' }],
          starterCode: { python: 'n = int(input())\nstrs = input().split()\n# Group and print anagrams', java: 'import java.util.*;\npublic class Solution {\n    public static void main(String[] args) { /* Group anagrams */ }\n}', cpp: '#include <iostream>\n#include <unordered_map>\nusing namespace std;\nint main() { /* Group anagrams */ return 0; }' },
        }),
        mkProblem('longest-consecutive', 'Longest Consecutive Sequence', 'hard', 'Find the length of the longest consecutive sequence in O(n) using a hash set.', {
          examples: [{ input: 'nums = [100,4,200,1,3,2]', output: '4', explanation: 'Sequence: [1,2,3,4]' }],
          constraints: ['0 <= n <= 10^5'],
          testCases: [{ input: '6\n100 4 200 1 3 2', expectedOutput: '4' }, { input: '10\n0 3 7 2 5 8 4 6 0 1', expectedOutput: '9' }],
          starterCode: { python: 'n = int(input())\nnums = list(map(int, input().split()))\n# Print longest consecutive length', java: 'import java.util.*;\npublic class Solution {\n    public static void main(String[] args) { /* Longest consecutive */ }\n}', cpp: '#include <iostream>\n#include <unordered_set>\nusing namespace std;\nint main() { /* Longest consecutive */ return 0; }' },
        }),
      ]
    },
    {
      id: 'tries', title: 'Tries', icon: '🔤', color: 'green', order: 27, hours: 4,
      def: 'A Trie (prefix tree) stores strings as paths from root, with each node representing a character.',
      analogy: 'Like autocomplete on your phone — each letter narrows down possible words.',
      why: 'O(m) operations (m = string length). Used in autocomplete, spell checkers, IP routing.',
      beg: { title: 'Insert & Search', content: 'Each Trie node has children (one per character) and an is_end flag. Insert: traverse/create nodes for each character. Search: traverse and check is_end.',
        py: `class TrieNode:\n    def __init__(self):\n        self.children = {}\n        self.is_end = False\n\nclass Trie:\n    def __init__(self):\n        self.root = TrieNode()\n\n    def insert(self, word):\n        node = self.root\n        for char in word:\n            if char not in node.children:\n                node.children[char] = TrieNode()\n            node = node.children[char]\n        node.is_end = True\n\n    def search(self, word):\n        node = self.root\n        for char in word:\n            if char not in node.children: return False\n            node = node.children[char]\n        return node.is_end\n\n    def starts_with(self, prefix):\n        node = self.root\n        for char in prefix:\n            if char not in node.children: return False\n            node = node.children[char]\n        return True\n\ntrie = Trie()\ntrie.insert("apple")\nprint(trie.search("apple"))    # True\nprint(trie.starts_with("app")) # True`,
        java: `class Trie {\n    TrieNode root = new TrieNode();\n    void insert(String word) {\n        TrieNode node = root;\n        for (char c : word.toCharArray()) {\n            node.children.putIfAbsent(c, new TrieNode());\n            node = node.children.get(c);\n        }\n        node.isEnd = true;\n    }\n    boolean search(String word) {\n        TrieNode node = root;\n        for (char c : word.toCharArray()) {\n            if (!node.children.containsKey(c)) return false;\n            node = node.children.get(c);\n        }\n        return node.isEnd;\n    }\n}`,
        cpp: `struct TrieNode {\n    unordered_map<char, TrieNode*> children;\n    bool isEnd = false;\n};\n\nclass Trie {\n    TrieNode* root = new TrieNode();\npublic:\n    void insert(string word) {\n        auto node = root;\n        for (char c : word) {\n            if (!node->children.count(c))\n                node->children[c] = new TrieNode();\n            node = node->children[c];\n        }\n        node->isEnd = true;\n    }\n};` },
      mid: { title: 'Autocomplete & Word Dictionary', content: 'Autocomplete: Given a prefix, find all words with that prefix using DFS from the prefix node. Word dictionary with wildcards: Use DFS with branching on "." characters.',
        py: `# Autocomplete: find all words with given prefix\ndef autocomplete(trie, prefix):\n    node = trie.root\n    for char in prefix:\n        if char not in node.children: return []\n        node = node.children[char]\n    \n    results = []\n    def dfs(node, path):\n        if node.is_end:\n            results.append(prefix + path)\n        for char, child in node.children.items():\n            dfs(child, path + char)\n    \n    dfs(node, "")\n    return results`,
        java: `List<String> autocomplete(TrieNode node, String prefix) {\n    List<String> results = new ArrayList<>();\n    dfs(node, prefix, results);\n    return results;\n}\nvoid dfs(TrieNode node, String prefix, List<String> results) {\n    if (node.isEnd) results.add(prefix);\n    for (var e : node.children.entrySet())\n        dfs(e.getValue(), prefix + e.getKey(), results);\n}`,
        cpp: `void dfs(TrieNode* node, string& prefix, vector<string>& results) {\n    if (node->isEnd) results.push_back(prefix);\n    for (auto& [c, child] : node->children) {\n        prefix.push_back(c);\n        dfs(child, prefix, results);\n        prefix.pop_back();\n    }\n}` },
      adv: { title: 'Compressed Trie & XOR Trie', content: 'Compressed (radix) trie: Merge single-child chains into one node storing multiple characters. Reduces space. XOR trie: Store numbers in binary trie. Used to find maximum XOR pair in O(n × 32).',
        py: `# Maximum XOR using trie\ndef find_max_xor(nums):\n    root = {}\n    max_xor = 0\n    for num in nums:\n        # Insert\n        node = root\n        for i in range(31, -1, -1):\n            bit = (num >> i) & 1\n            if bit not in node:\n                node[bit] = {}\n            node = node[bit]\n        # Query (try opposite bit for max XOR)\n        node = root\n        curr_xor = 0\n        for i in range(31, -1, -1):\n            bit = (num >> i) & 1\n            opposite = 1 - bit\n            if opposite in node:\n                curr_xor |= (1 << i)\n                node = node[opposite]\n            else:\n                node = node[bit]\n        max_xor = max(max_xor, curr_xor)\n    return max_xor`,
        java: `// XOR Trie: insert number bit by bit (31 to 0)\n// For max XOR, try to take opposite bit at each level`,
        cpp: `// XOR Trie for maximum XOR pair\n// Insert each number's bits from MSB to LSB\n// Query by trying opposite bits for maximum XOR` },
      tc: [{ operation: 'Insert/Search', best: 'O(m)', average: 'O(m)', worst: 'O(m)' }],
      sc: 'O(n × m) where n=words, m=avg length',
      probs: [
        mkProblem('implement-trie', 'Implement Trie', 'medium', 'Build a trie with insert, search, and startsWith operations.', {
          examples: [{ input: 'insert "apple", search "apple" → true, startsWith "app" → true', output: 'true\ntrue' }],
          constraints: ['1 <= word.length <= 2000'],
          testCases: [{ input: '5\ninsert apple\nsearch apple\nsearch app\nstartsWith app\ninsert app', expectedOutput: 'true\nfalse\ntrue' }],
          starterCode: { python: 'n = int(input())\n# Implement Trie, process commands', java: 'import java.util.*;\npublic class Solution {\n    public static void main(String[] args) { /* Trie */ }\n}', cpp: '#include <iostream>\n#include <unordered_map>\nusing namespace std;\nint main() { /* Trie */ return 0; }' },
        }),
        mkProblem('word-search-ii', 'Word Search II', 'hard', 'Find all words from a dictionary that exist in a 2D board using Trie for efficiency.', {
          examples: [{ input: 'board = [["o","a","a","n"],["e","t","a","e"]], words = ["oath","pea","eat","rain"]', output: 'oath eat' }],
          constraints: ['1 <= m, n <= 12', '1 <= words.length <= 3 × 10^4'],
          testCases: [{ input: '2 4\no a a n\ne t a e\n4\noath pea eat rain', expectedOutput: 'eat oath' }],
          starterCode: { python: 'r, c = map(int, input().split())\nboard = [input().split() for _ in range(r)]\nn = int(input())\nwords = input().split()\n# Print found words', java: 'import java.util.*;\npublic class Solution {\n    public static void main(String[] args) { /* Word Search II */ }\n}', cpp: '#include <iostream>\nusing namespace std;\nint main() { /* Word Search II */ return 0; }' },
        }),
      ]
    },
    {
      id: 'graphs', title: 'Graphs', icon: '🕸️', color: 'cyan', order: 28, hours: 8,
      def: 'A graph consists of vertices connected by edges. Can be directed/undirected, weighted/unweighted.',
      analogy: 'Like a social network — people are nodes and friendships are edges.',
      why: 'Graphs model networks, maps, dependencies. BFS, DFS, Dijkstra\'s, and topological sort are essential.',
      beg: { title: 'Adjacency List, BFS & DFS', content: 'Represent graph as adjacency list: dict/map from node → list of neighbors. BFS uses queue (shortest path in unweighted). DFS uses stack/recursion (explore deep first).',
        py: `from collections import deque\n\n# Adjacency list\ngraph = {\n    'A': ['B', 'C'],\n    'B': ['A', 'D', 'E'],\n    'C': ['A', 'F'],\n    'D': ['B'], 'E': ['B', 'F'], 'F': ['C', 'E']\n}\n\n# BFS\ndef bfs(graph, start):\n    visited = set([start])\n    queue = deque([start])\n    order = []\n    while queue:\n        node = queue.popleft()\n        order.append(node)\n        for neighbor in graph[node]:\n            if neighbor not in visited:\n                visited.add(neighbor)\n                queue.append(neighbor)\n    return order\n\n# DFS\ndef dfs(graph, start, visited=None):\n    if visited is None: visited = set()\n    visited.add(start)\n    result = [start]\n    for neighbor in graph[start]:\n        if neighbor not in visited:\n            result += dfs(graph, neighbor, visited)\n    return result\n\nprint("BFS:", bfs(graph, 'A'))\nprint("DFS:", dfs(graph, 'A'))`,
        java: `// BFS\nvoid bfs(Map<String, List<String>> graph, String start) {\n    Set<String> visited = new HashSet<>();\n    Queue<String> q = new LinkedList<>();\n    visited.add(start); q.offer(start);\n    while (!q.isEmpty()) {\n        String node = q.poll();\n        System.out.print(node + " ");\n        for (String n : graph.get(node))\n            if (visited.add(n)) q.offer(n);\n    }\n}`,
        cpp: `void bfs(unordered_map<string, vector<string>>& graph, string start) {\n    unordered_set<string> visited;\n    queue<string> q;\n    visited.insert(start); q.push(start);\n    while (!q.empty()) {\n        auto node = q.front(); q.pop();\n        cout << node << " ";\n        for (auto& n : graph[node])\n            if (!visited.count(n)) { visited.insert(n); q.push(n); }\n    }\n}` },
      mid: { title: 'Cycle Detection & Topological Sort', content: 'Cycle in undirected: DFS — if you visit an already-visited node that\'s not the parent → cycle. Cycle in directed: DFS with coloring (white/gray/black). Topological sort: Order vertices so all edges go left-to-right (DAG only). Kahn\'s algorithm uses in-degree and queue.',
        py: `# Topological Sort (Kahn's algorithm)\ndef topological_sort(graph, in_degree):\n    queue = deque([n for n in in_degree if in_degree[n] == 0])\n    order = []\n    while queue:\n        node = queue.popleft()\n        order.append(node)\n        for neighbor in graph.get(node, []):\n            in_degree[neighbor] -= 1\n            if in_degree[neighbor] == 0:\n                queue.append(neighbor)\n    return order if len(order) == len(in_degree) else []  # empty = cycle\n\n# Cycle detection (undirected)\ndef has_cycle(graph, n):\n    visited = [False] * n\n    def dfs(node, parent):\n        visited[node] = True\n        for neighbor in graph[node]:\n            if not visited[neighbor]:\n                if dfs(neighbor, node): return True\n            elif neighbor != parent:\n                return True\n        return False\n    for i in range(n):\n        if not visited[i] and dfs(i, -1): return True\n    return False`,
        java: `// Topological sort using Kahn's algorithm\nList<Integer> topoSort(int n, List<List<Integer>> adj) {\n    int[] inDeg = new int[n];\n    for (var list : adj) for (int v : list) inDeg[v]++;\n    Queue<Integer> q = new LinkedList<>();\n    for (int i = 0; i < n; i++) if (inDeg[i] == 0) q.offer(i);\n    List<Integer> order = new ArrayList<>();\n    while (!q.isEmpty()) {\n        int u = q.poll(); order.add(u);\n        for (int v : adj.get(u)) if (--inDeg[v] == 0) q.offer(v);\n    }\n    return order;\n}`,
        cpp: `vector<int> topoSort(int n, vector<vector<int>>& adj) {\n    vector<int> inDeg(n, 0);\n    for (int u = 0; u < n; u++) for (int v : adj[u]) inDeg[v]++;\n    queue<int> q;\n    for (int i = 0; i < n; i++) if (!inDeg[i]) q.push(i);\n    vector<int> order;\n    while (!q.empty()) {\n        int u = q.front(); q.pop(); order.push_back(u);\n        for (int v : adj[u]) if (--inDeg[v] == 0) q.push(v);\n    }\n    return order;\n}` },
      adv: { title: 'Dijkstra, Bellman-Ford & MST', content: 'Dijkstra: Shortest path from source (non-negative weights). Uses priority queue. O((V+E) log V).\nBellman-Ford: Handles negative weights. Relax all edges V-1 times. O(V×E).\nMST (Kruskal/Prim): Minimum cost to connect all vertices.',
        py: `import heapq\n\n# Dijkstra's shortest path\ndef dijkstra(graph, start):\n    dist = {node: float('inf') for node in graph}\n    dist[start] = 0\n    pq = [(0, start)]\n    while pq:\n        d, u = heapq.heappop(pq)\n        if d > dist[u]: continue\n        for v, w in graph[u]:\n            if dist[u] + w < dist[v]:\n                dist[v] = dist[u] + w\n                heapq.heappush(pq, (dist[v], v))\n    return dist\n\n# Graph: {node: [(neighbor, weight), ...]}\ngraph = {\n    'A': [('B',1),('C',4)],\n    'B': [('C',2),('D',5)],\n    'C': [('D',1)],\n    'D': []\n}\nprint(dijkstra(graph, 'A'))  # {'A': 0, 'B': 1, 'C': 3, 'D': 4}`,
        java: `int[] dijkstra(int[][] graph, int src, int n) {\n    int[] dist = new int[n]; Arrays.fill(dist, Integer.MAX_VALUE);\n    dist[src] = 0;\n    PriorityQueue<int[]> pq = new PriorityQueue<>((a,b)->a[1]-b[1]);\n    pq.offer(new int[]{src, 0});\n    while (!pq.isEmpty()) {\n        int[] curr = pq.poll();\n        int u = curr[0], d = curr[1];\n        if (d > dist[u]) continue;\n        for (int[] e : graph[u]) {\n            if (dist[u] + e[1] < dist[e[0]]) {\n                dist[e[0]] = dist[u] + e[1];\n                pq.offer(new int[]{e[0], dist[e[0]]});\n            }\n        }\n    }\n    return dist;\n}`,
        cpp: `vector<int> dijkstra(vector<vector<pair<int,int>>>& graph, int src) {\n    int n = graph.size();\n    vector<int> dist(n, INT_MAX);\n    dist[src] = 0;\n    priority_queue<pair<int,int>, vector<pair<int,int>>, greater<>> pq;\n    pq.push({0, src});\n    while (!pq.empty()) {\n        auto [d, u] = pq.top(); pq.pop();\n        if (d > dist[u]) continue;\n        for (auto [v, w] : graph[u]) {\n            if (dist[u] + w < dist[v]) {\n                dist[v] = dist[u] + w;\n                pq.push({dist[v], v});\n            }\n        }\n    }\n    return dist;\n}` },
      tc: [{ operation: 'BFS/DFS', best: 'O(V+E)', average: 'O(V+E)', worst: 'O(V+E)' }, { operation: 'Dijkstra', best: 'O((V+E)log V)', average: 'O((V+E)log V)', worst: 'O((V+E)log V)' }],
      sc: 'O(V+E)',
      probs: [
        mkProblem('bfs-shortest-path', 'BFS Shortest Path', 'easy', 'Find shortest path in an unweighted graph using BFS.', {
          examples: [{ input: 'graph with 5 nodes, start=0, end=4', output: '2' }],
          constraints: ['1 <= V <= 10^4', '0 <= E <= 10^5'],
          testCases: [{ input: '5 6\n0 1\n0 2\n1 3\n2 3\n3 4\n1 4\n0 4', expectedOutput: '2' }],
          starterCode: { python: 'v, e = map(int, input().split())\nedges = [tuple(map(int, input().split())) for _ in range(e)]\nstart, end = map(int, input().split())\n# Print shortest distance', java: 'import java.util.*;\npublic class Solution {\n    public static void main(String[] args) { /* BFS */ }\n}', cpp: '#include <iostream>\n#include <vector>\n#include <queue>\nusing namespace std;\nint main() { /* BFS */ return 0; }' },
        }),
        mkProblem('course-schedule', 'Course Schedule (Topo Sort)', 'medium', 'Determine if you can finish all courses given prerequisites. Detect cycle in directed graph.', {
          examples: [{ input: 'numCourses=2, prerequisites=[[1,0]]', output: 'true', explanation: 'Take course 0 then 1.' }],
          constraints: ['1 <= numCourses <= 2000', '0 <= prerequisites.length <= 5000'],
          testCases: [{ input: '2 1\n1 0', expectedOutput: 'true' }, { input: '2 2\n1 0\n0 1', expectedOutput: 'false' }],
          starterCode: { python: 'n, m = map(int, input().split())\nprereqs = [tuple(map(int, input().split())) for _ in range(m)]\n# Print "true" or "false"', java: 'import java.util.*;\npublic class Solution {\n    public static void main(String[] args) { /* Course schedule */ }\n}', cpp: '#include <iostream>\n#include <vector>\nusing namespace std;\nint main() { /* Course schedule */ return 0; }' },
        }),
        mkProblem('dijkstra-impl', 'Dijkstra\'s Shortest Path', 'hard', 'Find shortest paths from source in a weighted graph using Dijkstra\'s algorithm.', {
          examples: [{ input: 'graph: A→B(1), A→C(4), B→C(2), B→D(5), C→D(1), src=A', output: 'A:0 B:1 C:3 D:4' }],
          constraints: ['1 <= V <= 10^4', '0 <= E <= 10^5', 'Non-negative weights'],
          testCases: [{ input: '4 5\n0 1 1\n0 2 4\n1 2 2\n1 3 5\n2 3 1\n0', expectedOutput: '0 1 3 4' }],
          starterCode: { python: 'v, e = map(int, input().split())\nedges = []\nfor _ in range(e):\n    u, v_, w = map(int, input().split())\n    edges.append((u, v_, w))\nsrc = int(input())\n# Print shortest distances', java: 'import java.util.*;\npublic class Solution {\n    public static void main(String[] args) { /* Dijkstra */ }\n}', cpp: '#include <iostream>\n#include <vector>\n#include <queue>\nusing namespace std;\nint main() { /* Dijkstra */ return 0; }' },
        }),
      ]
    },
    {
      id: 'dp', title: 'Dynamic Programming', icon: '📐', color: 'purple', order: 29, hours: 10,
      def: 'Dynamic Programming solves problems by breaking them into overlapping subproblems and storing results to avoid redundant computation.',
      analogy: 'Like filling in a crossword — solve easier clues first and use those answers to help with harder ones.',
      why: 'DP optimizes problems from exponential to polynomial time. Essential for knapsack, LCS, edit distance.',
      beg: { title: 'Fibonacci & Climbing Stairs', content: 'DP has two approaches:\n1. Top-down (memoization): Recursion + cache results\n2. Bottom-up (tabulation): Build solution iteratively from base cases\n\nClimbing stairs: You can climb 1 or 2 steps. How many ways to reach step n? dp[n] = dp[n-1] + dp[n-2].',
        py: `# Climbing stairs — bottom-up DP\ndef climb_stairs(n):\n    if n <= 2: return n\n    dp = [0] * (n + 1)\n    dp[1], dp[2] = 1, 2\n    for i in range(3, n + 1):\n        dp[i] = dp[i-1] + dp[i-2]\n    return dp[n]\n\nprint(climb_stairs(5))  # 8\n\n# Space-optimized\ndef climb_stairs_opt(n):\n    if n <= 2: return n\n    a, b = 1, 2\n    for _ in range(3, n + 1):\n        a, b = b, a + b\n    return b`,
        java: `int climbStairs(int n) {\n    if (n <= 2) return n;\n    int a = 1, b = 2;\n    for (int i = 3; i <= n; i++) {\n        int temp = a + b;\n        a = b; b = temp;\n    }\n    return b;\n}`,
        cpp: `int climbStairs(int n) {\n    if (n <= 2) return n;\n    int a = 1, b = 2;\n    for (int i = 3; i <= n; i++) {\n        int temp = a + b;\n        a = b; b = temp;\n    }\n    return b;\n}` },
      mid: { title: '0/1 Knapsack, LCS & LIS', content: '0/1 Knapsack: Given items with weight and value, maximize value within weight limit. dp[i][w] = max value using first i items with capacity w.\n\nLCS (Longest Common Subsequence): dp[i][j] = LCS length of first i chars of s1 and first j chars of s2.\n\nLIS (Longest Increasing Subsequence): dp[i] = length of LIS ending at index i.',
        py: `# 0/1 Knapsack\ndef knapsack(weights, values, capacity):\n    n = len(weights)\n    dp = [[0] * (capacity + 1) for _ in range(n + 1)]\n    for i in range(1, n + 1):\n        for w in range(capacity + 1):\n            dp[i][w] = dp[i-1][w]  # don't take\n            if weights[i-1] <= w:\n                dp[i][w] = max(dp[i][w], dp[i-1][w-weights[i-1]] + values[i-1])\n    return dp[n][capacity]\n\n# LCS\ndef lcs(s1, s2):\n    m, n = len(s1), len(s2)\n    dp = [[0] * (n+1) for _ in range(m+1)]\n    for i in range(1, m+1):\n        for j in range(1, n+1):\n            if s1[i-1] == s2[j-1]:\n                dp[i][j] = dp[i-1][j-1] + 1\n            else:\n                dp[i][j] = max(dp[i-1][j], dp[i][j-1])\n    return dp[m][n]\n\n# LIS — O(n log n)\ndef lis(nums):\n    from bisect import bisect_left\n    tails = []\n    for num in nums:\n        pos = bisect_left(tails, num)\n        if pos == len(tails): tails.append(num)\n        else: tails[pos] = num\n    return len(tails)`,
        java: `int knapsack(int[] wt, int[] val, int cap) {\n    int n = wt.length;\n    int[][] dp = new int[n+1][cap+1];\n    for (int i = 1; i <= n; i++)\n        for (int w = 0; w <= cap; w++) {\n            dp[i][w] = dp[i-1][w];\n            if (wt[i-1] <= w)\n                dp[i][w] = Math.max(dp[i][w], dp[i-1][w-wt[i-1]] + val[i-1]);\n        }\n    return dp[n][cap];\n}`,
        cpp: `int knapsack(vector<int>& wt, vector<int>& val, int cap) {\n    int n = wt.size();\n    vector<vector<int>> dp(n+1, vector<int>(cap+1, 0));\n    for (int i = 1; i <= n; i++)\n        for (int w = 0; w <= cap; w++) {\n            dp[i][w] = dp[i-1][w];\n            if (wt[i-1] <= w)\n                dp[i][w] = max(dp[i][w], dp[i-1][w-wt[i-1]] + val[i-1]);\n        }\n    return dp[n][cap];\n}` },
      adv: { title: 'Edit Distance, Matrix Chain & Bitmask DP', content: 'Edit distance: Minimum operations (insert, delete, replace) to convert s1 to s2. dp[i][j] = edit distance of s1[:i] and s2[:j].\n\nMatrix chain multiplication: Find optimal parenthesization to minimize scalar multiplications.\n\nBitmask DP: Use bitmask to represent visited states. Example: Traveling Salesman — dp[mask][i] = min cost to visit cities in mask, ending at i.',
        py: `# Edit distance\ndef edit_distance(s1, s2):\n    m, n = len(s1), len(s2)\n    dp = [[0] * (n+1) for _ in range(m+1)]\n    for i in range(m+1): dp[i][0] = i\n    for j in range(n+1): dp[0][j] = j\n    for i in range(1, m+1):\n        for j in range(1, n+1):\n            if s1[i-1] == s2[j-1]:\n                dp[i][j] = dp[i-1][j-1]\n            else:\n                dp[i][j] = 1 + min(dp[i-1][j],    # delete\n                                   dp[i][j-1],    # insert\n                                   dp[i-1][j-1])  # replace\n    return dp[m][n]\n\nprint(edit_distance("kitten", "sitting"))  # 3\n\n# Coin change — minimum coins\ndef coin_change(coins, amount):\n    dp = [float('inf')] * (amount + 1)\n    dp[0] = 0\n    for coin in coins:\n        for x in range(coin, amount + 1):\n            dp[x] = min(dp[x], dp[x - coin] + 1)\n    return dp[amount] if dp[amount] != float('inf') else -1`,
        java: `int editDistance(String s1, String s2) {\n    int m = s1.length(), n = s2.length();\n    int[][] dp = new int[m+1][n+1];\n    for (int i = 0; i <= m; i++) dp[i][0] = i;\n    for (int j = 0; j <= n; j++) dp[0][j] = j;\n    for (int i = 1; i <= m; i++)\n        for (int j = 1; j <= n; j++) {\n            if (s1.charAt(i-1) == s2.charAt(j-1)) dp[i][j] = dp[i-1][j-1];\n            else dp[i][j] = 1 + Math.min(dp[i-1][j-1], Math.min(dp[i-1][j], dp[i][j-1]));\n        }\n    return dp[m][n];\n}`,
        cpp: `int editDistance(string s1, string s2) {\n    int m = s1.size(), n = s2.size();\n    vector<vector<int>> dp(m+1, vector<int>(n+1));\n    for (int i = 0; i <= m; i++) dp[i][0] = i;\n    for (int j = 0; j <= n; j++) dp[0][j] = j;\n    for (int i = 1; i <= m; i++)\n        for (int j = 1; j <= n; j++) {\n            if (s1[i-1] == s2[j-1]) dp[i][j] = dp[i-1][j-1];\n            else dp[i][j] = 1 + min({dp[i-1][j-1], dp[i-1][j], dp[i][j-1]});\n        }\n    return dp[m][n];\n}` },
      tc: [{ operation: 'Fibonacci/Stairs', best: 'O(n)', average: 'O(n)', worst: 'O(n)' }, { operation: 'Knapsack/LCS', best: 'O(n×m)', average: 'O(n×m)', worst: 'O(n×m)' }, { operation: 'TSP (bitmask)', best: 'O(2^n × n²)', average: 'O(2^n × n²)', worst: 'O(2^n × n²)' }],
      sc: 'O(n×m) for 2D DP',
      probs: [
        mkProblem('climbing-stairs', 'Climbing Stairs', 'easy', 'Count ways to climb n stairs taking 1 or 2 steps at a time.', {
          examples: [{ input: 'n = 3', output: '3', explanation: '1+1+1, 1+2, 2+1' }],
          constraints: ['1 <= n <= 45'],
          testCases: [{ input: '3', expectedOutput: '3' }, { input: '5', expectedOutput: '8' }],
          starterCode: { python: 'n = int(input())\n# Print number of ways', java: 'import java.util.*;\npublic class Solution {\n    public static void main(String[] args) { int n = new Scanner(System.in).nextInt(); /* climb */ }\n}', cpp: '#include <iostream>\nusing namespace std;\nint main() { int n; cin >> n; /* climb */ return 0; }' },
        }),
        mkProblem('knapsack-01', '0/1 Knapsack', 'medium', 'Maximize value in a knapsack with weight constraint. Each item can be taken or left.', {
          examples: [{ input: 'W=50, items=[(60,10),(100,20),(120,30)]', output: '220' }],
          constraints: ['1 <= n <= 100', '1 <= W <= 10^4'],
          testCases: [{ input: '3 50\n60 10\n100 20\n120 30', expectedOutput: '220' }],
          starterCode: { python: 'n, W = map(int, input().split())\nitems = [tuple(map(int, input().split())) for _ in range(n)]\n# Print max value', java: 'import java.util.*;\npublic class Solution {\n    public static void main(String[] args) { /* 0/1 knapsack */ }\n}', cpp: '#include <iostream>\n#include <vector>\nusing namespace std;\nint main() { /* 0/1 knapsack */ return 0; }' },
        }),
        mkProblem('lcs-dp', 'Longest Common Subsequence', 'medium', 'Find the length of the longest common subsequence of two strings.', {
          examples: [{ input: 's1 = "abcde", s2 = "ace"', output: '3', explanation: 'LCS is "ace"' }],
          constraints: ['1 <= s1.length, s2.length <= 1000'],
          testCases: [{ input: 'abcde\nace', expectedOutput: '3' }, { input: 'abc\nabc', expectedOutput: '3' }],
          starterCode: { python: 's1 = input()\ns2 = input()\n# Print LCS length', java: 'import java.util.*;\npublic class Solution {\n    public static void main(String[] args) { /* LCS */ }\n}', cpp: '#include <iostream>\n#include <string>\nusing namespace std;\nint main() { /* LCS */ return 0; }' },
        }),
        mkProblem('edit-distance', 'Edit Distance', 'hard', 'Find the minimum number of operations (insert, delete, replace) to convert one string to another.', {
          examples: [{ input: 's1 = "kitten", s2 = "sitting"', output: '3' }],
          constraints: ['0 <= s1.length, s2.length <= 500'],
          testCases: [{ input: 'kitten\nsitting', expectedOutput: '3' }, { input: 'horse\nros', expectedOutput: '3' }],
          starterCode: { python: 's1 = input()\ns2 = input()\n# Print min edit distance', java: 'import java.util.*;\npublic class Solution {\n    public static void main(String[] args) { /* Edit distance */ }\n}', cpp: '#include <iostream>\n#include <string>\nusing namespace std;\nint main() { /* Edit distance */ return 0; }' },
        }),
      ]
    },
    {
      id: 'segment-trees', title: 'Segment Trees', icon: '🌲', color: 'amber', order: 30, hours: 6,
      def: 'A Segment Tree stores intervals and supports range queries (sum, min, max) and point updates in O(log n).',
      analogy: 'Like a sports league bracket that tracks aggregate stats — quickly find totals for any range of teams.',
      why: 'Essential for range query problems in competitive programming. Supports lazy propagation for range updates.',
      beg: { title: 'Build & Point Query', content: 'Segment tree is a complete binary tree. Each leaf = array element. Internal nodes store aggregate (sum/min/max) of their children. Build in O(n). Query and update in O(log n). Array size = 4n.',
        py: `class SegmentTree:\n    def __init__(self, arr):\n        self.n = len(arr)\n        self.tree = [0] * (4 * self.n)\n        self.build(arr, 1, 0, self.n - 1)\n\n    def build(self, arr, node, start, end):\n        if start == end:\n            self.tree[node] = arr[start]\n            return\n        mid = (start + end) // 2\n        self.build(arr, 2*node, start, mid)\n        self.build(arr, 2*node+1, mid+1, end)\n        self.tree[node] = self.tree[2*node] + self.tree[2*node+1]\n\n    def query(self, node, start, end, l, r):\n        if r < start or end < l: return 0\n        if l <= start and end <= r: return self.tree[node]\n        mid = (start + end) // 2\n        return (self.query(2*node, start, mid, l, r) +\n                self.query(2*node+1, mid+1, end, l, r))\n\n    def update(self, node, start, end, idx, val):\n        if start == end:\n            self.tree[node] = val\n            return\n        mid = (start + end) // 2\n        if idx <= mid: self.update(2*node, start, mid, idx, val)\n        else: self.update(2*node+1, mid+1, end, idx, val)\n        self.tree[node] = self.tree[2*node] + self.tree[2*node+1]\n\narr = [1, 3, 5, 7, 9, 11]\nst = SegmentTree(arr)\nprint(st.query(1, 0, 5, 1, 3))  # 15 (3+5+7)`,
        java: `class SegTree {\n    int[] tree; int n;\n    SegTree(int[] arr) {\n        n = arr.length; tree = new int[4*n];\n        build(arr, 1, 0, n-1);\n    }\n    void build(int[] arr, int nd, int s, int e) {\n        if (s == e) { tree[nd] = arr[s]; return; }\n        int m = (s+e)/2;\n        build(arr, 2*nd, s, m); build(arr, 2*nd+1, m+1, e);\n        tree[nd] = tree[2*nd] + tree[2*nd+1];\n    }\n    int query(int nd, int s, int e, int l, int r) {\n        if (r < s || e < l) return 0;\n        if (l <= s && e <= r) return tree[nd];\n        int m = (s+e)/2;\n        return query(2*nd, s, m, l, r) + query(2*nd+1, m+1, e, l, r);\n    }\n}`,
        cpp: `class SegTree {\n    vector<int> tree; int n;\npublic:\n    SegTree(vector<int>& arr) : n(arr.size()), tree(4*arr.size()) {\n        build(arr, 1, 0, n-1);\n    }\n    void build(vector<int>& arr, int nd, int s, int e) {\n        if (s == e) { tree[nd] = arr[s]; return; }\n        int m = (s+e)/2;\n        build(arr, 2*nd, s, m); build(arr, 2*nd+1, m+1, e);\n        tree[nd] = tree[2*nd] + tree[2*nd+1];\n    }\n    int query(int nd, int s, int e, int l, int r) {\n        if (r < s || e < l) return 0;\n        if (l <= s && e <= r) return tree[nd];\n        int m = (s+e)/2;\n        return query(2*nd,s,m,l,r) + query(2*nd+1,m+1,e,l,r);\n    }\n};` },
      mid: { title: 'Range Sum & Range Min Query', content: 'Range sum query: Sum of elements from index l to r. Range min query (RMQ): Minimum element in range. Both O(log n) per query. Sparse table can answer RMQ in O(1) per query after O(n log n) preprocessing.',
        py: `# Range Min Query Segment Tree\nclass RMQ:\n    def __init__(self, arr):\n        self.n = len(arr)\n        self.tree = [float('inf')] * (4 * self.n)\n        self.build(arr, 1, 0, self.n - 1)\n\n    def build(self, arr, node, s, e):\n        if s == e:\n            self.tree[node] = arr[s]\n            return\n        mid = (s + e) // 2\n        self.build(arr, 2*node, s, mid)\n        self.build(arr, 2*node+1, mid+1, e)\n        self.tree[node] = min(self.tree[2*node], self.tree[2*node+1])\n\n    def query(self, node, s, e, l, r):\n        if r < s or e < l: return float('inf')\n        if l <= s and e <= r: return self.tree[node]\n        mid = (s + e) // 2\n        return min(self.query(2*node, s, mid, l, r),\n                   self.query(2*node+1, mid+1, e, l, r))`,
        java: `// Same structure, use Math.min instead of +\nint queryMin(int nd, int s, int e, int l, int r) {\n    if (r < s || e < l) return Integer.MAX_VALUE;\n    if (l <= s && e <= r) return tree[nd];\n    int m = (s+e)/2;\n    return Math.min(queryMin(2*nd,s,m,l,r), queryMin(2*nd+1,m+1,e,l,r));\n}`,
        cpp: `int queryMin(int nd, int s, int e, int l, int r) {\n    if (r < s || e < l) return INT_MAX;\n    if (l <= s && e <= r) return tree[nd];\n    int m = (s+e)/2;\n    return min(queryMin(2*nd,s,m,l,r), queryMin(2*nd+1,m+1,e,l,r));\n}` },
      adv: { title: 'Lazy Propagation & Range Update', content: 'Range update (add value to all elements in [l,r]) requires lazy propagation. Store pending updates in a lazy array. Push pending updates down to children before processing queries. This keeps both update and query at O(log n).',
        py: `class LazySegTree:\n    def __init__(self, n):\n        self.n = n\n        self.tree = [0] * (4 * n)\n        self.lazy = [0] * (4 * n)\n\n    def push_down(self, node, s, e):\n        if self.lazy[node]:\n            mid = (s + e) // 2\n            self.apply(2*node, s, mid, self.lazy[node])\n            self.apply(2*node+1, mid+1, e, self.lazy[node])\n            self.lazy[node] = 0\n\n    def apply(self, node, s, e, val):\n        self.tree[node] += val * (e - s + 1)\n        self.lazy[node] += val\n\n    def range_update(self, node, s, e, l, r, val):\n        if r < s or e < l: return\n        if l <= s and e <= r:\n            self.apply(node, s, e, val)\n            return\n        self.push_down(node, s, e)\n        mid = (s + e) // 2\n        self.range_update(2*node, s, mid, l, r, val)\n        self.range_update(2*node+1, mid+1, e, l, r, val)\n        self.tree[node] = self.tree[2*node] + self.tree[2*node+1]\n\n    def query(self, node, s, e, l, r):\n        if r < s or e < l: return 0\n        if l <= s and e <= r: return self.tree[node]\n        self.push_down(node, s, e)\n        mid = (s + e) // 2\n        return (self.query(2*node, s, mid, l, r) +\n                self.query(2*node+1, mid+1, e, l, r))`,
        java: `// Lazy propagation — push pending updates before queries\nvoid pushDown(int node, int s, int e) {\n    if (lazy[node] != 0) {\n        int mid = (s+e)/2;\n        apply(2*node, s, mid, lazy[node]);\n        apply(2*node+1, mid+1, e, lazy[node]);\n        lazy[node] = 0;\n    }\n}`,
        cpp: `void pushDown(int node, int s, int e) {\n    if (lazy[node]) {\n        int mid = (s+e)/2;\n        apply(2*node, s, mid, lazy[node]);\n        apply(2*node+1, mid+1, e, lazy[node]);\n        lazy[node] = 0;\n    }\n}` },
      tc: [{ operation: 'Build', best: 'O(n)', average: 'O(n)', worst: 'O(n)' }, { operation: 'Query', best: 'O(log n)', average: 'O(log n)', worst: 'O(log n)' }, { operation: 'Update', best: 'O(log n)', average: 'O(log n)', worst: 'O(log n)' }],
      sc: 'O(n)',
      probs: [
        mkProblem('range-sum-query', 'Range Sum Query', 'medium', 'Build a segment tree, answer range sum queries, and handle point updates.', {
          examples: [{ input: 'arr = [1,3,5,7,9,11], query(1,3) = 15', output: '15' }],
          constraints: ['1 <= n <= 3 × 10^4'],
          testCases: [{ input: '6\n1 3 5 7 9 11\n2\nquery 1 3\nquery 0 5', expectedOutput: '15\n36' }],
          starterCode: { python: 'n = int(input())\narr = list(map(int, input().split()))\nq = int(input())\n# Build segment tree, process queries', java: 'import java.util.*;\npublic class Solution {\n    public static void main(String[] args) { /* Segment tree */ }\n}', cpp: '#include <iostream>\n#include <vector>\nusing namespace std;\nint main() { /* Segment tree */ return 0; }' },
        }),
        mkProblem('range-min-query', 'Range Min Query', 'medium', 'Implement range minimum query using a segment tree.', {
          examples: [{ input: 'arr = [2,5,1,4,9,3], query(1,4) = 1', output: '1' }],
          constraints: ['1 <= n <= 3 × 10^4'],
          testCases: [{ input: '6\n2 5 1 4 9 3\n1\nquery 1 4', expectedOutput: '1' }],
          starterCode: { python: 'n = int(input())\narr = list(map(int, input().split()))\n# Build RMQ segment tree', java: 'import java.util.*;\npublic class Solution {\n    public static void main(String[] args) { /* RMQ */ }\n}', cpp: '#include <iostream>\n#include <vector>\nusing namespace std;\nint main() { /* RMQ */ return 0; }' },
        }),
        mkProblem('lazy-propagation', 'Lazy Propagation', 'hard', 'Implement range update and range query using lazy propagation on a segment tree.', {
          examples: [{ input: 'arr = [1,3,5,7,9], add 2 to range [1,3], query(1,3) = 21', output: '21' }],
          constraints: ['1 <= n <= 10^5'],
          testCases: [{ input: '5\n1 3 5 7 9\n2\nupdate 1 3 2\nquery 1 3', expectedOutput: '21' }],
          starterCode: { python: 'n = int(input())\narr = list(map(int, input().split()))\n# Build lazy segment tree', java: 'import java.util.*;\npublic class Solution {\n    public static void main(String[] args) { /* Lazy seg tree */ }\n}', cpp: '#include <iostream>\n#include <vector>\nusing namespace std;\nint main() { /* Lazy seg tree */ return 0; }' },
        }),
      ]
    },
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
        title: t.beg.title,
        content: t.beg.content,
        codeExample: { python: t.beg.py, java: t.beg.java, cpp: t.beg.cpp },
      },
      intermediate: {
        title: t.mid.title,
        content: t.mid.content,
        codeExample: { python: t.mid.py, java: t.mid.java, cpp: t.mid.cpp },
      },
      advanced: {
        title: t.adv.title,
        content: t.adv.content,
        codeExample: { python: t.adv.py, java: t.adv.java, cpp: t.adv.cpp },
      },
    },
    timeComplexity: t.tc,
    spaceComplexity: t.sc,
    codeExamples: { python: '# See theory levels', java: '// See theory levels', cpp: '// See theory levels' },
    problems: t.probs,
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
