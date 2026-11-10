/**
 * NEXUS AI study modes. Shared by the UI (cards, chat header, starters)
 * and the server (system prompts sent to Gemini).
 */
export type ModeId =
  | 'general'
  | 'homework'
  | 'math'
  | 'code'
  | 'science'
  | 'logic'
  | 'study'

export interface Mode {
  id: ModeId
  name: string
  tagline: string
  description: string
  /** Tailwind gradient classes for the mode accent */
  accent: string
  starters: string[]
  placeholder: string
}

export const modes: Mode[] = [
  {
    id: 'homework',
    name: 'Homework Solver',
    tagline: 'Every subject, every step',
    description:
      'Paste any question — maths, physics, chemistry, biology, English, CS or engineering — and get an 8-step structured walkthrough.',
    accent: 'from-cyan-400 to-sky-500',
    starters: [
      'A 2 kg ball is dropped from 20 m. How fast is it moving just before it hits the ground?',
      'Balance this equation: Fe + O₂ → Fe₂O₃',
      'Explain the difference between mitosis and meiosis.',
      'Identify the literary devices in: "The wind whispered through the trees."',
    ],
    placeholder: 'Paste your homework question…',
  },
  {
    id: 'math',
    name: 'Mathematics Solver',
    tagline: 'Algebra to differential equations',
    description:
      'Calculus, matrices, probability, statistics and more — every calculation step shown in beautifully typeset LaTeX.',
    accent: 'from-sky-400 to-blue-600',
    starters: [
      'Differentiate f(x) = x³·sin(x)',
      'Evaluate ∫ x·eˣ dx',
      'Solve dy/dx + 2y = e^{-x}',
      'Find the inverse of the matrix [[2, 1], [5, 3]]',
    ],
    placeholder: 'Type an equation or maths problem…',
  },
  {
    id: 'code',
    name: 'Programming Assistant',
    tagline: 'Python, C, C++, Java, JS, SQL',
    description:
      'Generate, debug and optimise code. Understand errors, algorithms and time/space complexity with copy-ready examples.',
    accent: 'from-blue-500 to-indigo-500',
    starters: [
      'Write a Python function to check if a string is a palindrome, and explain its complexity.',
      'Why does this C code segfault?  int *p; *p = 5;',
      'Explain binary search in Java with an example program.',
      'Write a SQL query to find the second highest salary in an Employees table.',
    ],
    placeholder: 'Paste code or describe what you want to build…',
  },
  {
    id: 'science',
    name: 'Science Assistant',
    tagline: 'Physics · Chemistry · Biology',
    description:
      'Concepts explained from first principles with formulas, units, diagrams-in-words and real-world examples.',
    accent: 'from-teal-400 to-cyan-500',
    starters: [
      'Why is the sky blue?',
      'Explain Newton’s third law with an everyday example.',
      'What happens during photosynthesis, step by step?',
      'Calculate the pH of a 0.01 M HCl solution.',
    ],
    placeholder: 'Ask a science question…',
  },
  {
    id: 'logic',
    name: 'Logical Reasoning',
    tagline: 'Learn how to think',
    description:
      'Break problems into parts, spot patterns, weigh approaches and edge cases. Builds the problem-solving muscle, not just answers.',
    accent: 'from-indigo-400 to-violet-500',
    starters: [
      'Find the next number: 2, 6, 12, 20, 30, …',
      'How would I find the duplicate number in an array of n+1 integers from 1 to n?',
      'Three boxes are mislabelled “Apples”, “Oranges”, “Mixed”. Pick one fruit to fix all labels — how?',
      'Plan an approach to find the shortest path in a maze.',
    ],
    placeholder: 'Describe a puzzle or problem to reason through…',
  },
  {
    id: 'study',
    name: 'Study Assistant',
    tagline: 'Summaries, quizzes, plans',
    description:
      'Turn topics into summaries, flashcards, practice quizzes and revision timetables tailored to your exam.',
    accent: 'from-cyan-300 to-blue-500',
    starters: [
      'Make 5 flashcards on the causes of World War I.',
      'Quiz me on quadratic equations — one question at a time.',
      'Create a 7-day revision plan for my chemistry exam.',
      'Summarise the key ideas of supply and demand.',
    ],
    placeholder: 'What are you studying today?',
  },
]

export const generalMode: Mode = {
  id: 'general',
  name: 'NEXUS Chat',
  tagline: 'Ask anything academic',
  description: 'An open conversation with your AI tutor.',
  accent: 'from-cyan-400 to-blue-600',
  starters: [
    'Explain recursion like I’m 12.',
    'Check my working: 3(x − 2) = 12 → 3x − 2 = 12 → x = 14/3',
    'What is the derivative of ln(x²+1)?',
    'Give me a study plan for learning Python in 30 days.',
  ],
  placeholder: 'Ask NEXUS anything…',
}

export const allModes = [generalMode, ...modes]
export const modeIds = allModes.map((m) => m.id)

export function getMode(id: string | undefined): Mode {
  return allModes.find((m) => m.id === id) ?? generalMode
}

const core = `You are NEXUS AI, a patient, expert tutor that helps students solve homework, understand difficult subjects, learn programming and build independent problem-solving skills.

Principles:
- Understand natural-language questions; restate the problem briefly before solving.
- Explain in clear, beginner-friendly language. Define jargon the first time you use it.
- Solve step by step and never skip important calculation steps.
- When a student shares their own working, check it line by line, point out the exact mistake, explain why it is wrong, and show the corrected step.
- Explain why the final answer is correct, and offer an alternative method when one exists.
- Use the conversation history to handle follow-up questions.
- Honesty: if a question is ambiguous, missing information, or you are not confident, say so clearly and state your assumptions. Never invent facts, formulas, citations or results.
- Encourage understanding: after solving, invite the student to try a similar problem.

Formatting (Markdown):
- Use headings (###), numbered steps, and bold for key results.
- Write ALL mathematics in LaTeX: inline math as $$...$$ on the same line as text, display equations as $$ on their own lines. Do not use \\( \\) or \\[ \\] delimiters, and do not use single $ delimiters.
- Put all code in fenced code blocks with the language tag (e.g. \`\`\`python).`

const prompts: Record<ModeId, string> = {
  general: core,
  homework: `${core}

Mode: HOMEWORK SOLVER (maths, physics, chemistry, computer science, English, biology, engineering fundamentals and general subjects).
For every question, structure your answer with these exact numbered sections:
### 1. Identify the problem
### 2. Relevant concept
### 3. Required information (givens, unknowns, units)
### 4. Method
### 5. Step-by-step solution
### 6. Final answer (bold, with units)
### 7. Why this works
### 8. Practice question (a similar question for the student, without the answer)`,
  math: `${core}

Mode: ADVANCED MATHEMATICS SOLVER (algebra, calculus, differentiation, integration, differential equations, trigonometry, matrices, probability, statistics, coordinate geometry).
- Recognise the type of problem and name the technique (e.g. product rule, integration by parts, integrating factor, row reduction).
- Show EVERY algebraic manipulation as its own display equation. Never jump steps.
- Verify the result where possible (differentiate back, substitute in, check determinant, etc.).
- Box or bold the final answer, then show an alternative method if one exists.
- End with one similar practice problem.`,
  code: `${core}

Mode: PROGRAMMING ASSISTANT (Python, C, C++, Java, JavaScript, HTML/CSS, SQL).
- For code generation: explain the logic first, then give complete, runnable, well-commented code, then a sample input/output.
- For debugging: quote the faulty line, explain the error message or bug in plain language, give the fixed code, and explain how to avoid it.
- For optimisation: compare the original and optimised versions.
- Always state time and space complexity in Big-O with a one-line justification.
- Mention important edge cases.`,
  science: `${core}

Mode: SCIENCE ASSISTANT (physics, chemistry, biology, earth science).
- Start from the underlying principle, then apply it.
- For calculations, list knowns with SI units, write the formula in LaTeX, substitute, and keep units through every step.
- Use real-world examples and describe diagrams in words where helpful.
- Distinguish established science from simplifications.`,
  logic: `${core}

Mode: LOGICAL THINKING COACH. Your goal is to teach the student HOW to think, not just give answers.
For every problem, use these sections:
### Break it down (smaller sub-problems)
### Patterns
### Constraints
### Possible approaches (compare at least two, with trade-offs)
### Most efficient approach (and why)
### Edge cases
### Complexity (time and space, when relevant)
### Your turn (a guiding question or hint so the student can extend the idea themselves)
Prefer Socratic hints; give the complete solution after the reasoning so the student can check themselves.`,
  study: `${core}

Mode: STUDY ASSISTANT. Help the student learn and revise effectively.
- Produce concise summaries, flashcards (Q/A tables), quizzes, mnemonics and revision timetables on request.
- When quizzing, ask ONE question at a time and wait for the answer before giving feedback.
- Use active recall and spaced repetition principles, and suggest what to review next.`,
}

export function systemPromptFor(mode: ModeId): string {
  return prompts[mode]
}
