import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const TOPIC_TECHNIQUES: Record<string, string> = {
  arrays: "iteration, two pointers, sliding window, prefix sums",
  sorting: "bubble sort, merge sort, quick sort, counting sort, comparator functions",
  strings: "string traversal, pattern matching, character frequency, palindromes, substrings",
  "linked-lists": "singly/doubly linked list traversal, reversal, two pointers (slow/fast), merge",
  stacks: "LIFO operations, monotonic stack, expression evaluation, balanced parentheses",
  queues: "FIFO operations, circular queue, BFS traversal, deque, priority scheduling",
  "binary-trees": "tree traversal (inorder, preorder, postorder), recursion, height/depth, level-order (BFS)",
  bst: "BST search, insert, delete, inorder property, validation, floor/ceil",
  recursion: "base case/recursive case, call stack, tree recursion, memoization",
  dp: "overlapping subproblems, optimal substructure, tabulation, memoization, state transitions",
  graphs: "DFS, BFS, adjacency list/matrix, connected components, shortest path, cycle detection",
  greedy: "greedy choice property, activity selection, interval scheduling, Huffman coding",
  backtracking: "constraint satisfaction, permutations, combinations, N-Queens, sudoku",
  hashing: "hash maps, hash sets, collision handling, frequency counting, two-sum pattern",
  heaps: "min-heap, max-heap, heapify, priority queue, top-K elements, heap sort",
};

// ── Server-side driver code builder ──
// Builds I/O wrapper code based on method signature, so we don't ask the LLM for it.

interface Param { name: string; type: string }
interface MethodSig { name: string; params: Param[]; returnType: string }

function buildPythonReader(p: Param): string {
  const t = p.type.toLowerCase();
  if (t === "int") return `${p.name} = int(input())`;
  if (t === "int[]" || t === "list[int]") return `_n_${p.name} = int(input())\n${p.name} = list(map(int, input().split()))`;
  if (t === "string" || t === "str") return `${p.name} = input().strip()`;
  if (t === "string[]" || t === "list[str]") return `_n_${p.name} = int(input())\n${p.name} = [input().strip() for _ in range(_n_${p.name})]`;
  if (t === "bool" || t === "boolean") return `${p.name} = input().strip().lower() == "true"`;
  if (t === "float" || t === "double") return `${p.name} = float(input())`;
  if (t === "int[][]" || t === "list[list[int]]") return `_dims_${p.name} = input().split()\n_n_${p.name} = int(_dims_${p.name}[0])\n_m_${p.name} = int(_dims_${p.name}[1])\n${p.name} = [list(map(int, input().split())) for _ in range(_n_${p.name})]`;
  // fallback: read as string
  return `${p.name} = input().strip()`;
}

function buildPythonPrinter(returnType: string): string {
  const t = returnType.toLowerCase();
  if (t === "int" || t === "float" || t === "double" || t === "string" || t === "str") return "print(result)";
  if (t === "int[]" || t === "list[int]") return "print(' '.join(map(str, result)))";
  if (t === "string[]" || t === "list[str]") return "print(' '.join(result))";
  if (t === "bool" || t === "boolean") return 'print("true" if result else "false")';
  if (t === "int[][]" || t === "list[list[int]]") return 'print("\\n".join(" ".join(map(str, row)) for row in result))';
  if (t === "void") return "";
  return "print(result)";
}

function buildPythonDriver(sig: MethodSig): string {
  const readers = sig.params.map(p => buildPythonReader(p)).join("\n");
  const args = sig.params.map(p => p.name).join(", ");
  const printer = buildPythonPrinter(sig.returnType);
  return `# __USER_CODE__

import sys
input = sys.stdin.readline
sol = Solution()
${readers}
result = sol.${sig.name}(${args})
${printer}`;
}

function javaType(t: string): string {
  const lt = t.toLowerCase();
  if (lt === "int") return "int";
  if (lt === "int[]" || lt === "list[int]") return "int[]";
  if (lt === "string" || lt === "str") return "String";
  if (lt === "string[]" || lt === "list[str]") return "String[]";
  if (lt === "bool" || lt === "boolean") return "boolean";
  if (lt === "float") return "float";
  if (lt === "double") return "double";
  if (lt === "int[][]" || lt === "list[list[int]]") return "int[][]";
  return "String";
}

function buildJavaReader(p: Param): string {
  const jt = javaType(p.type);
  if (jt === "int") return `        int ${p.name} = Integer.parseInt(br.readLine().trim());`;
  if (jt === "int[]") return `        int _n_${p.name} = Integer.parseInt(br.readLine().trim());\n        int[] ${p.name} = new int[_n_${p.name}];\n        { StringTokenizer _st = new StringTokenizer(br.readLine());\n          for (int i = 0; i < _n_${p.name}; i++) ${p.name}[i] = Integer.parseInt(_st.nextToken()); }`;
  if (jt === "String") return `        String ${p.name} = br.readLine();`;
  if (jt === "String[]") return `        int _n_${p.name} = Integer.parseInt(br.readLine().trim());\n        String[] ${p.name} = new String[_n_${p.name}];\n        for (int i = 0; i < _n_${p.name}; i++) ${p.name}[i] = br.readLine();`;
  if (jt === "boolean") return `        boolean ${p.name} = br.readLine().trim().equals("true");`;
  if (jt === "double") return `        double ${p.name} = Double.parseDouble(br.readLine().trim());`;
  if (jt === "float") return `        float ${p.name} = Float.parseFloat(br.readLine().trim());`;
  if (jt === "int[][]") return `        int[][] ${p.name};\n        { StringTokenizer _st = new StringTokenizer(br.readLine());\n          int _n = Integer.parseInt(_st.nextToken()); int _m = Integer.parseInt(_st.nextToken());\n          ${p.name} = new int[_n][_m];\n          for (int i = 0; i < _n; i++) { StringTokenizer _st2 = new StringTokenizer(br.readLine());\n            for (int j = 0; j < _m; j++) ${p.name}[i][j] = Integer.parseInt(_st2.nextToken()); } }`;
  return `        String ${p.name} = br.readLine();`;
}

function buildJavaPrinter(returnType: string): string {
  const jt = javaType(returnType);
  if (jt === "int" || jt === "double" || jt === "float" || jt === "String") return "        System.out.println(result);";
  if (jt === "int[]") return '        StringBuilder sb = new StringBuilder();\n        for (int i = 0; i < result.length; i++) { if (i > 0) sb.append(" "); sb.append(result[i]); }\n        System.out.println(sb.toString());';
  if (jt === "String[]") return '        System.out.println(String.join(" ", result));';
  if (jt === "boolean") return '        System.out.println(result ? "true" : "false");';
  if (jt === "int[][]") return '        StringBuilder sb = new StringBuilder();\n        for (int i = 0; i < result.length; i++) { for (int j = 0; j < result[i].length; j++) { if (j > 0) sb.append(" "); sb.append(result[i][j]); } if (i < result.length - 1) sb.append("\\n"); }\n        System.out.println(sb.toString());';
  return "        System.out.println(result);";
}

function buildJavaReturnType(returnType: string): string {
  return javaType(returnType);
}

function buildJavaDriver(sig: MethodSig): string {
  const readers = sig.params.map(p => buildJavaReader(p)).join("\n");
  const args = sig.params.map(p => p.name).join(", ");
  const printer = buildJavaPrinter(sig.returnType);
  const jrt = buildJavaReturnType(sig.returnType);
  return `import java.util.*;
import java.io.*;
// __USER_CODE__
public class Main {
    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
${readers}
        Solution sol = new Solution();
        ${jrt} result = sol.${sig.name}(${args});
${printer}
    }
}`;
}

function cppType(t: string): string {
  const lt = t.toLowerCase();
  if (lt === "int") return "int";
  if (lt === "int[]" || lt === "list[int]") return "vector<int>";
  if (lt === "string" || lt === "str") return "string";
  if (lt === "string[]" || lt === "list[str]") return "vector<string>";
  if (lt === "bool" || lt === "boolean") return "bool";
  if (lt === "float") return "float";
  if (lt === "double") return "double";
  if (lt === "int[][]" || lt === "list[list[int]]") return "vector<vector<int>>";
  return "string";
}

function buildCppReader(p: Param): string {
  const ct = cppType(p.type);
  const ln = `_line_${p.name}`;
  if (ct === "int") return `    string ${ln};\n    getline(cin, ${ln});\n    int ${p.name} = stoi(${ln});`;
  if (ct === "vector<int>") return `    string ${ln};\n    getline(cin, ${ln});\n    int _n_${p.name} = stoi(${ln});\n    vector<int> ${p.name}(_n_${p.name});\n    { string ${ln}2; getline(cin, ${ln}2); istringstream _iss(${ln}2);\n      for (int i = 0; i < _n_${p.name}; i++) _iss >> ${p.name}[i]; }`;
  if (ct === "string") return `    string ${p.name};\n    getline(cin, ${p.name});`;
  if (ct === "vector<string>") return `    string ${ln};\n    getline(cin, ${ln});\n    int _n_${p.name} = stoi(${ln});\n    vector<string> ${p.name}(_n_${p.name});\n    for (int i = 0; i < _n_${p.name}; i++) getline(cin, ${p.name}[i]);`;
  if (ct === "bool") return `    string ${ln};\n    getline(cin, ${ln});\n    bool ${p.name} = (${ln} == "true");`;
  if (ct === "double") return `    string ${ln};\n    getline(cin, ${ln});\n    double ${p.name} = stod(${ln});`;
  if (ct === "float") return `    string ${ln};\n    getline(cin, ${ln});\n    float ${p.name} = stof(${ln});`;
  if (ct === "vector<vector<int>>") return `    string ${ln};\n    getline(cin, ${ln});\n    int _n_${p.name}, _m_${p.name};\n    { istringstream _iss(${ln}); _iss >> _n_${p.name} >> _m_${p.name}; }\n    vector<vector<int>> ${p.name}(_n_${p.name}, vector<int>(_m_${p.name}));\n    for (int i = 0; i < _n_${p.name}; i++) {\n        string ${ln}r; getline(cin, ${ln}r); istringstream _iss(${ln}r);\n        for (int j = 0; j < _m_${p.name}; j++) _iss >> ${p.name}[i][j];\n    }`;
  return `    string ${p.name};\n    getline(cin, ${p.name});`;
}

function buildCppPrinter(returnType: string): string {
  const ct = cppType(returnType);
  if (ct === "int" || ct === "double" || ct === "float" || ct === "string") return "    cout << result << endl;";
  if (ct === "vector<int>") return '    for (int i = 0; i < (int)result.size(); i++) { if (i > 0) cout << " "; cout << result[i]; }\n    cout << endl;';
  if (ct === "vector<string>") return '    for (int i = 0; i < (int)result.size(); i++) { if (i > 0) cout << " "; cout << result[i]; }\n    cout << endl;';
  if (ct === "bool") return '    cout << (result ? "true" : "false") << endl;';
  if (ct === "vector<vector<int>>") return '    for (int i = 0; i < (int)result.size(); i++) { for (int j = 0; j < (int)result[i].size(); j++) { if (j > 0) cout << " "; cout << result[i][j]; } cout << endl; }';
  return "    cout << result << endl;";
}

function buildCppDriver(sig: MethodSig): string {
  const readers = sig.params.map(p => buildCppReader(p)).join("\n");
  const args = sig.params.map(p => p.name).join(", ");
  const printer = buildCppPrinter(sig.returnType);
  const ct = cppType(sig.returnType);
  return `#include <bits/stdc++.h>
using namespace std;
// __USER_CODE__
int main() {
${readers}
    Solution sol;
    ${ct} result = sol.${sig.name}(${args});
${printer}
    return 0;
}`;
}

function buildAllDriverCode(sig: MethodSig): { python: string; java: string; cpp: string } {
  return {
    python: buildPythonDriver(sig),
    java: buildJavaDriver(sig),
    cpp: buildCppDriver(sig),
  };
}

// ── Server-side starter code builder ──
// Builds Solution class stubs from method signature so starter code always matches driver code.

function buildPythonStarter(sig: MethodSig): string {
  const params = sig.params.map(p => p.name).join(", ");
  return `class Solution:
    def ${sig.name}(self${params ? ", " + params : ""}):
        # Write your solution here
        pass`;
}

function javaDefaultReturn(returnType: string): string {
  const jt = javaType(returnType);
  if (jt === "void") return "";
  if (jt === "int") return "\n        return 0;";
  if (jt === "int[]") return "\n        return new int[]{};";
  if (jt === "String") return '\n        return "";';
  if (jt === "String[]") return "\n        return new String[]{};";
  if (jt === "boolean") return "\n        return false;";
  if (jt === "int[][]") return "\n        return new int[][]{};";
  if (jt === "double") return "\n        return 0.0;";
  if (jt === "float") return "\n        return 0.0f;";
  return "\n        return null;";
}

function buildJavaStarter(sig: MethodSig): string {
  const jrt = javaType(sig.returnType);
  const params = sig.params.map(p => `${javaType(p.type)} ${p.name}`).join(", ");
  const defaultReturn = javaDefaultReturn(sig.returnType);
  return `class Solution {
    public ${jrt} ${sig.name}(${params}) {
        // Write your solution here${defaultReturn}
    }
}`;
}

function cppDefaultReturn(returnType: string): string {
  const ct = cppType(returnType);
  if (ct === "void") return "";
  if (ct === "int") return "\n        return 0;";
  if (ct === "bool") return "\n        return false;";
  if (ct === "double" || ct === "float") return "\n        return 0.0;";
  if (ct === "string") return '\n        return "";';
  return "\n        return {};";
}

function buildCppStarter(sig: MethodSig): string {
  const ct = cppType(sig.returnType);
  const params = sig.params.map(p => {
    const pt = cppType(p.type);
    return (pt.startsWith("vector") || pt === "string") ? `${pt}& ${p.name}` : `${pt} ${p.name}`;
  }).join(", ");
  const defaultReturn = cppDefaultReturn(sig.returnType);
  return `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    ${ct} ${sig.name}(${params}) {
        // Write your solution here${defaultReturn}
    }
};`;
}

function buildAllStarterCode(sig: MethodSig): { python: string; java: string; cpp: string } {
  return {
    python: buildPythonStarter(sig),
    java: buildJavaStarter(sig),
    cpp: buildCppStarter(sig),
  };
}

// ── Test case input normalization ──
// The LLM often produces test case inputs in JSON/LeetCode format instead of the
// multi-line stdin format expected by the driver code. This normalizer detects and
// converts common LLM formats to the correct stdin format based on param types.

function tryConsumeLines(lines: string[], offset: number, type: string): number {
  const t = type.toLowerCase();
  if (offset >= lines.length) return -1;

  if (t === "int") {
    return /^-?\d+$/.test(lines[offset].trim()) ? offset + 1 : -1;
  }
  if (t === "float" || t === "double") {
    return /^-?\d+(\.\d+)?$/.test(lines[offset].trim()) ? offset + 1 : -1;
  }
  if (t === "bool" || t === "boolean") {
    return /^(true|false)$/i.test(lines[offset].trim()) ? offset + 1 : -1;
  }
  if (t === "string" || t === "str") {
    const line = lines[offset].trim();
    // Reject JSON-quoted strings — they need normalization
    if (/^".*"$/.test(line) || /^'.*'$/.test(line)) return -1;
    return offset + 1;
  }
  if (t === "int[]" || t === "list[int]") {
    const countStr = lines[offset].trim();
    if (!/^\d+$/.test(countStr)) return -1;
    const n = parseInt(countStr, 10);
    if (offset + 1 >= lines.length) return -1;
    if (n === 0) return offset + 2;
    const vals = lines[offset + 1].trim().split(/\s+/);
    if (vals.length !== n || !vals.every(v => /^-?\d+$/.test(v))) return -1;
    return offset + 2;
  }
  if (t === "string[]" || t === "list[str]") {
    const countStr = lines[offset].trim();
    if (!/^\d+$/.test(countStr)) return -1;
    const n = parseInt(countStr, 10);
    if (offset + 1 + n > lines.length) return -1;
    return offset + 1 + n;
  }
  if (t === "int[][]" || t === "list[list[int]]") {
    const dims = lines[offset].trim().split(/\s+/);
    if (dims.length !== 2 || !dims.every(d => /^\d+$/.test(d))) return -1;
    const rows = parseInt(dims[0], 10);
    if (offset + 1 + rows > lines.length) return -1;
    return offset + 1 + rows;
  }
  return offset + 1;
}

function isAlreadyCorrectFormat(lines: string[], params: Param[]): boolean {
  let offset = 0;
  for (const p of params) {
    offset = tryConsumeLines(lines, offset, p.type);
    if (offset === -1) return false;
  }
  return offset >= lines.length || lines.slice(offset).every(l => l.trim() === "");
}

function splitTopLevelValues(s: string): string[] {
  const results: string[] = [];
  let depth = 0;
  let inStr = false;
  let strChar = "";
  let current = "";

  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (inStr) {
      current += ch;
      if (ch === "\\" && i + 1 < s.length) { current += s[++i]; }
      else if (ch === strChar) { inStr = false; }
      continue;
    }
    if (ch === '"' || ch === "'") { inStr = true; strChar = ch; current += ch; continue; }
    if (ch === "[" || ch === "(") { depth++; current += ch; continue; }
    if (ch === "]" || ch === ")") { depth--; current += ch; continue; }
    if (ch === "," && depth === 0) { results.push(current.trim()); current = ""; continue; }
    current += ch;
  }
  if (current.trim()) results.push(current.trim());
  return results;
}

function parseLeetCodeStyle(input: string, params: Param[]): Map<string, string> | null {
  if (!params.some(p => input.includes(p.name + " =") || input.includes(p.name + "="))) return null;

  const assignments: { name: string; valueStart: number }[] = [];
  for (const p of params) {
    const regex = new RegExp(`\\b${p.name}\\s*=\\s*`, "g");
    let match;
    while ((match = regex.exec(input)) !== null) {
      assignments.push({ name: p.name, valueStart: match.index + match[0].length });
    }
  }
  if (assignments.length !== params.length) return null;
  assignments.sort((a, b) => a.valueStart - b.valueStart);

  const result = new Map<string, string>();
  for (let i = 0; i < assignments.length; i++) {
    const start = assignments[i].valueStart;
    if (i + 1 < assignments.length) {
      const rest = input.substring(start, assignments[i + 1].valueStart);
      const nameIdx = rest.lastIndexOf(assignments[i + 1].name);
      let rawValue = rest.substring(0, nameIdx).trim();
      if (rawValue.endsWith(",")) rawValue = rawValue.slice(0, -1).trim();
      result.set(assignments[i].name, rawValue);
    } else {
      result.set(assignments[i].name, input.substring(start).trim());
    }
  }
  return result.size === params.length ? result : null;
}

function formatValueForStdin(rawValue: string, type: string): string | null {
  const t = type.toLowerCase();
  try {
    if (t === "int") {
      const n = parseInt(rawValue.trim().replace(/^["']|["']$/g, ""), 10);
      return isNaN(n) ? null : String(n);
    }
    if (t === "float" || t === "double") {
      const n = parseFloat(rawValue.trim().replace(/^["']|["']$/g, ""));
      return isNaN(n) ? null : String(n);
    }
    if (t === "bool" || t === "boolean") {
      const v = rawValue.trim().toLowerCase().replace(/^["']|["']$/g, "");
      if (v === "true" || v === "1") return "true";
      if (v === "false" || v === "0") return "false";
      return null;
    }
    if (t === "string" || t === "str") {
      let s = rawValue.trim();
      if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
        try { s = JSON.parse(s); } catch { s = s.slice(1, -1); }
      }
      return s;
    }
    if (t === "int[]" || t === "list[int]") {
      const trimmed = rawValue.trim();
      let arr: number[];
      if (trimmed.startsWith("[")) {
        arr = JSON.parse(trimmed);
      } else {
        arr = trimmed.split(/[\s,]+/).filter(Boolean).map(Number);
      }
      if (!Array.isArray(arr) || arr.some(isNaN)) return null;
      return `${arr.length}\n${arr.join(" ")}`;
    }
    if (t === "string[]" || t === "list[str]") {
      const trimmed = rawValue.trim();
      if (!trimmed.startsWith("[")) return null;
      const arr: string[] = JSON.parse(trimmed);
      if (!Array.isArray(arr)) return null;
      return `${arr.length}\n${arr.join("\n")}`;
    }
    if (t === "int[][]" || t === "list[list[int]]") {
      const trimmed = rawValue.trim();
      if (!trimmed.startsWith("[")) return null;
      const matrix: number[][] = JSON.parse(trimmed);
      if (!Array.isArray(matrix) || matrix.length === 0) {
        return Array.isArray(matrix) ? "0 0" : null;
      }
      const rows = matrix.length;
      const cols = matrix[0].length;
      return `${rows} ${cols}\n${matrix.map(row => row.join(" ")).join("\n")}`;
    }
  } catch { return null; }
  return rawValue.trim();
}

function normalizeTestCaseInput(input: string, params: Param[]): string {
  if (!params || params.length === 0) return input;

  // Pre-process: convert literal \n to real newlines if no real newlines exist
  let processed = input;
  if (!processed.includes("\n") && processed.includes("\\n")) {
    processed = processed.replace(/\\n/g, "\n");
  }
  processed = processed.trim();

  // Step 1: Check if already in correct format
  const lines = processed.split("\n");
  if (isAlreadyCorrectFormat(lines, params)) return processed;

  // Step 2: Try LeetCode-style named parsing (e.g. "nums = [1,2,3], target = 5")
  const namedValues = parseLeetCodeStyle(processed, params);
  if (namedValues) {
    const parts: string[] = [];
    let ok = true;
    for (const p of params) {
      const raw = namedValues.get(p.name);
      if (!raw) { ok = false; break; }
      const f = formatValueForStdin(raw, p.type);
      if (f === null) { ok = false; break; }
      parts.push(f);
    }
    if (ok && parts.length === params.length) return parts.join("\n");
  }

  // Step 3: Try positional comma-separated parsing (e.g. "[1,2,3], 5")
  const topLevel = splitTopLevelValues(processed);
  if (topLevel.length === params.length) {
    const parts: string[] = [];
    let ok = true;
    for (let i = 0; i < params.length; i++) {
      const f = formatValueForStdin(topLevel[i], params[i].type);
      if (f === null) { ok = false; break; }
      parts.push(f);
    }
    if (ok) return parts.join("\n");
  }

  // Step 3b: Single param — try parsing entire input as that type
  if (params.length === 1) {
    const f = formatValueForStdin(processed, params[0].type);
    if (f !== null) return f;
  }

  // Step 3c: Multi-line but wrong format — join and re-try
  if (lines.length > 1) {
    const joined = lines.map(l => l.trim()).filter(Boolean).join(", ");
    const topLevel2 = splitTopLevelValues(joined);
    if (topLevel2.length === params.length) {
      const parts: string[] = [];
      let ok = true;
      for (let i = 0; i < params.length; i++) {
        const f = formatValueForStdin(topLevel2[i], params[i].type);
        if (f === null) { ok = false; break; }
        parts.push(f);
      }
      if (ok) return parts.join("\n");
    }
  }

  // Fallback: return as-is
  return processed;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { topicId, topicTitle, difficulty, preferredLanguage, previousQuestions } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const techniques = TOPIC_TECHNIQUES[topicId] || topicTitle;

    const difficultyGuide =
      difficulty === "easy"
        ? "Basic, single-concept problems. Straightforward application of the topic. O(n) or O(n log n) solutions. Clear input/output. Suitable for beginners."
        : difficulty === "medium"
        ? "Combine 2 concepts or require a non-obvious insight. May need an optimized approach. Edge cases matter. Requires solid understanding."
        : "Require deep understanding, advanced techniques, or creative problem-solving. Optimal solution requires the topic's key algorithm/data structure.";

    const prevContext = previousQuestions?.length > 0
      ? `\n\nPREVIOUS QUESTIONS ALREADY GIVEN (generate something COMPLETELY DIFFERENT):\n${previousQuestions.map((q: any, i: number) => `${i + 1}. "${q.title}" - ${q.difficulty}`).join('\n')}`
      : "";

    const systemPrompt = `You are an expert DSA problem designer. Generate a single coding problem exactly like LeetCode.

TOPIC: ${topicTitle}
CORE TECHNIQUES: ${techniques}
DIFFICULTY: ${difficulty} — ${difficultyGuide}

STARTER CODE FORMAT — CRITICAL:
The starterCode must be LeetCode-style: ONLY the Solution class with the method signature. The user writes their logic inside.

Rules for starterCode:
- Python: class Solution with a method using self
- Java: class Solution (NOT public) with a public method
- C++: class Solution with public method, include #include <bits/stdc++.h> and using namespace std; at top

Example starterCode for an array problem:

Python:
class Solution:
    def solve(self, nums, target):
        # Write your solution here
        pass

Java:
class Solution {
    public int[] solve(int[] nums, int target) {
        // Write your solution here
        return new int[]{};
    }
}

C++:
#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    vector<int> solve(vector<int>& nums, int target) {
        // Write your solution here
        return {};
    }
};

METHOD SIGNATURE — you must provide methodSignature with:
- name: the method name (e.g., "solve", "findMax", "isValid")
- params: array of {name, type} where type is one of: int, int[], string, string[], bool, int[][]
- returnType: one of: int, int[], string, string[], bool, void, int[][]

The methodSignature MUST match the function in starterCode exactly.

STDIN FORMAT for test cases — must match the parameter types:
- int: one line with the integer
- int[]: first line is array size n, next line is n space-separated integers
- string: one line with the string
- string[]: first line is count n, next n lines each have a string
- bool: one line with "true" or "false"
- int[][]: first line is "rows cols", then rows lines of space-separated integers

Test case "input" uses \\n to separate lines. "expectedOutput" must match stdout exactly.

RULES:
1. Problem MUST be solvable using ${techniques}.
2. Create ORIGINAL problems — no direct copies of famous LeetCode problems.
3. Include exactly 3 test cases.
4. Use simple types only: int, int[], string, string[], bool, int[][] — NO custom classes.
5. CRITICAL: Each parameter must hold ONE atomic value or a flat/2D array. NEVER design a method where a single string parameter contains multi-line structured data (e.g., "3\\nAlice 20\\nBob 19"). Instead, decompose into parallel arrays: (names: string[], ages: int[]). If data has multiple fields per record, use one array per field.
6. Description should be clear and concise like LeetCode.
7. The starterCode must be MINIMAL — just the class with method.
${prevContext}

VERIFY: Trace through each test case mentally to confirm expectedOutput is correct.`;

    const requestBody = JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Generate a ${difficulty} level coding problem for the topic "${topicTitle}". The student's preferred language is ${preferredLanguage || "python"}.` },
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "generate_assessment_question",
            description: "Return a coding assessment problem as structured data",
            parameters: {
              type: "object",
              properties: {
                title: { type: "string", description: "Short problem title" },
                description: { type: "string", description: "Full problem description with clear requirements" },
                examples: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      input: { type: "string" },
                      output: { type: "string" },
                      explanation: { type: "string" },
                    },
                    required: ["input", "output"],
                  },
                  description: "2-3 worked examples",
                },
                constraints: {
                  type: "array",
                  items: { type: "string" },
                  description: "Input constraints and ranges",
                },
                testCases: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      input: { type: "string", description: "Stdin input matching param types" },
                      expectedOutput: { type: "string", description: "Expected stdout output" },
                    },
                    required: ["input", "expectedOutput"],
                  },
                  description: "Exactly 3 test cases",
                },
                starterCode: {
                  type: "object",
                  properties: {
                    python: { type: "string" },
                    java: { type: "string" },
                    cpp: { type: "string" },
                  },
                  required: ["python"],
                  description: "Starter code — ONLY the Solution class with method signature. NO main(), NO I/O. Provide python, java, and cpp.",
                },
                methodSignature: {
                  type: "object",
                  properties: {
                    name: { type: "string", description: "Method name" },
                    params: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          name: { type: "string" },
                          type: { type: "string", description: "One of: int, int[], string, string[], bool, int[][]" },
                        },
                        required: ["name", "type"],
                      },
                      description: "Parameters in order",
                    },
                    returnType: { type: "string", description: "One of: int, int[], string, string[], bool, void, int[][]" },
                  },
                  required: ["name", "params", "returnType"],
                  description: "Method signature details for generating driver code",
                },
              },
              required: ["title", "description", "examples", "constraints", "testCases", "starterCode", "methodSignature"],
            },
          },
        },
      ],
      tool_choice: { type: "function", function: { name: "generate_assessment_question" } },
    });

    // Retry up to 4 times for transient errors and short-term rate limits
    const MAX_RETRIES = 4;
    let response!: Response;
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      if (attempt > 0) {
        if (response && response.status === 429) {
          const retryAfter = parseInt(response.headers.get("retry-after") || "8", 10);
          // If retry-after > 60s it's a long-term (hourly/daily) limit — no point retrying
          if (retryAfter > 60) break;
          console.warn(`Rate limited, waiting ${retryAfter}s before retry ${attempt + 1}...`);
          await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
        } else {
          // Exponential backoff for 5xx / 400: 1s, 2s, 3s
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
      }
      response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: requestBody,
      });
      // Stop retrying on success, auth errors (401), or credits exhausted (402)
      if (response.ok || response.status === 401 || response.status === 402) break;
      console.warn(`Groq API attempt ${attempt + 1} failed with status ${response.status}, retrying...`);
    }

    if (!response.ok) {
      if (response.status === 429) {
        const retryAfter = parseInt(response.headers.get("retry-after") || "0", 10);
        const msg = retryAfter > 60
          ? `Daily AI quota reached. Please try again in ${Math.ceil(retryAfter / 3600)} hour(s).`
          : "Rate limit exceeded. Please wait a moment and try again.";
        return new Response(JSON.stringify({ error: msg }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      let detail = "";
      try { detail = JSON.parse(t)?.error?.message || t.slice(0, 200); } catch { detail = t.slice(0, 200); }
      return new Response(JSON.stringify({ error: `AI service error (${response.status}): ${detail}` }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      return new Response(JSON.stringify({ error: "No question generated. Please try again." }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const question = JSON.parse(toolCall.function.arguments);

    // Build driver code AND starter code server-side from methodSignature
    // This guarantees the starter code method signature always matches the driver code call.
    const sig: MethodSig = question.methodSignature;
    let driverCode: { python: string; java: string; cpp: string };
    let starterCode: { python: string; java: string; cpp: string };

    if (sig && sig.name && sig.params && sig.returnType) {
      driverCode = buildAllDriverCode(sig);
      starterCode = buildAllStarterCode(sig);
    } else {
      // Fallback: no valid method signature — use LLM starter code and empty drivers
      console.error("Missing methodSignature, falling back to LLM starter code");
      driverCode = { python: "", java: "", cpp: "" };
      const sc = question.starterCode || {};
      starterCode = {
        python: sc.python || "class Solution:\n    def solve(self):\n        # Write your solution here\n        pass\n",
        java: sc.java || "class Solution {\n    public void solve() {\n        // Write your solution here\n    }\n}",
        cpp: sc.cpp || "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    void solve() {\n        // Write your solution here\n    }\n};\n",
      };
    }

    // Normalize test case inputs to match driver stdin format
    const normalizedTestCases = (question.testCases || []).map(
      (tc: { input: string; expectedOutput: string }) => ({
        ...tc,
        input: sig && sig.params
          ? normalizeTestCaseInput(tc.input, sig.params)
          : tc.input,
      })
    );

    // Return question with server-built starterCode and driverCode
    const result = {
      title: question.title,
      description: question.description,
      examples: question.examples,
      constraints: question.constraints,
      testCases: normalizedTestCases,
      starterCode,
      driverCode,
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-assessment-question error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
