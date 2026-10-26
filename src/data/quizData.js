// ===== Quiz Data — PyLearn =====
// Each entry: { q, options: string[], answer: number (0-based index), explanation }

// Tab key map: module id → tab index → tab key
export const tabKeyMap = {
  1: {
    0: '1-problem-solving',
    1: '1-data-types',
    2: '1-operators',
    3: '1-built-in-functions',
    4: '1-regex'
  },
  2: {
    0: '2-approaches',
    1: '2-conditionals',
    2: '2-loops',
    3: '2-flow-simulator'
  },
  3: {
    0: '3-collections',
    1: '3-comprehensions',
    2: '3-searching',
    3: '3-sorting-visualizer'
  },
  4: {
    0: '4-functions',
    1: '4-arguments-scope',
    2: '4-recursion',
    3: '4-stack-queue'
  },
  5: {
    0: '5-numpy',
    1: '5-pandas-basics',
    2: '5-data-operations',
    3: '5-interactive-demo'
  },
  6: {
    0: '6-overview'
  }
}

export const quizData = {

  // ── Module 1 ──────────────────────────────────────────────────────────────
  '1-problem-solving': [
    {
      q: 'Which of the following best describes an algorithm?',
      options: [
        'A programming language syntax rule',
        'A step-by-step procedure to solve a problem',
        'A type of flowchart symbol',
        'The output of a Python program'
      ],
      answer: 1,
      explanation: 'An algorithm is a finite, unambiguous step-by-step procedure that solves a problem and produces a correct output.'
    },
    {
      q: 'In a flowchart, which shape represents a decision?',
      options: ['Rectangle', 'Oval', 'Diamond', 'Parallelogram'],
      answer: 2,
      explanation: 'A diamond (rhombus) shape represents a decision or conditional branch in a flowchart.'
    },
    {
      q: 'IPO stands for:',
      options: [
        'Integer, Process, Output',
        'Input, Process, Output',
        'Input, Print, Operator',
        'Iteration, Pattern, Object'
      ],
      answer: 1,
      explanation: 'IPO = Input → Process → Output. Every computational problem can be described this way.'
    },
    {
      q: 'Pseudocode is:',
      options: [
        'Valid Python code',
        'Machine language instructions',
        'An informal, language-independent description of an algorithm',
        'A type of comment in Python'
      ],
      answer: 2,
      explanation: 'Pseudocode uses plain language with programming-like structure; it is not tied to any specific language.'
    }
  ],

  '1-data-types': [
    {
      q: 'What is the data type of the value 42 in Python?',
      options: ['float', 'str', 'int', 'bool'],
      answer: 2,
      explanation: '42 is a whole number without a decimal point, so Python classifies it as int.'
    },
    {
      q: 'Which of the following is a float literal?',
      options: ['42', '"3.14"', '3.14', 'True'],
      answer: 2,
      explanation: '3.14 is a floating-point number. "3.14" is a string, 42 is an int, and True is a bool.'
    },
    {
      q: 'What does type("Hello") return?',
      options: ["<class 'str'>", "<class 'int'>", "<class 'char'>", "<class 'list'>"],
      answer: 0,
      explanation: '"Hello" is a sequence of characters, so Python returns <class \'str\'>.'
    },
    {
      q: 'Which statement correctly converts the string "99" to an integer?',
      options: ['str(99)', 'float("99")', 'int("99")', 'bool("99")'],
      answer: 2,
      explanation: 'int("99") converts the string "99" to the integer 99.'
    }
  ],

  '1-operators': [
    {
      q: 'What is the result of 10 // 3 in Python?',
      options: ['3.33', '3', '1', '0.33'],
      answer: 1,
      explanation: '// is the floor-division operator; it divides and rounds down to the nearest integer. 10 // 3 = 3.'
    },
    {
      q: 'What does 10 % 3 evaluate to?',
      options: ['3', '0', '1', '3.33'],
      answer: 2,
      explanation: '% is the modulus operator. 10 = 3×3 + 1, so the remainder is 1.'
    },
    {
      q: 'Which operator checks equality between two values?',
      options: ['=', '!=', '==', '>='],
      answer: 2,
      explanation: '== is the equality comparison operator. = is assignment, != checks inequality.'
    },
    {
      q: 'What is the result of True and False in Python?',
      options: ['True', 'False', '1', 'None'],
      answer: 1,
      explanation: 'The and operator returns True only if both operands are True. True and False → False.'
    }
  ],

  '1-built-in-functions': [
    {
      q: 'Which built-in function returns the number of items in a list?',
      options: ['count()', 'size()', 'len()', 'num()'],
      answer: 2,
      explanation: 'len() returns the number of elements in a sequence (list, string, tuple, etc.).'
    },
    {
      q: 'What does abs(-7) return?',
      options: ['-7', '7', '0', 'Error'],
      answer: 1,
      explanation: 'abs() returns the absolute (non-negative) value of a number. abs(-7) = 7.'
    },
    {
      q: 'What is the output of round(3.678, 2)?',
      options: ['3.6', '3.67', '3.68', '4.0'],
      answer: 2,
      explanation: 'round(n, d) rounds n to d decimal places. 3.678 rounded to 2 places is 3.68.'
    },
    {
      q: 'range(1, 6) generates:',
      options: ['1, 2, 3, 4, 5, 6', '0, 1, 2, 3, 4, 5', '1, 2, 3, 4, 5', '2, 3, 4, 5'],
      answer: 2,
      explanation: 'range(start, stop) generates numbers from start up to (but not including) stop.'
    }
  ],

  '1-regex': [
    {
      q: 'Which re function returns ALL non-overlapping matches in a string?',
      options: ['re.match()', 're.search()', 're.findall()', 're.split()'],
      answer: 2,
      explanation: 're.findall() scans through the string and returns a list of all matches.'
    },
    {
      q: 'What does the pattern \\d+ match?',
      options: [
        'Any single digit',
        'One or more digit characters',
        'Any non-digit character',
        'Zero or more digits'
      ],
      answer: 1,
      explanation: '\\d matches a single digit; + means one or more. So \\d+ matches one or more consecutive digits.'
    },
    {
      q: 'What does re.fullmatch(pattern, s) do?',
      options: [
        'Matches pattern anywhere in s',
        'Matches pattern only at the start of s',
        'Matches pattern against the entire string s',
        'Substitutes all matches in s'
      ],
      answer: 2,
      explanation: 're.fullmatch() requires the pattern to match the entire string from start to end.'
    },
    {
      q: 'Which pattern matches a valid email format like user@domain.com?',
      options: [
        '\\w+\\.\\w+',
        '[\\w.]+@\\w+\\.\\w{2,4}',
        '\\d+@\\w+\\.com',
        '@\\w+'
      ],
      answer: 1,
      explanation: '[\\w.]+ matches the username (letters/digits/dots), @ then domain, then a 2–4 char TLD.'
    }
  ],

  // ── Module 2 ──────────────────────────────────────────────────────────────
  '2-approaches': [
    {
      q: 'Top-down problem solving means:',
      options: [
        'Starting with sub-problems and building up to the main solution',
        'Breaking a large problem into smaller sub-problems recursively',
        'Solving problems by sorting data from largest to smallest',
        'Using loops from the bottom of the code upward'
      ],
      answer: 1,
      explanation: 'Top-down decomposition starts from the high-level problem and recursively breaks it into smaller, manageable sub-problems.'
    },
    {
      q: 'Divide and Conquer works by:',
      options: [
        'Iterating through all elements one by one',
        'Dividing the problem in half, solving each part, then combining results',
        'Using global variables to share state',
        'Avoiding recursion entirely'
      ],
      answer: 1,
      explanation: 'Divide and Conquer splits the problem (Divide), solves sub-problems (Conquer), and merges results (Combine).'
    },
    {
      q: 'Which approach is best when sub-problems overlap and can be reused?',
      options: ['Top-Down', 'Divide & Conquer', 'Bottom-Up (Dynamic Programming)', 'Brute Force'],
      answer: 2,
      explanation: 'Bottom-up (DP) solves smaller sub-problems first and stores results to avoid redundant computation.'
    },
    {
      q: 'In which step of problem solving do you verify your solution with test cases?',
      options: ['Define', 'Design', 'Implement', 'Test & Debug'],
      answer: 3,
      explanation: 'Testing and Debugging is the final step where you validate the solution using various test inputs.'
    }
  ],

  '2-conditionals': [
    {
      q: 'What is the output of: x = 10; print("Even") if x % 2 == 0 else print("Odd")',
      options: ['Odd', 'Even', 'True', 'False'],
      answer: 1,
      explanation: '10 % 2 == 0 is True, so "Even" is printed.'
    },
    {
      q: 'How many elif clauses can a single if block have?',
      options: ['Exactly 1', 'At most 2', 'At most 5', 'As many as needed'],
      answer: 3,
      explanation: 'Python allows any number of elif clauses; they are checked in order and the first True one executes.'
    },
    {
      q: 'Which statement about the else clause is true?',
      options: [
        'else is mandatory in every if block',
        'else runs when the if condition is True',
        'else runs when all preceding conditions are False',
        'else can have its own condition'
      ],
      answer: 2,
      explanation: 'else is optional and runs only when none of the preceding if/elif conditions were True.'
    },
    {
      q: 'What does the following evaluate to: 5 > 3 and 2 < 1?',
      options: ['True', 'False', 'None', 'Error'],
      answer: 1,
      explanation: '5 > 3 is True and 2 < 1 is False. True and False = False.'
    }
  ],

  '2-loops': [
    {
      q: 'What does range(2, 10, 2) produce?',
      options: ['2, 4, 6, 8, 10', '2, 4, 6, 8', '0, 2, 4, 6, 8', '2, 3, 4, 5, 6, 7, 8, 9'],
      answer: 1,
      explanation: 'range(start, stop, step) → 2, 4, 6, 8. Stop (10) is excluded.'
    },
    {
      q: 'Which keyword immediately exits a loop?',
      options: ['continue', 'pass', 'break', 'exit'],
      answer: 2,
      explanation: 'break terminates the nearest enclosing loop immediately.'
    },
    {
      q: 'What does continue do inside a loop?',
      options: [
        'Exits the loop completely',
        'Skips the rest of the current iteration and moves to the next',
        'Pauses execution for 1 second',
        'Restarts the loop from the beginning'
      ],
      answer: 1,
      explanation: 'continue skips remaining statements in the current loop iteration and jumps to the next iteration.'
    },
    {
      q: 'A while loop runs when:',
      options: [
        'Its condition is False',
        'Its condition is True',
        'The loop counter equals zero',
        'break is called'
      ],
      answer: 1,
      explanation: 'A while loop continues executing as long as its condition evaluates to True.'
    }
  ],

  '2-flow-simulator': [
    {
      q: 'Which flowchart symbol represents a process (action)?',
      options: ['Diamond', 'Oval', 'Rectangle', 'Parallelogram'],
      answer: 2,
      explanation: 'Rectangles represent process steps (computations or actions). Ovals are start/end, diamonds are decisions, parallelograms are I/O.'
    },
    {
      q: 'What does a parallelogram represent in a flowchart?',
      options: ['Decision', 'Start / End', 'Input or Output', 'Loop'],
      answer: 2,
      explanation: 'Parallelograms are used for input/output operations in standard flowchart notation.'
    },
    {
      q: 'What symbol is used to show the start or end of a flowchart?',
      options: ['Rectangle', 'Diamond', 'Oval (Rounded rectangle)', 'Arrow'],
      answer: 2,
      explanation: 'Ovals or rounded rectangles (called terminators) mark the start and end of a flowchart.'
    },
    {
      q: 'Arrows in a flowchart represent:',
      options: [
        'Decisions',
        'The flow of control / execution order',
        'Variables',
        'Comments'
      ],
      answer: 1,
      explanation: 'Arrows (flow lines) show the direction and order in which steps are executed.'
    }
  ],

  // ── Module 3 ──────────────────────────────────────────────────────────────
  '3-collections': [
    {
      q: 'Which Python collection is ordered, mutable, and allows duplicates?',
      options: ['Tuple', 'Set', 'Dictionary', 'List'],
      answer: 3,
      explanation: 'Lists are ordered (maintain insertion order), mutable (can be changed), and allow duplicate values.'
    },
    {
      q: 'What happens when you try to change an element of a tuple?',
      options: [
        'It is silently ignored',
        'A TypeError is raised',
        'The tuple converts to a list',
        'A new tuple is created'
      ],
      answer: 1,
      explanation: 'Tuples are immutable. Attempting to change an element raises a TypeError.'
    },
    {
      q: 'Which collection stores key-value pairs?',
      options: ['List', 'Tuple', 'Dictionary', 'Set'],
      answer: 2,
      explanation: 'Dictionaries (dict) store data as key-value pairs, providing fast lookup by key.'
    },
    {
      q: 'Which property of sets guarantees uniqueness?',
      options: [
        'Sets are ordered',
        'Sets are immutable',
        'Sets automatically remove duplicates',
        'Sets are indexed'
      ],
      answer: 2,
      explanation: 'Sets store only unique elements; adding a duplicate simply has no effect.'
    }
  ],

  '3-comprehensions': [
    {
      q: 'What does [x**2 for x in range(4)] produce?',
      options: ['[0, 1, 4, 9]', '[1, 4, 9, 16]', '[0, 2, 4, 6]', '[1, 2, 3, 4]'],
      answer: 0,
      explanation: 'range(4) gives 0,1,2,3. Squaring each: 0,1,4,9.'
    },
    {
      q: 'Which list comprehension filters only even numbers from range(10)?',
      options: [
        '[x for x in range(10) if x % 2 == 1]',
        '[x for x in range(10) if x % 2 == 0]',
        '[x % 2 for x in range(10)]',
        '{x for x in range(10) if x % 2 == 0}'
      ],
      answer: 1,
      explanation: 'The condition if x % 2 == 0 keeps only even numbers. The last option uses {} which creates a set.'
    },
    {
      q: 'What does {k: v for k, v in [("a",1),("b",2)]} create?',
      options: ["A list", "A set", "A tuple", "A dictionary"],
      answer: 3,
      explanation: 'Using curly braces with key: value syntax creates a dictionary comprehension.'
    },
    {
      q: 'What is the equivalent of [n for n in range(1,6) if n % 2 != 0] written as a loop?',
      options: [
        'result = []\nfor n in range(1,6): result.append(n)',
        'result = []\nfor n in range(1,6):\n  if n % 2 != 0: result.append(n)',
        'result = filter(None, range(1,6))',
        'result = [n ** 2 for n in range(1,6)]'
      ],
      answer: 1,
      explanation: 'List comprehensions with a condition map directly to a for loop with an if inside.'
    }
  ],

  '3-searching': [
    {
      q: 'Linear search has a worst-case time complexity of:',
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
      answer: 2,
      explanation: 'Linear search checks every element in the worst case (target at end or not found), giving O(n).'
    },
    {
      q: 'Binary search requires the list to be:',
      options: ['Unsorted', 'Sorted', 'Unique elements only', 'Numerical only'],
      answer: 1,
      explanation: 'Binary search repeatedly halves the search space, which only works if the list is sorted.'
    },
    {
      q: 'How many comparisons does binary search need to find an element in a list of 1024 items (worst case)?',
      options: ['1024', '512', '10', '32'],
      answer: 2,
      explanation: 'Binary search takes O(log₂ n) comparisons. log₂(1024) = 10.'
    },
    {
      q: 'Which algorithm should you use to search an unsorted list?',
      options: ['Binary Search', 'Jump Search', 'Linear Search', 'Exponential Search'],
      answer: 2,
      explanation: 'Only linear search works on unsorted data; other efficient search algorithms need sorted input.'
    }
  ],

  '3-sorting-visualizer': [
    {
      q: 'Bubble sort compares and swaps:',
      options: [
        'Non-adjacent elements',
        'Adjacent elements',
        'The first and last elements only',
        'Random pairs'
      ],
      answer: 1,
      explanation: 'Bubble sort repeatedly compares adjacent pairs and swaps them if they are in the wrong order.'
    },
    {
      q: 'What is the average-case time complexity of merge sort?',
      options: ['O(n)', 'O(n²)', 'O(n log n)', 'O(log n)'],
      answer: 2,
      explanation: 'Merge sort always divides the array in half and merges in linear time, giving O(n log n).'
    },
    {
      q: 'Which sorting algorithm is generally fastest in practice for large arrays?',
      options: ['Bubble Sort', 'Selection Sort', 'Insertion Sort', 'Quick Sort'],
      answer: 3,
      explanation: 'Quick Sort has O(n log n) average case and excellent cache performance, making it fast in practice.'
    },
    {
      q: 'Selection sort works by:',
      options: [
        'Repeatedly finding the minimum element and placing it at the front',
        'Swapping adjacent elements',
        'Inserting each element into its correct position',
        'Merging sorted halves'
      ],
      answer: 0,
      explanation: 'Selection sort finds the minimum unsorted element and swaps it to the beginning of the unsorted portion.'
    }
  ],

  // ── Module 4 ──────────────────────────────────────────────────────────────
  '4-functions': [
    {
      q: 'Which keyword is used to define a function in Python?',
      options: ['func', 'function', 'def', 'define'],
      answer: 2,
      explanation: 'def is Python\'s keyword for defining functions: def function_name(params):'
    },
    {
      q: 'What does a function return if there is no return statement?',
      options: ['0', 'False', 'None', 'Error'],
      answer: 2,
      explanation: 'Python functions implicitly return None when no return statement is present.'
    },
    {
      q: 'What is a pure function?',
      options: [
        'A function that uses global variables',
        'A function that always returns the same output for the same input and has no side effects',
        'A function defined inside another function',
        'A function with no parameters'
      ],
      answer: 1,
      explanation: 'Pure functions are deterministic (same input → same output) and have no side effects (don\'t modify external state).'
    },
    {
      q: 'Which of the following correctly calls a function named greet with argument "Alice"?',
      options: ['def greet("Alice")', 'greet = "Alice"', 'greet("Alice")', 'call greet "Alice"'],
      answer: 2,
      explanation: 'Functions are called by writing the function name followed by arguments in parentheses.'
    }
  ],

  '4-arguments-scope': [
    {
      q: 'What is *args used for in a function definition?',
      options: [
        'To pass keyword arguments',
        'To accept any number of positional arguments as a tuple',
        'To make arguments optional',
        'To return multiple values'
      ],
      answer: 1,
      explanation: '*args collects any number of extra positional arguments into a tuple inside the function.'
    },
    {
      q: 'What does **kwargs capture?',
      options: [
        'Positional arguments as a list',
        'Keyword arguments as a dictionary',
        'Default argument values',
        'Return values'
      ],
      answer: 1,
      explanation: '**kwargs collects extra keyword arguments (name=value pairs) as a dictionary.'
    },
    {
      q: 'A variable defined inside a function is:',
      options: ['Global', 'Local', 'Class-level', 'Module-level'],
      answer: 1,
      explanation: 'Variables created inside a function are local; they only exist during that function call.'
    },
    {
      q: 'How do you access a global variable inside a function when you want to modify it?',
      options: [
        'global keyword: global x',
        'nonlocal keyword',
        'Just reference it normally',
        'You cannot modify global variables inside functions'
      ],
      answer: 0,
      explanation: 'Using global x inside a function tells Python you want to modify the global variable x, not create a local one.'
    }
  ],

  '4-recursion': [
    {
      q: 'What is the essential component that prevents infinite recursion?',
      options: ['A loop', 'A base case', 'A return value', 'A global variable'],
      answer: 1,
      explanation: 'A base case is a condition under which the recursive function returns directly without making another recursive call.'
    },
    {
      q: 'What is the time complexity of computing factorial recursively?',
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
      answer: 2,
      explanation: 'factorial(n) makes n recursive calls (n, n-1, ..., 1, 0), giving O(n) time.'
    },
    {
      q: 'The call stack in recursion:',
      options: [
        'Grows with each recursive call until the base case is reached',
        'Is emptied at each recursive call',
        'Has unlimited depth',
        'Only stores the base case'
      ],
      answer: 0,
      explanation: 'Each recursive call adds a new frame to the call stack. Too many calls without reaching the base case causes a stack overflow.'
    },
    {
      q: 'Binary search implemented recursively divides the search space by:',
      options: ['1', '2', '10', 'n'],
      answer: 1,
      explanation: 'Each recursive call checks the midpoint and recurses on either the left or right half, halving the search space.'
    }
  ],

  '4-stack-queue': [
    {
      q: 'A stack follows which principle?',
      options: ['FIFO', 'LIFO', 'FILO is wrong', 'Random access'],
      answer: 1,
      explanation: 'Stack = LIFO (Last In, First Out). The last element pushed is the first to be popped.'
    },
    {
      q: 'A queue follows which principle?',
      options: ['LIFO', 'FIFO', 'Random access', 'Priority ordering'],
      answer: 1,
      explanation: 'Queue = FIFO (First In, First Out). The first element enqueued is the first to be dequeued.'
    },
    {
      q: 'Which Python method adds an element to the top of a stack (using a list)?',
      options: ['insert()', 'enqueue()', 'append()', 'push()'],
      answer: 2,
      explanation: 'Python lists use append() to add to the end (top of stack) and pop() to remove from the end.'
    },
    {
      q: 'Which real-world scenario best models a queue?',
      options: [
        'Browser back button (undo)',
        'Function call stack',
        'People waiting in line at a counter',
        'Balancing parentheses'
      ],
      answer: 2,
      explanation: 'A queue models FIFO scenarios like people in a line — the first person to arrive is served first.'
    }
  ],

  // ── Module 5 ──────────────────────────────────────────────────────────────
  '5-numpy': [
    {
      q: 'How do you create a NumPy array from a Python list [1, 2, 3]?',
      options: ['numpy.list([1,2,3])', 'np.array([1,2,3])', 'np.create([1,2,3])', 'array([1,2,3])'],
      answer: 1,
      explanation: 'np.array() is the standard way to create a NumPy ndarray from a Python list.'
    },
    {
      q: 'What does the shape attribute of a NumPy array return?',
      options: ['The data type', 'The number of dimensions', 'A tuple of dimension sizes', 'The total number of elements'],
      answer: 2,
      explanation: '.shape returns a tuple like (rows, cols) describing the size along each dimension.'
    },
    {
      q: 'Which NumPy function creates an array of zeros?',
      options: ['np.empty()', 'np.zero()', 'np.zeros()', 'np.fill(0)'],
      answer: 2,
      explanation: 'np.zeros(shape) creates an array filled with 0.0 of the specified shape.'
    },
    {
      q: 'What is broadcasting in NumPy?',
      options: [
        'Printing array values to the console',
        'Sending arrays over a network',
        'Applying operations between arrays of different shapes by stretching smaller arrays',
        'Converting arrays to lists'
      ],
      answer: 2,
      explanation: 'Broadcasting allows NumPy to perform element-wise operations between arrays of compatible but different shapes.'
    }
  ],

  '5-pandas-basics': [
    {
      q: 'Which Pandas object represents a single column of data?',
      options: ['DataFrame', 'Array', 'Series', 'Index'],
      answer: 2,
      explanation: 'A Series is a one-dimensional labelled array. A DataFrame is a collection of Series (columns).'
    },
    {
      q: 'How do you read a CSV file into a DataFrame?',
      options: ['pd.read()', 'pd.open_csv()', 'pd.read_csv()', 'pd.load_csv()'],
      answer: 2,
      explanation: 'pd.read_csv("filename.csv") is the standard Pandas function for reading CSV files.'
    },
    {
      q: 'What does df.head() return?',
      options: [
        'The last 5 rows',
        'The first 5 rows',
        'Column names',
        'Summary statistics'
      ],
      answer: 1,
      explanation: 'df.head() returns the first 5 rows of the DataFrame by default. df.head(n) returns n rows.'
    },
    {
      q: 'How do you select a column named "age" from DataFrame df?',
      options: ['df.age()', 'df.get("age")', 'df["age"] or df.age', 'df.col("age")'],
      answer: 2,
      explanation: 'Columns are accessed via bracket notation df["age"] or dot notation df.age (when name is a valid identifier).'
    }
  ],

  '5-data-operations': [
    {
      q: 'Which Pandas method removes rows with missing values?',
      options: ['df.fill_na()', 'df.dropna()', 'df.remove_null()', 'df.clean()'],
      answer: 1,
      explanation: 'df.dropna() drops all rows that contain at least one NaN value.'
    },
    {
      q: 'df.groupby("city")["sales"].sum() computes:',
      options: [
        'Total sales across all cities',
        'Sales per city',
        'Mean sales by city',
        'Number of rows per city'
      ],
      answer: 1,
      explanation: 'groupby("city") splits the DataFrame by city; .sum() then aggregates sales for each city.'
    },
    {
      q: 'Which function merges two DataFrames on a common key?',
      options: ['pd.concat()', 'pd.merge()', 'pd.join()', 'pd.combine()'],
      answer: 1,
      explanation: 'pd.merge(df1, df2, on="key") performs a SQL-style join on a common column.'
    },
    {
      q: 'df["price"].apply(lambda x: x * 1.1) does:',
      options: [
        'Filters rows where price > 1.1',
        'Multiplies every price value by 1.1',
        'Adds 1.1 to the first price',
        'Rounds prices to 1 decimal'
      ],
      answer: 1,
      explanation: '.apply() applies a function element-wise to a Series. lambda x: x * 1.1 multiplies each value by 1.1.'
    }
  ],

  '5-interactive-demo': [
    {
      q: 'Which method provides summary statistics (mean, std, etc.) for numeric columns?',
      options: ['df.info()', 'df.summary()', 'df.describe()', 'df.stats()'],
      answer: 2,
      explanation: 'df.describe() returns count, mean, std, min, max, and quartile statistics for numeric columns.'
    },
    {
      q: 'pd.concat([df1, df2]) combines DataFrames by:',
      options: [
        'Merging on a common key',
        'Stacking them along an axis (rows by default)',
        'Replacing df1 with df2',
        'Computing the difference'
      ],
      answer: 1,
      explanation: 'pd.concat() stacks DataFrames along rows (axis=0 default) or columns (axis=1).'
    },
    {
      q: 'What does df.sort_values("score", ascending=False) do?',
      options: [
        'Sorts rows by score from lowest to highest',
        'Sorts rows by score from highest to lowest',
        'Removes rows where score is zero',
        'Filters rows where score is negative'
      ],
      answer: 1,
      explanation: 'ascending=False sorts in descending order (highest first).'
    },
    {
      q: 'df["grade"].value_counts() returns:',
      options: [
        'Unique grade values',
        'Number of rows per unique grade value',
        'Mean of grade column',
        'A boolean mask'
      ],
      answer: 1,
      explanation: '.value_counts() counts how many times each unique value appears in a Series.'
    }
  ],

  // ── Module 6 ──────────────────────────────────────────────────────────────
  '6-overview': [
    {
      q: 'Which Python library is most commonly used for machine learning?',
      options: ['Pandas', 'Matplotlib', 'Scikit-learn', 'Flask'],
      answer: 2,
      explanation: 'Scikit-learn provides simple and efficient tools for data mining and machine learning in Python.'
    },
    {
      q: 'Python automation libraries like Selenium are mainly used for:',
      options: [
        'Scientific computation',
        'Web scraping and browser automation',
        'Data visualization',
        'Blockchain development'
      ],
      answer: 1,
      explanation: 'Selenium automates web browsers, enabling tasks like form filling, scraping, and testing web apps.'
    },
    {
      q: 'Which domain is Python NOT commonly used in?',
      options: ['Data Science', 'Web Development', 'System-level device drivers', 'AI/ML'],
      answer: 2,
      explanation: 'Low-level system programming (device drivers, OS kernels) is typically done in C/C++, not Python.'
    },
    {
      q: 'Python became popular in AI/ML primarily because:',
      options: [
        'It runs faster than C',
        'It has a rich ecosystem of libraries (NumPy, TensorFlow, PyTorch) and readable syntax',
        'It was designed specifically for AI',
        'It compiles to machine code'
      ],
      answer: 1,
      explanation: 'Python\'s readable syntax, interactive notebooks, and mature ML libraries made it the dominant AI/ML language.'
    }
  ]
}
