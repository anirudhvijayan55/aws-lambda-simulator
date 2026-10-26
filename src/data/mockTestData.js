// ===== PyLearn Mock Test Data =====
// 30 questions sourced from PAT Assessment 2 docs
// Easy.docx (20), Medium (6), Hard (4), Debug (2)
//
// Each question has:
//   constraints  — required Python constructs; blocks Run until all are satisfied
//   testCases    — visible (2) + hidden (2) test cases for the Python runner
//   starterCode  — pre-filled template in PracticeEditor
//
// Constraint: { id, label, regex }
//   regex is a JS-string passed to new RegExp(regex, 's')
//   A constraint passes when the regex matches anywhere in the student's code.

export const questions = [
  // ===== EASY (1–20) =====
  {
    id: 'e1',
    difficulty: 'easy',
    title: 'Check Even or Odd',
    topic: 'Conditionals',
    tags: ['if-else', 'modulo', 'input'],
    prompt: `Write a Python program that takes an integer as input and prints "Even" if it is divisible by 2, otherwise prints "Odd".`,
    hint: 'Use the modulo operator (%) to check divisibility.',
    solution: `num = int(input("Enter a number: "))
if num % 2 == 0:
    print("Even")
else:
    print("Odd")`,
    explanation: 'The modulo operator % returns the remainder. If num % 2 == 0, the number divides evenly by 2.',
    starterCode: `n = int(input())
# print "Even" or "Odd"`,
    constraints: [
      { id: 'c1', label: 'Use if statement', regex: '\\bif\\b' },
      { id: 'c2', label: 'Use else',         regex: '\\belse\\b' },
      { id: 'c3', label: 'Use % (modulo)',   regex: '%' },
    ],
    testCases: [
      { id: 'tc1', stdin: '4',  testCode: '', expectedOutput: 'Even', isHidden: false, description: 'Even number (4)' },
      { id: 'tc2', stdin: '7',  testCode: '', expectedOutput: 'Odd',  isHidden: false, description: 'Odd number (7)' },
      { id: 'tc3', stdin: '0',  testCode: '', expectedOutput: 'Even', isHidden: true,  description: 'Zero edge case' },
      { id: 'tc4', stdin: '-3', testCode: '', expectedOutput: 'Odd',  isHidden: true,  description: 'Negative odd' },
    ]
  },
  {
    id: 'e2',
    difficulty: 'easy',
    title: 'Check Positive, Negative or Zero',
    topic: 'Conditionals',
    tags: ['if-elif-else', 'comparison'],
    prompt: `Write a Python program that reads a number from the user and prints whether it is Positive, Negative, or Zero.`,
    hint: 'Use if / elif / else with > and < operators.',
    solution: `num = float(input("Enter a number: "))
if num > 0:
    print("Positive")
elif num < 0:
    print("Negative")
else:
    print("Zero")`,
    explanation: 'Three mutually exclusive conditions are checked in order using if-elif-else.',
    starterCode: `num = float(input())
# print "Positive", "Negative", or "Zero"`,
    constraints: [
      { id: 'c1', label: 'Use if',   regex: '\\bif\\b' },
      { id: 'c2', label: 'Use elif', regex: '\\belif\\b' },
      { id: 'c3', label: 'Use else', regex: '\\belse\\b' },
    ],
    testCases: [
      { id: 'tc1', stdin: '5',    testCode: '', expectedOutput: 'Positive', isHidden: false, description: 'Positive number' },
      { id: 'tc2', stdin: '-3',   testCode: '', expectedOutput: 'Negative', isHidden: false, description: 'Negative number' },
      { id: 'tc3', stdin: '0',    testCode: '', expectedOutput: 'Zero',     isHidden: true,  description: 'Zero' },
      { id: 'tc4', stdin: '-100', testCode: '', expectedOutput: 'Negative', isHidden: true,  description: 'Large negative' },
    ]
  },
  {
    id: 'e3',
    difficulty: 'easy',
    title: 'Find Maximum of Three Numbers',
    topic: 'Conditionals',
    tags: ['if-elif-else', 'max', 'comparison'],
    prompt: `Write a program that reads three integers and prints the largest among them without using the built-in max() function.`,
    hint: 'Compare the numbers pairwise using if-elif-else.',
    solution: `a = int(input("Enter first number: "))
b = int(input("Enter second number: "))
c = int(input("Enter third number: "))

if a >= b and a >= c:
    print("Largest:", a)
elif b >= a and b >= c:
    print("Largest:", b)
else:
    print("Largest:", c)`,
    explanation: 'Each condition checks whether one number is greater than or equal to both others.',
    starterCode: `a = int(input())
b = int(input())
c = int(input())
# print "Largest: X"`,
    constraints: [
      { id: 'c1', label: 'Use if',   regex: '\\bif\\b' },
      { id: 'c2', label: 'Use elif', regex: '\\belif\\b' },
      { id: 'c3', label: 'Use and',  regex: '\\band\\b' },
    ],
    testCases: [
      { id: 'tc1', stdin: '3\n7\n2',    testCode: '', expectedOutput: 'Largest: 7',  isHidden: false, description: 'Middle is largest' },
      { id: 'tc2', stdin: '10\n5\n8',   testCode: '', expectedOutput: 'Largest: 10', isHidden: false, description: 'First is largest' },
      { id: 'tc3', stdin: '1\n1\n5',    testCode: '', expectedOutput: 'Largest: 5',  isHidden: true,  description: 'Third is largest' },
      { id: 'tc4', stdin: '-1\n-5\n-3', testCode: '', expectedOutput: 'Largest: -1', isHidden: true,  description: 'All negative' },
    ]
  },
  {
    id: 'e4',
    difficulty: 'easy',
    title: 'Sum of First N Natural Numbers',
    topic: 'Loops',
    tags: ['for loop', 'range', 'accumulator'],
    prompt: `Write a Python program that reads a positive integer N and prints the sum of all natural numbers from 1 to N (inclusive).`,
    hint: 'Use a for loop with range(1, N+1) and an accumulator variable.',
    solution: `n = int(input("Enter N: "))
total = 0
for i in range(1, n + 1):
    total += i
print("Sum:", total)`,
    explanation: 'We initialise total to 0 and add each value i as the loop runs from 1 to n inclusive.',
    starterCode: `n = int(input())
# print "Sum: X"`,
    constraints: [
      { id: 'c1', label: 'Use for loop',           regex: '\\bfor\\b' },
      { id: 'c2', label: 'Use range()',             regex: '\\brange\\b' },
      { id: 'c3', label: 'Use += (accumulator)',    regex: '\\+=' },
    ],
    testCases: [
      { id: 'tc1', stdin: '5',   testCode: '', expectedOutput: 'Sum: 15',   isHidden: false, description: 'N=5' },
      { id: 'tc2', stdin: '10',  testCode: '', expectedOutput: 'Sum: 55',   isHidden: false, description: 'N=10' },
      { id: 'tc3', stdin: '1',   testCode: '', expectedOutput: 'Sum: 1',    isHidden: true,  description: 'N=1 edge case' },
      { id: 'tc4', stdin: '100', testCode: '', expectedOutput: 'Sum: 5050', isHidden: true,  description: 'N=100' },
    ]
  },
  {
    id: 'e5',
    difficulty: 'easy',
    title: 'Multiplication Table',
    topic: 'Loops',
    tags: ['for loop', 'range', 'print formatting'],
    prompt: `Write a program that reads an integer N and prints its multiplication table from 1 to 10.`,
    hint: 'Use a for loop over range(1, 11) and multiply N by each value.',
    solution: `n = int(input("Enter a number: "))
for i in range(1, 11):
    print(f"{n} x {i} = {n * i}")`,
    explanation: 'An f-string formats the output. The loop variable i runs from 1 to 10 inclusive.',
    starterCode: `n = int(input())
for i in range(1, 11):
    # print "N x i = N*i"
    pass`,
    constraints: [
      { id: 'c1', label: 'Use for loop', regex: '\\bfor\\b' },
      { id: 'c2', label: 'Use range()',  regex: '\\brange\\b' },
      { id: 'c3', label: 'Use f-string', regex: 'f"' },
    ],
    testCases: [
      { id: 'tc1', stdin: '2', testCode: '', expectedOutput: '2 x 1 = 2\n2 x 2 = 4\n2 x 3 = 6\n2 x 4 = 8\n2 x 5 = 10\n2 x 6 = 12\n2 x 7 = 14\n2 x 8 = 16\n2 x 9 = 18\n2 x 10 = 20', isHidden: false, description: 'Table of 2' },
      { id: 'tc2', stdin: '5', testCode: '', expectedOutput: '5 x 1 = 5\n5 x 2 = 10\n5 x 3 = 15\n5 x 4 = 20\n5 x 5 = 25\n5 x 6 = 30\n5 x 7 = 35\n5 x 8 = 40\n5 x 9 = 45\n5 x 10 = 50', isHidden: false, description: 'Table of 5' },
      { id: 'tc3', stdin: '1', testCode: '', expectedOutput: '1 x 1 = 1\n1 x 2 = 2\n1 x 3 = 3\n1 x 4 = 4\n1 x 5 = 5\n1 x 6 = 6\n1 x 7 = 7\n1 x 8 = 8\n1 x 9 = 9\n1 x 10 = 10', isHidden: true, description: 'Table of 1' },
      { id: 'tc4', stdin: '10', testCode: '', expectedOutput: '10 x 1 = 10\n10 x 2 = 20\n10 x 3 = 30\n10 x 4 = 40\n10 x 5 = 50\n10 x 6 = 60\n10 x 7 = 70\n10 x 8 = 80\n10 x 9 = 90\n10 x 10 = 100', isHidden: true, description: 'Table of 10' },
    ]
  },
  {
    id: 'e6',
    difficulty: 'easy',
    title: 'Count Vowels in a String',
    topic: 'Strings',
    tags: ['string', 'loop', 'counting'],
    prompt: `Write a program that reads a string from the user and counts how many vowels (a, e, i, o, u) it contains. The check should be case-insensitive.`,
    hint: 'Convert the string to lowercase and check each character against a vowel set.',
    solution: `text = input("Enter a string: ")
count = 0
vowels = "aeiou"
for ch in text.lower():
    if ch in vowels:
        count += 1
print("Vowel count:", count)`,
    explanation: 'text.lower() normalises case. We iterate character by character and increment count when a vowel is found.',
    starterCode: `text = input()
# print "Vowel count: X"`,
    constraints: [
      { id: 'c1', label: 'Use for loop',   regex: '\\bfor\\b' },
      { id: 'c2', label: 'Use .lower()',   regex: '\\.lower\\(\\)' },
      { id: 'c3', label: 'Use in keyword', regex: '\\bin\\b' },
    ],
    testCases: [
      { id: 'tc1', stdin: 'hello',  testCode: '', expectedOutput: 'Vowel count: 2', isHidden: false, description: '"hello" has 2 vowels' },
      { id: 'tc2', stdin: 'Python', testCode: '', expectedOutput: 'Vowel count: 1', isHidden: false, description: '"Python" has 1 vowel' },
      { id: 'tc3', stdin: 'aeiou',  testCode: '', expectedOutput: 'Vowel count: 5', isHidden: true,  description: 'All vowels' },
      { id: 'tc4', stdin: 'rhythm', testCode: '', expectedOutput: 'Vowel count: 0', isHidden: true,  description: 'No vowels' },
    ]
  },
  {
    id: 'e7',
    difficulty: 'easy',
    title: 'Reverse a String',
    topic: 'Strings',
    tags: ['string slicing', 'reverse'],
    prompt: `Write a program that reads a string and prints it in reverse order.`,
    hint: 'Python slicing with [::-1] reverses a sequence.',
    solution: `text = input("Enter a string: ")
print("Reversed:", text[::-1])`,
    explanation: 'The slice [::-1] starts from the end and steps backward by 1, effectively reversing the string.',
    starterCode: `text = input()
# print "Reversed: X"`,
    constraints: [
      { id: 'c1', label: 'Use [::-1] slicing', regex: '\\[::-1\\]' },
    ],
    testCases: [
      { id: 'tc1', stdin: 'hello',   testCode: '', expectedOutput: 'Reversed: olleh',   isHidden: false, description: '"hello"' },
      { id: 'tc2', stdin: 'Python',  testCode: '', expectedOutput: 'Reversed: nohtyP',  isHidden: false, description: '"Python"' },
      { id: 'tc3', stdin: 'abc',     testCode: '', expectedOutput: 'Reversed: cba',     isHidden: true,  description: '"abc"' },
      { id: 'tc4', stdin: 'racecar', testCode: '', expectedOutput: 'Reversed: racecar', isHidden: true,  description: 'Palindrome unchanged' },
    ]
  },
  {
    id: 'e8',
    difficulty: 'easy',
    title: 'Check Palindrome',
    topic: 'Strings',
    tags: ['string', 'palindrome', 'reverse'],
    prompt: `Write a program that reads a word and checks whether it is a palindrome (reads the same forwards and backwards). Ignore case.`,
    hint: 'Compare the lowercased string with its reverse.',
    solution: `word = input("Enter a word: ").lower()
if word == word[::-1]:
    print("Palindrome")
else:
    print("Not a Palindrome")`,
    explanation: 'We compare word with word[::-1]. If they match the word is a palindrome.',
    starterCode: `word = input().lower()
# print "Palindrome" or "Not a Palindrome"`,
    constraints: [
      { id: 'c1', label: 'Use [::-1] slicing', regex: '\\[::-1\\]' },
      { id: 'c2', label: 'Use .lower()',       regex: '\\.lower\\(\\)' },
    ],
    testCases: [
      { id: 'tc1', stdin: 'racecar', testCode: '', expectedOutput: 'Palindrome',       isHidden: false, description: '"racecar"' },
      { id: 'tc2', stdin: 'hello',   testCode: '', expectedOutput: 'Not a Palindrome', isHidden: false, description: '"hello"' },
      { id: 'tc3', stdin: 'Madam',   testCode: '', expectedOutput: 'Palindrome',       isHidden: true,  description: 'Case-insensitive "Madam"' },
      { id: 'tc4', stdin: 'python',  testCode: '', expectedOutput: 'Not a Palindrome', isHidden: true,  description: '"python"' },
    ]
  },
  {
    id: 'e9',
    difficulty: 'easy',
    title: 'FizzBuzz',
    topic: 'Conditionals',
    tags: ['modulo', 'if-elif-else', 'loop'],
    prompt: `Print numbers from 1 to 30. For multiples of 3 print "Fizz", for multiples of 5 print "Buzz", for multiples of both print "FizzBuzz", otherwise print the number.`,
    hint: 'Check divisibility by both 3 and 5 first, then by each individually.',
    solution: `for i in range(1, 31):
    if i % 3 == 0 and i % 5 == 0:
        print("FizzBuzz")
    elif i % 3 == 0:
        print("Fizz")
    elif i % 5 == 0:
        print("Buzz")
    else:
        print(i)`,
    explanation: 'The combined condition must be checked first; otherwise, 15 would incorrectly match "Fizz" or "Buzz" alone.',
    starterCode: `for i in range(1, 31):
    # print FizzBuzz / Fizz / Buzz / number
    pass`,
    constraints: [
      { id: 'c1', label: 'Use for loop',   regex: '\\bfor\\b' },
      { id: 'c2', label: 'Use % (modulo)', regex: '%' },
      { id: 'c3', label: 'Use elif',       regex: '\\belif\\b' },
    ],
    testCases: [
      {
        id: 'tc1', stdin: '', testCode: '',
        expectedOutput: '1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz\n16\n17\nFizz\n19\nBuzz\nFizz\n22\n23\nFizz\nBuzz\n26\nFizz\n28\n29\nFizzBuzz',
        isHidden: false, description: 'Full sequence 1–30'
      },
      {
        id: 'tc2', stdin: '', testCode: '',
        expectedOutput: '1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz\n16\n17\nFizz\n19\nBuzz\nFizz\n22\n23\nFizz\nBuzz\n26\nFizz\n28\n29\nFizzBuzz',
        isHidden: true, description: 'Verify complete output'
      },
    ]
  },
  {
    id: 'e10',
    difficulty: 'easy',
    title: 'Simple Calculator',
    topic: 'Conditionals',
    tags: ['arithmetic', 'input', 'if-elif-else'],
    prompt: `Write a calculator that reads two numbers and an operator (+, -, *, /) from the user and prints the result. Handle division by zero.`,
    hint: 'Use if-elif-else to select the operation. Check for zero before dividing.',
    solution: `a = float(input("First number: "))
op = input("Operator (+, -, *, /): ")
b = float(input("Second number: "))

if op == '+':
    print(a + b)
elif op == '-':
    print(a - b)
elif op == '*':
    print(a * b)
elif op == '/':
    if b == 0:
        print("Error: division by zero")
    else:
        print(a / b)
else:
    print("Unknown operator")`,
    explanation: 'Each operator is a separate elif branch. Division additionally guards against zero denominators.',
    starterCode: `a = float(input())
op = input()
b = float(input())
# print the result or "Error: division by zero"`,
    constraints: [
      { id: 'c1', label: 'Use if',                    regex: '\\bif\\b' },
      { id: 'c2', label: 'Use elif',                  regex: '\\belif\\b' },
      { id: 'c3', label: 'Handle division by zero',   regex: 'division by zero' },
    ],
    testCases: [
      { id: 'tc1', stdin: '10\n+\n5', testCode: '', expectedOutput: '15.0',                    isHidden: false, description: '10 + 5' },
      { id: 'tc2', stdin: '8\n/\n4',  testCode: '', expectedOutput: '2.0',                     isHidden: false, description: '8 / 4' },
      { id: 'tc3', stdin: '3\n*\n7',  testCode: '', expectedOutput: '21.0',                    isHidden: true,  description: '3 * 7' },
      { id: 'tc4', stdin: '5\n/\n0',  testCode: '', expectedOutput: 'Error: division by zero',  isHidden: true,  description: 'Divide by zero' },
    ]
  },
  {
    id: 'e11',
    difficulty: 'easy',
    title: 'Count Digits in a Number',
    topic: 'Strings',
    tags: ['string conversion', 'len', 'digits'],
    prompt: `Read an integer from the user and print how many digits it contains. Negative numbers should still give the correct digit count.`,
    hint: 'Convert the absolute value to a string and use len().',
    solution: `n = int(input("Enter a number: "))
count = len(str(abs(n)))
print("Number of digits:", count)`,
    explanation: 'abs() removes the sign, str() converts to string, and len() counts characters — each character is one digit.',
    starterCode: `n = int(input())
# print "Number of digits: X"`,
    constraints: [
      { id: 'c1', label: 'Use len()', regex: '\\blen\\b' },
      { id: 'c2', label: 'Use str()', regex: '\\bstr\\b' },
    ],
    testCases: [
      { id: 'tc1', stdin: '12345',   testCode: '', expectedOutput: 'Number of digits: 5', isHidden: false, description: '5-digit number' },
      { id: 'tc2', stdin: '-42',     testCode: '', expectedOutput: 'Number of digits: 2', isHidden: false, description: 'Negative number' },
      { id: 'tc3', stdin: '0',       testCode: '', expectedOutput: 'Number of digits: 1', isHidden: true,  description: 'Zero' },
      { id: 'tc4', stdin: '1000000', testCode: '', expectedOutput: 'Number of digits: 7', isHidden: true,  description: '7-digit number' },
    ]
  },
  {
    id: 'e12',
    difficulty: 'easy',
    title: 'Check Leap Year',
    topic: 'Conditionals',
    tags: ['modulo', 'leap year', 'boolean logic'],
    prompt: `Write a program to check if a given year is a leap year. A year is a leap year if it is divisible by 4, except for century years which must be divisible by 400.`,
    hint: 'A year is a leap year if (divisible by 4 AND not by 100) OR (divisible by 400).',
    solution: `year = int(input("Enter year: "))
if (year % 4 == 0 and year % 100 != 0) or (year % 400 == 0):
    print("Leap Year")
else:
    print("Not a Leap Year")`,
    explanation: 'The compound boolean expression encodes the two leap-year rules in a single condition.',
    starterCode: `year = int(input())
# print "Leap Year" or "Not a Leap Year"`,
    constraints: [
      { id: 'c1', label: 'Use % (modulo)', regex: '%' },
      { id: 'c2', label: 'Use and',        regex: '\\band\\b' },
      { id: 'c3', label: 'Use or',         regex: '\\bor\\b' },
    ],
    testCases: [
      { id: 'tc1', stdin: '2024', testCode: '', expectedOutput: 'Leap Year',       isHidden: false, description: 'Divisible by 4' },
      { id: 'tc2', stdin: '2023', testCode: '', expectedOutput: 'Not a Leap Year', isHidden: false, description: 'Not divisible by 4' },
      { id: 'tc3', stdin: '1900', testCode: '', expectedOutput: 'Not a Leap Year', isHidden: true,  description: 'Century not /400' },
      { id: 'tc4', stdin: '2000', testCode: '', expectedOutput: 'Leap Year',       isHidden: true,  description: 'Divisible by 400' },
    ]
  },
  {
    id: 'e13',
    difficulty: 'easy',
    title: 'Sum of Digits',
    topic: 'Loops',
    tags: ['string conversion', 'loop', 'sum'],
    prompt: `Read a non-negative integer and print the sum of its digits. For example 1234 → 10.`,
    hint: 'Convert the number to a string, iterate over each character, convert back to int, and sum.',
    solution: `n = input("Enter a number: ")
total = sum(int(d) for d in n if d.isdigit())
print("Sum of digits:", total)`,
    explanation: 'The generator expression iterates over each character, converts digits to int, and sum() adds them all.',
    starterCode: `n = input()
# print "Sum of digits: X"`,
    constraints: [
      { id: 'c1', label: 'Use sum() or for loop', regex: '\\bsum\\b|\\bfor\\b' },
      { id: 'c2', label: 'Use int()',             regex: '\\bint\\b' },
    ],
    testCases: [
      { id: 'tc1', stdin: '1234', testCode: '', expectedOutput: 'Sum of digits: 10', isHidden: false, description: '1+2+3+4 = 10' },
      { id: 'tc2', stdin: '999',  testCode: '', expectedOutput: 'Sum of digits: 27', isHidden: false, description: '9+9+9 = 27' },
      { id: 'tc3', stdin: '0',    testCode: '', expectedOutput: 'Sum of digits: 0',  isHidden: true,  description: 'Zero' },
      { id: 'tc4', stdin: '100',  testCode: '', expectedOutput: 'Sum of digits: 1',  isHidden: true,  description: '1+0+0 = 1' },
    ]
  },
  {
    id: 'e14',
    difficulty: 'easy',
    title: 'Print Pattern — Right Triangle',
    topic: 'Loops',
    tags: ['nested loops', 'pattern', 'print'],
    prompt: `Read a number N and print a right-angle triangle of asterisks with N rows. Row i should contain i asterisks.`,
    hint: 'Use a nested loop or print("*" * i).',
    solution: `n = int(input("Enter N: "))
for i in range(1, n + 1):
    print("*" * i)`,
    explanation: 'String multiplication "*" * i produces a string of i asterisks, so each row is one character longer.',
    starterCode: `n = int(input())
for i in range(1, n + 1):
    # print row i
    pass`,
    constraints: [
      { id: 'c1', label: 'Use for loop',              regex: '\\bfor\\b' },
      { id: 'c2', label: 'Use range()',               regex: '\\brange\\b' },
      { id: 'c3', label: 'Use string repetition (*)', regex: '"\\*"' },
    ],
    testCases: [
      { id: 'tc1', stdin: '3', testCode: '', expectedOutput: '*\n**\n***',            isHidden: false, description: 'N=3' },
      { id: 'tc2', stdin: '5', testCode: '', expectedOutput: '*\n**\n***\n****\n*****', isHidden: false, description: 'N=5' },
      { id: 'tc3', stdin: '1', testCode: '', expectedOutput: '*',                      isHidden: true,  description: 'N=1 edge case' },
      { id: 'tc4', stdin: '4', testCode: '', expectedOutput: '*\n**\n***\n****',       isHidden: true,  description: 'N=4' },
    ]
  },
  {
    id: 'e15',
    difficulty: 'easy',
    title: 'Celsius to Fahrenheit Converter',
    topic: 'Operators',
    tags: ['arithmetic', 'formula', 'float'],
    prompt: `Read a temperature in Celsius and convert it to Fahrenheit using the formula: F = (C × 9/5) + 32. Print the result rounded to 2 decimal places.`,
    hint: 'Use the standard conversion formula and round().',
    solution: `c = float(input("Enter temperature in Celsius: "))
f = (c * 9 / 5) + 32
print(f"Temperature in Fahrenheit: {f:.2f}")`,
    explanation: 'The formula multiplies by 9/5 (which gives a float result in Python 3) then adds 32. :.2f formats to 2 decimal places.',
    starterCode: `c = float(input())
# print "Temperature in Fahrenheit: X.XX"`,
    constraints: [
      { id: 'c1', label: 'Use formula (× and +)',  regex: '\\*.*\\+|\\+.*\\*' },
      { id: 'c2', label: 'Use :.2f format specifier', regex: '\\.2f' },
    ],
    testCases: [
      { id: 'tc1', stdin: '0',   testCode: '', expectedOutput: 'Temperature in Fahrenheit: 32.00',  isHidden: false, description: '0°C → 32°F' },
      { id: 'tc2', stdin: '100', testCode: '', expectedOutput: 'Temperature in Fahrenheit: 212.00', isHidden: false, description: '100°C → 212°F' },
      { id: 'tc3', stdin: '37',  testCode: '', expectedOutput: 'Temperature in Fahrenheit: 98.60',  isHidden: true,  description: 'Body temperature' },
      { id: 'tc4', stdin: '-40', testCode: '', expectedOutput: 'Temperature in Fahrenheit: -40.00', isHidden: true,  description: '-40°C = -40°F' },
    ]
  },
  {
    id: 'e16',
    difficulty: 'easy',
    title: 'Regex — Validate Email',
    topic: 'Regex',
    tags: ['re', 'pattern matching', 'email'],
    prompt: `Use the re module to validate whether a given string is a valid email address. A valid email has the pattern: word characters or dots, an @ symbol, word characters, a dot, and 2–4 letter TLD.`,
    hint: 'Import re and use re.fullmatch() with pattern r"[\\w.]+@\\w+\\.\\w{2,4}".',
    solution: `import re

email = input("Enter email: ")
pattern = r"[\w.]+@\w+\.\w{2,4}"
if re.fullmatch(pattern, email):
    print("Valid email")
else:
    print("Invalid email")`,
    explanation: '[\\w.]+ matches username chars (alphanumeric/underscore/dot), @, domain name, dot, and a 2–4 char TLD.',
    starterCode: `import re

email = input()
# print "Valid email" or "Invalid email"`,
    constraints: [
      { id: 'c1', label: 'Import re',                     regex: 'import re' },
      { id: 'c2', label: 'Use re.fullmatch or re.match',  regex: 're\\.fullmatch|re\\.match' },
    ],
    testCases: [
      { id: 'tc1', stdin: 'test@example.com', testCode: '', expectedOutput: 'Valid email',   isHidden: false, description: 'Valid .com email' },
      { id: 'tc2', stdin: 'invalid-email',    testCode: '', expectedOutput: 'Invalid email', isHidden: false, description: 'Missing @' },
      { id: 'tc3', stdin: 'user@domain.org',  testCode: '', expectedOutput: 'Valid email',   isHidden: true,  description: 'Valid .org email' },
      { id: 'tc4', stdin: '@nodomain.com',    testCode: '', expectedOutput: 'Invalid email', isHidden: true,  description: 'Missing username' },
    ]
  },
  {
    id: 'e17',
    difficulty: 'easy',
    title: 'Regex — Extract All Numbers',
    topic: 'Regex',
    tags: ['re.findall', 'digits', 'extraction'],
    prompt: `Given a string, use re.findall() to extract all integer numbers embedded in it and print them as a list.`,
    hint: 'The pattern r"\\d+" matches one or more consecutive digit characters.',
    solution: `import re

text = input("Enter a string: ")
numbers = re.findall(r"\\d+", text)
print("Numbers found:", numbers)`,
    explanation: 'r"\\d+" is a raw string that matches sequences of digits. findall returns all non-overlapping matches as a list.',
    starterCode: `import re

text = input()
# print "Numbers found: [...]"`,
    constraints: [
      { id: 'c1', label: 'Import re',          regex: 'import re' },
      { id: 'c2', label: 'Use re.findall()',   regex: 're\\.findall' },
      { id: 'c3', label: 'Use \\d+ pattern',  regex: '\\\\d' },
    ],
    testCases: [
      { id: 'tc1', stdin: 'abc 123 def 456', testCode: '', expectedOutput: "Numbers found: ['123', '456']", isHidden: false, description: 'Two numbers' },
      { id: 'tc2', stdin: 'hello world',     testCode: '', expectedOutput: 'Numbers found: []',             isHidden: false, description: 'No numbers' },
      { id: 'tc3', stdin: 'py3thon2',        testCode: '', expectedOutput: "Numbers found: ['3', '2']",     isHidden: true,  description: 'Embedded digits' },
      { id: 'tc4', stdin: '42 answers',      testCode: '', expectedOutput: "Numbers found: ['42']",         isHidden: true,  description: 'Single number' },
    ]
  },
  {
    id: 'e18',
    difficulty: 'easy',
    title: 'Swap Two Variables',
    topic: 'Operators',
    tags: ['tuple unpacking', 'swap', 'variables'],
    prompt: `Write a program that swaps two variables without using a temporary variable.`,
    hint: 'Python supports simultaneous assignment: a, b = b, a',
    solution: `a = int(input("Enter a: "))
b = int(input("Enter b: "))
a, b = b, a
print(f"After swap: a = {a}, b = {b}")`,
    explanation: 'Python evaluates the right-hand side as a tuple (b, a) and unpacks it simultaneously into a and b.',
    starterCode: `a = int(input())
b = int(input())
# swap without temp variable, then print "After swap: a = X, b = Y"`,
    constraints: [
      { id: 'c1', label: 'Use simultaneous assignment (a, b = b, a)', regex: '\\w+\\s*,\\s*\\w+\\s*=\\s*\\w+\\s*,\\s*\\w+' },
    ],
    testCases: [
      { id: 'tc1', stdin: '3\n7',   testCode: '', expectedOutput: 'After swap: a = 7, b = 3',  isHidden: false, description: '3 and 7' },
      { id: 'tc2', stdin: '10\n20', testCode: '', expectedOutput: 'After swap: a = 20, b = 10', isHidden: false, description: '10 and 20' },
      { id: 'tc3', stdin: '0\n5',   testCode: '', expectedOutput: 'After swap: a = 5, b = 0',  isHidden: true,  description: 'Zero and 5' },
      { id: 'tc4', stdin: '-1\n1',  testCode: '', expectedOutput: 'After swap: a = 1, b = -1', isHidden: true,  description: 'Negative and positive' },
    ]
  },
  {
    id: 'e19',
    difficulty: 'easy',
    title: 'Print Prime Numbers up to N',
    topic: 'Loops',
    tags: ['primes', 'nested loops', 'flag'],
    prompt: `Write a program that reads N and prints all prime numbers from 2 to N (inclusive), separated by spaces.`,
    hint: 'For each number, check if any integer from 2 to sqrt(n) divides it evenly.',
    solution: `n = int(input("Enter N: "))
for num in range(2, n + 1):
    is_prime = True
    for div in range(2, int(num ** 0.5) + 1):
        if num % div == 0:
            is_prime = False
            break
    if is_prime:
        print(num, end=" ")`,
    explanation: 'Checking divisors only up to the square root is sufficient; any factor larger than √n must pair with one smaller.',
    starterCode: `n = int(input())
# print primes from 2 to n, space-separated (use end=" ")`,
    constraints: [
      { id: 'c1', label: 'Use for loop',   regex: '\\bfor\\b' },
      { id: 'c2', label: 'Use range()',    regex: '\\brange\\b' },
      { id: 'c3', label: 'Use % (modulo)', regex: '%' },
    ],
    testCases: [
      { id: 'tc1', stdin: '10', testCode: '', expectedOutput: '2 3 5 7',                   isHidden: false, description: 'Primes up to 10' },
      { id: 'tc2', stdin: '20', testCode: '', expectedOutput: '2 3 5 7 11 13 17 19',       isHidden: false, description: 'Primes up to 20' },
      { id: 'tc3', stdin: '2',  testCode: '', expectedOutput: '2',                         isHidden: true,  description: 'N=2 edge case' },
      { id: 'tc4', stdin: '30', testCode: '', expectedOutput: '2 3 5 7 11 13 17 19 23 29', isHidden: true,  description: 'Primes up to 30' },
    ]
  },
  {
    id: 'e20',
    difficulty: 'easy',
    title: 'Factorial using a Loop',
    topic: 'Loops',
    tags: ['factorial', 'accumulator', 'for loop'],
    prompt: `Read a non-negative integer N and print N! (factorial) using a loop (not recursion).`,
    hint: 'Initialise result to 1 and multiply by each integer from 1 to N.',
    solution: `n = int(input("Enter N: "))
result = 1
for i in range(1, n + 1):
    result *= i
print(f"{n}! = {result}")`,
    explanation: 'Starting from 1 (the identity for multiplication) and multiplying up to N gives the factorial.',
    starterCode: `n = int(input())
# print "N! = X"`,
    constraints: [
      { id: 'c1', label: 'Use for loop',              regex: '\\bfor\\b' },
      { id: 'c2', label: 'Use range()',               regex: '\\brange\\b' },
      { id: 'c3', label: 'Use *= (multiply accumulator)', regex: '\\*=' },
    ],
    testCases: [
      { id: 'tc1', stdin: '5',  testCode: '', expectedOutput: '5! = 120',      isHidden: false, description: '5! = 120' },
      { id: 'tc2', stdin: '0',  testCode: '', expectedOutput: '0! = 1',        isHidden: false, description: '0! = 1 edge case' },
      { id: 'tc3', stdin: '10', testCode: '', expectedOutput: '10! = 3628800', isHidden: true,  description: '10!' },
      { id: 'tc4', stdin: '1',  testCode: '', expectedOutput: '1! = 1',        isHidden: true,  description: '1!' },
    ]
  },

  // ===== MEDIUM (21–26) =====
  {
    id: 'm1',
    difficulty: 'medium',
    title: 'Flatten a Nested List',
    topic: 'Lists',
    tags: ['list comprehension', 'nested lists', 'flatten'],
    prompt: `Given a list of lists, write a function flatten(nested) that returns a single flat list containing all elements.
Example: flatten([[1,2],[3,4],[5]]) → [1, 2, 3, 4, 5]`,
    hint: 'Use a list comprehension with two for clauses: [item for sublist in nested for item in sublist].',
    solution: `def flatten(nested):
    return [item for sublist in nested for item in sublist]

# Test
data = [[1, 2], [3, 4], [5]]
print(flatten(data))   # [1, 2, 3, 4, 5]`,
    explanation: 'The double-for comprehension first iterates over sublists, then over each item within. This is equivalent to two nested for loops.',
    starterCode: `def flatten(nested):
    # return a single flat list
    pass`,
    constraints: [
      { id: 'c1', label: 'Define flatten() function', regex: 'def flatten' },
      { id: 'c2', label: 'Use list comprehension',    regex: '\\[.+\\bfor\\b.+\\bin\\b' },
    ],
    testCases: [
      { id: 'tc1', stdin: '', testCode: 'print(flatten([[1,2],[3,4],[5]]))', expectedOutput: '[1, 2, 3, 4, 5]', isHidden: false, description: 'Basic nested list' },
      { id: 'tc2', stdin: '', testCode: 'print(flatten([[1],[2],[3]]))',      expectedOutput: '[1, 2, 3]',       isHidden: false, description: 'Single-element sublists' },
      { id: 'tc3', stdin: '', testCode: 'print(flatten([[10,20],[30]]))',     expectedOutput: '[10, 20, 30]',   isHidden: true,  description: 'Two sublists' },
      { id: 'tc4', stdin: '', testCode: 'print(flatten([[1,2,3,4]]))',        expectedOutput: '[1, 2, 3, 4]',   isHidden: true,  description: 'Already-flat sublist' },
    ]
  },
  {
    id: 'm2',
    difficulty: 'medium',
    title: 'Lambda — Sort by Second Element',
    topic: 'Lambda',
    tags: ['lambda', 'sorted', 'key function'],
    prompt: `Given a list of tuples, sort them in ascending order by their second element using a lambda as the key.
Example: [(1, 3), (2, 1), (4, 2)] → [(2, 1), (4, 2), (1, 3)]`,
    hint: 'Use sorted(data, key=lambda x: x[1]).',
    solution: `data = [(1, 3), (2, 1), (4, 2)]
result = sorted(data, key=lambda x: x[1])
print(result)   # [(2, 1), (4, 2), (1, 3)]`,
    explanation: 'The key argument receives a function applied to each element before comparison. lambda x: x[1] extracts the second element.',
    starterCode: `data = [(1, 3), (2, 1), (4, 2)]
result = sorted(data, key=lambda x: ...)
print(result)`,
    constraints: [
      { id: 'c1', label: 'Use lambda',   regex: '\\blambda\\b' },
      { id: 'c2', label: 'Use sorted()', regex: '\\bsorted\\b' },
    ],
    testCases: [
      {
        id: 'tc1', stdin: '', testCode: '',
        expectedOutput: '[(2, 1), (4, 2), (1, 3)]',
        isHidden: false, description: 'Sort [(1,3),(2,1),(4,2)]'
      },
      {
        id: 'tc2', stdin: '',
        testCode: "data2 = [(5, 2), (3, 1), (1, 4)]\nresult2 = sorted(data2, key=lambda x: x[1])\nprint(result2)",
        expectedOutput: '[(2, 1), (4, 2), (1, 3)]\n[(3, 1), (5, 2), (1, 4)]',
        isHidden: true, description: 'Different data'
      },
    ]
  },
  {
    id: 'm3',
    difficulty: 'medium',
    title: 'Filter Even Numbers with filter()',
    topic: 'Filter/Map',
    tags: ['filter', 'lambda', 'even numbers'],
    prompt: `Use filter() with a lambda to return only the even numbers from a given list.
Example: [1, 2, 3, 4, 5, 6] → [2, 4, 6]`,
    hint: 'filter(lambda x: x % 2 == 0, numbers) returns a filter object; wrap in list().',
    solution: `numbers = [1, 2, 3, 4, 5, 6]
evens = list(filter(lambda x: x % 2 == 0, numbers))
print(evens)   # [2, 4, 6]`,
    explanation: 'filter() keeps only the elements for which the predicate lambda returns True. list() converts the lazy iterator to a list.',
    starterCode: `numbers = [1, 2, 3, 4, 5, 6]
evens = list(filter(lambda x: ..., numbers))
print(evens)`,
    constraints: [
      { id: 'c1', label: 'Use filter()', regex: '\\bfilter\\b' },
      { id: 'c2', label: 'Use lambda',   regex: '\\blambda\\b' },
    ],
    testCases: [
      {
        id: 'tc1', stdin: '', testCode: '',
        expectedOutput: '[2, 4, 6]',
        isHidden: false, description: 'Filter [1,2,3,4,5,6]'
      },
      {
        id: 'tc2', stdin: '',
        testCode: "nums2 = [1, 3, 5, 7, 9, 10, 12]\nevens2 = list(filter(lambda x: x % 2 == 0, nums2))\nprint(evens2)",
        expectedOutput: '[2, 4, 6]\n[10, 12]',
        isHidden: true, description: 'Different list'
      },
    ]
  },
  {
    id: 'm4',
    difficulty: 'medium',
    title: 'Square Each Element with map()',
    topic: 'Filter/Map',
    tags: ['map', 'lambda', 'squares'],
    prompt: `Use map() with a lambda to create a new list where each element is the square of the corresponding element in the input list.
Example: [1, 2, 3, 4] → [1, 4, 9, 16]`,
    hint: 'map(lambda x: x**2, numbers) applies the function to every element.',
    solution: `numbers = [1, 2, 3, 4]
squares = list(map(lambda x: x ** 2, numbers))
print(squares)   # [1, 4, 9, 16]`,
    explanation: 'map() applies the function to every element and returns a map object. list() materialises the results.',
    starterCode: `numbers = [1, 2, 3, 4]
squares = list(map(lambda x: ..., numbers))
print(squares)`,
    constraints: [
      { id: 'c1', label: 'Use map()',   regex: '\\bmap\\b' },
      { id: 'c2', label: 'Use lambda',  regex: '\\blambda\\b' },
    ],
    testCases: [
      {
        id: 'tc1', stdin: '', testCode: '',
        expectedOutput: '[1, 4, 9, 16]',
        isHidden: false, description: 'Square [1,2,3,4]'
      },
      {
        id: 'tc2', stdin: '',
        testCode: "nums2 = [2, 3, 4]\nsq2 = list(map(lambda x: x ** 2, nums2))\nprint(sq2)",
        expectedOutput: '[1, 4, 9, 16]\n[4, 9, 16]',
        isHidden: true, description: 'Different list'
      },
    ]
  },
  {
    id: 'm5',
    difficulty: 'medium',
    title: 'Remove Duplicates Preserving Order',
    topic: 'Lists',
    tags: ['list', 'set', 'order preservation'],
    prompt: `Write a function remove_dupes(lst) that removes duplicate values from a list while preserving the original order of first appearances.
Example: [3, 1, 2, 1, 3, 4] → [3, 1, 2, 4]`,
    hint: 'Maintain a "seen" set to track which elements have been encountered.',
    solution: `def remove_dupes(lst):
    seen = set()
    result = []
    for item in lst:
        if item not in seen:
            result.append(item)
            seen.add(item)
    return result

print(remove_dupes([3, 1, 2, 1, 3, 4]))   # [3, 1, 2, 4]`,
    explanation: 'A set provides O(1) lookup. We add each unseen element to result and to seen so duplicates are skipped.',
    starterCode: `def remove_dupes(lst):
    # remove duplicates while preserving order
    pass`,
    constraints: [
      { id: 'c1', label: 'Define remove_dupes() function', regex: 'def remove_dupes' },
      { id: 'c2', label: 'Use set for fast lookup',        regex: '\\bset\\b|\\bset\\s*\\(' },
    ],
    testCases: [
      { id: 'tc1', stdin: '', testCode: 'print(remove_dupes([3, 1, 2, 1, 3, 4]))', expectedOutput: '[3, 1, 2, 4]', isHidden: false, description: 'Basic dedup' },
      { id: 'tc2', stdin: '', testCode: 'print(remove_dupes([1, 1, 1, 1]))',        expectedOutput: '[1]',          isHidden: false, description: 'All same' },
      { id: 'tc3', stdin: '', testCode: 'print(remove_dupes([1, 2, 3]))',            expectedOutput: '[1, 2, 3]',   isHidden: true,  description: 'No duplicates' },
      { id: 'tc4', stdin: '', testCode: 'print(remove_dupes([5, 3, 5, 1, 3]))',     expectedOutput: '[5, 3, 1]',   isHidden: true,  description: 'Multiple dupes' },
    ]
  },
  {
    id: 'm6',
    difficulty: 'medium',
    title: 'Word Frequency Counter',
    topic: 'Lists',
    tags: ['dictionary', 'split', 'frequency'],
    prompt: `Write a function word_freq(sentence) that returns a dictionary of each word's frequency in the given sentence (case-insensitive).
Example: "to be or not to be" → {'to': 2, 'be': 2, 'or': 1, 'not': 1}`,
    hint: 'Split the sentence, lowercase everything, and use a dictionary to count.',
    solution: `def word_freq(sentence):
    freq = {}
    for word in sentence.lower().split():
        freq[word] = freq.get(word, 0) + 1
    return freq

print(word_freq("to be or not to be"))`,
    explanation: 'dict.get(key, 0) returns 0 if the key is missing, avoiding a KeyError when initialising a new count.',
    starterCode: `def word_freq(sentence):
    # return a dict of word → count
    pass`,
    constraints: [
      { id: 'c1', label: 'Define word_freq() function', regex: 'def word_freq' },
      { id: 'c2', label: 'Use .split()',               regex: '\\.split\\(\\)' },
      { id: 'c3', label: 'Use a dictionary ({})',      regex: '\\{\\}|freq\\[|\\bdict\\b' },
    ],
    testCases: [
      { id: 'tc1', stdin: '', testCode: "print(word_freq('to be or not to be'))", expectedOutput: "{'to': 2, 'be': 2, 'or': 1, 'not': 1}", isHidden: false, description: 'Classic phrase' },
      { id: 'tc2', stdin: '', testCode: "print(word_freq('hello hello world'))",   expectedOutput: "{'hello': 2, 'world': 1}",             isHidden: false, description: 'Simple sentence' },
      { id: 'tc3', stdin: '', testCode: "print(word_freq('python'))",              expectedOutput: "{'python': 1}",                        isHidden: true,  description: 'Single word' },
      { id: 'tc4', stdin: '', testCode: "print(word_freq('A a A'))",               expectedOutput: "{'a': 3}",                             isHidden: true,  description: 'Case-insensitive' },
    ]
  },

  // ===== HARD (27–30) =====
  {
    id: 'h1',
    difficulty: 'hard',
    title: 'Float Precision — Round Currency',
    topic: 'Floats',
    tags: ['floating point', 'round', 'decimal'],
    prompt: `Explain why 0.1 + 0.2 != 0.3 in Python and write a function safe_add(a, b, decimals=2) that adds two floats and rounds the result to the given number of decimal places to avoid floating-point surprises.`,
    hint: 'Use round(result, decimals). For production code consider the decimal module.',
    solution: `# Floating-point representation issue
print(0.1 + 0.2)          # 0.30000000000000004
print(0.1 + 0.2 == 0.3)   # False

def safe_add(a, b, decimals=2):
    return round(a + b, decimals)

print(safe_add(0.1, 0.2))         # 0.3
print(safe_add(1.005, 2.995, 2))  # 4.0`,
    explanation: 'Floats use binary fractions; 0.1 has no exact binary representation. round() mitigates this for display and simple comparisons; the decimal module gives arbitrary precision.',
    starterCode: `def safe_add(a, b, decimals=2):
    # add a and b, round to decimals places
    pass`,
    constraints: [
      { id: 'c1', label: 'Define safe_add() function', regex: 'def safe_add' },
      { id: 'c2', label: 'Use round()',                regex: '\\bround\\b' },
    ],
    testCases: [
      { id: 'tc1', stdin: '', testCode: 'print(safe_add(0.1, 0.2))',        expectedOutput: '0.3', isHidden: false, description: '0.1 + 0.2 = 0.3' },
      { id: 'tc2', stdin: '', testCode: 'print(safe_add(1.5, 2.5))',        expectedOutput: '4.0', isHidden: false, description: '1.5 + 2.5 = 4.0' },
      { id: 'tc3', stdin: '', testCode: 'print(safe_add(0.7, 0.3))',        expectedOutput: '1.0', isHidden: true,  description: '0.7 + 0.3 = 1.0' },
      { id: 'tc4', stdin: '', testCode: 'print(safe_add(1.005, 2.995, 2))', expectedOutput: '4.0', isHidden: true,  description: 'Custom decimals' },
    ]
  },
  {
    id: 'h2',
    difficulty: 'hard',
    title: 'Set Operations — Common Friends',
    topic: 'Sets',
    tags: ['set', 'intersection', 'union'],
    prompt: `Two users each have a set of friends. Write a program that:
1. Prints their mutual friends (intersection) — use sorted() for consistent output
2. Prints all unique friends combined (union) — use sorted()
3. Prints friends that only user A has (difference) — use sorted()`,
    hint: 'Use set operators: & (intersection), | (union), - (difference). Wrap in sorted() when printing.',
    solution: `a_friends = {"Alice", "Bob", "Charlie", "Diana"}
b_friends = {"Bob", "Eve", "Charlie", "Frank"}

print("Mutual:", sorted(a_friends & b_friends))
print("All unique:", sorted(a_friends | b_friends))
print("Only A:", sorted(a_friends - b_friends))`,
    explanation: '& gives elements in both sets, | gives all elements from either set (no duplicates), and - gives elements in the first set not in the second.',
    starterCode: `a_friends = {"Alice", "Bob", "Charlie", "Diana"}
b_friends = {"Bob", "Eve", "Charlie", "Frank"}

# Use sorted() when printing sets for consistent output
print("Mutual:", sorted(a_friends & b_friends))
print("All unique:", sorted(a_friends | b_friends))
print("Only A:", sorted(a_friends - b_friends))`,
    constraints: [
      { id: 'c1', label: 'Use & (intersection)', regex: '&' },
      { id: 'c2', label: 'Use | (union)',         regex: '\\|' },
      { id: 'c3', label: 'Use - (difference)',    regex: '[a-z_]+\\s*-\\s*[a-z_]+' },
    ],
    testCases: [
      {
        id: 'tc1', stdin: '', testCode: '',
        expectedOutput: "Mutual: ['Bob', 'Charlie']\nAll unique: ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank']\nOnly A: ['Alice', 'Diana']",
        isHidden: false, description: 'Set operations (sorted)'
      },
      {
        id: 'tc2', stdin: '',
        testCode: "a2={'X','Y','Z'}\nb2={'Y','Z','W'}\nprint('Mutual:',sorted(a2&b2))\nprint('All unique:',sorted(a2|b2))\nprint('Only A:',sorted(a2-b2))",
        expectedOutput: "Mutual: ['Bob', 'Charlie']\nAll unique: ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank']\nOnly A: ['Alice', 'Diana']\nMutual: ['Y', 'Z']\nAll unique: ['W', 'X', 'Y', 'Z']\nOnly A: ['X']",
        isHidden: true, description: 'Different sets'
      },
    ]
  },
  {
    id: 'h3',
    difficulty: 'hard',
    title: 'Regex — Validate Password Strength',
    topic: 'Regex',
    tags: ['re', 'lookahead', 'password validation'],
    prompt: `Write a function is_strong_password(pwd) that returns True if the password:
- Is at least 8 characters long
- Contains at least one uppercase letter
- Contains at least one lowercase letter
- Contains at least one digit
- Contains at least one special character from !@#$%^&*`,
    hint: 'Use re.search() with separate patterns for each requirement, or combine with lookaheads.',
    solution: `import re

def is_strong_password(pwd):
    if len(pwd) < 8:
        return False
    checks = [
        r"[A-Z]",          # uppercase
        r"[a-z]",          # lowercase
        r"\\d",             # digit
        r"[!@#$%^&*]",     # special char
    ]
    return all(re.search(p, pwd) for p in checks)

print(is_strong_password("Abc@1234"))   # True
print(is_strong_password("abc12345"))   # False`,
    explanation: 'all() short-circuits: if any pattern is not found, it immediately returns False. re.search() looks anywhere in the string.',
    starterCode: `import re

def is_strong_password(pwd):
    # return True if pwd meets all 5 requirements
    pass`,
    constraints: [
      { id: 'c1', label: 'Define is_strong_password()', regex: 'def is_strong_password' },
      { id: 'c2', label: 'Import re',                   regex: 'import re' },
      { id: 'c3', label: 'Use re.search()',             regex: 're\\.search' },
    ],
    testCases: [
      { id: 'tc1', stdin: '', testCode: "print(is_strong_password('Abc@1234'))",   expectedOutput: 'True',  isHidden: false, description: 'Valid strong password' },
      { id: 'tc2', stdin: '', testCode: "print(is_strong_password('abc12345'))",   expectedOutput: 'False', isHidden: false, description: 'Missing upper & special' },
      { id: 'tc3', stdin: '', testCode: "print(is_strong_password('Short1!'))",    expectedOutput: 'False', isHidden: true,  description: 'Too short (7 chars)' },
      { id: 'tc4', stdin: '', testCode: "print(is_strong_password('MyP@ssw0rd'))", expectedOutput: 'True',  isHidden: true,  description: 'All requirements met' },
    ]
  },
  {
    id: 'h4',
    difficulty: 'hard',
    title: 'Recursive Binary Search',
    topic: 'Recursion',
    tags: ['recursion', 'binary search', 'divide and conquer'],
    prompt: `Implement a recursive function binary_search(arr, target, low, high) that returns the index of target in the sorted list arr, or -1 if not found.`,
    hint: 'Calculate mid = (low + high) // 2. Compare arr[mid] with target and recurse on the appropriate half.',
    solution: `def binary_search(arr, target, low, high):
    if low > high:
        return -1
    mid = (low + high) // 2
    if arr[mid] == target:
        return mid
    elif arr[mid] < target:
        return binary_search(arr, target, mid + 1, high)
    else:
        return binary_search(arr, target, low, mid - 1)

arr = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]
print(binary_search(arr, 23, 0, len(arr) - 1))   # 5
print(binary_search(arr, 10, 0, len(arr) - 1))   # -1`,
    explanation: 'Each recursive call halves the search space. Time complexity is O(log n). The base case low > high handles the not-found scenario.',
    starterCode: `def binary_search(arr, target, low, high):
    # return index of target, or -1 if not found
    pass`,
    constraints: [
      { id: 'c1', label: 'Define binary_search() function', regex: 'def binary_search' },
      { id: 'c2', label: 'Use recursion (call self)',       regex: 'binary_search\\s*\\(' },
    ],
    testCases: [
      { id: 'tc1', stdin: '', testCode: "arr=[2,5,8,12,16,23,38,56,72,91]\nprint(binary_search(arr,23,0,len(arr)-1))", expectedOutput: '5',  isHidden: false, description: 'Found at index 5' },
      { id: 'tc2', stdin: '', testCode: "arr=[2,5,8,12,16,23,38,56,72,91]\nprint(binary_search(arr,10,0,len(arr)-1))", expectedOutput: '-1', isHidden: false, description: 'Not found' },
      { id: 'tc3', stdin: '', testCode: "arr=[1,3,5,7,9]\nprint(binary_search(arr,1,0,len(arr)-1))",                   expectedOutput: '0',  isHidden: true,  description: 'First element' },
      { id: 'tc4', stdin: '', testCode: "arr=[1,3,5,7,9]\nprint(binary_search(arr,9,0,len(arr)-1))",                   expectedOutput: '4',  isHidden: true,  description: 'Last element' },
    ]
  },

  // ===== DEBUG (31–32) =====
  {
    id: 'd1',
    difficulty: 'debug',
    title: 'Debug — Broken Factorial Function',
    topic: 'Functions',
    tags: ['debugging', 'recursion', 'base case'],
    prompt: `The following function is supposed to compute the factorial of n recursively but it contains bugs. Identify and fix all errors.

\`\`\`python
def factorial(n)
    if n = 0:
        return
    return n * factorial(n - 1)

print(factorial(5))
\`\`\``,
    hint: 'Look for syntax errors (missing colon, wrong operator) and a missing return value in the base case.',
    solution: `def factorial(n):          # fix: missing colon
    if n == 0:             # fix: = → == (comparison, not assignment)
        return 1           # fix: must return 1 (identity for multiplication)
    return n * factorial(n - 1)

print(factorial(5))   # 120`,
    explanation: '3 bugs: (1) missing : after def, (2) = should be == in the condition, (3) base case must return 1 not None otherwise all products become None.',
    starterCode: `# Fix ALL bugs in this code:
def factorial(n)
    if n = 0:
        return
    return n * factorial(n - 1)

print(factorial(5))`,
    constraints: [
      { id: 'c1', label: 'Fix: colon after def factorial(...)', regex: 'def factorial\\s*\\(.*\\):' },
      { id: 'c2', label: 'Fix: use == for comparison',         regex: 'n\\s*==\\s*0' },
      { id: 'c3', label: 'Fix: return 1 as base case',         regex: 'return 1' },
    ],
    testCases: [
      { id: 'tc1', stdin: '', testCode: '',                    expectedOutput: '120',    isHidden: false, description: 'factorial(5) = 120' },
      { id: 'tc2', stdin: '', testCode: 'print(factorial(0))', expectedOutput: '120\n1', isHidden: true,  description: 'factorial(0) = 1' },
    ]
  },
  {
    id: 'd2',
    difficulty: 'debug',
    title: 'Debug — Off-by-One in Loop',
    topic: 'Loops',
    tags: ['debugging', 'range', 'off-by-one'],
    prompt: `This program is supposed to print all numbers from 1 to 10 inclusive and their sum, but the output is wrong. Find and fix the bugs.

\`\`\`python
total = 0
for i in range(10):
    total = total + i
    print(i)
print("Sum:", total)
\`\`\``,
    hint: 'range(10) produces 0–9, not 1–10. Also check whether i is added before or after printing.',
    solution: `total = 0
for i in range(1, 11):   # fix: start at 1, end at 11 (exclusive)
    total = total + i
    print(i)
print("Sum:", total)     # 55`,
    explanation: '2 bugs: (1) range(10) gives 0–9; we need range(1, 11) to get 1–10 inclusive. (2) i=0 was being added, skewing the sum.',
    starterCode: `# Fix ALL bugs in this code:
total = 0
for i in range(10):
    total = total + i
    print(i)
print("Sum:", total)`,
    constraints: [
      { id: 'c1', label: 'Fix: range starts at 1',  regex: 'range\\s*\\(\\s*1' },
      { id: 'c2', label: 'Fix: range ends at 11',   regex: 'range\\s*\\(.*11' },
    ],
    testCases: [
      { id: 'tc1', stdin: '', testCode: '', expectedOutput: '1\n2\n3\n4\n5\n6\n7\n8\n9\n10\nSum: 55', isHidden: false, description: 'Numbers 1–10 and sum 55' },
      { id: 'tc2', stdin: '', testCode: '', expectedOutput: '1\n2\n3\n4\n5\n6\n7\n8\n9\n10\nSum: 55', isHidden: true,  description: 'Sum must be 55 not 45' },
    ]
  }
]

// ===== TEST CONFIGURATIONS =====
export const tests = [
  {
    id: 'easy',
    title: 'Easy Practice Test',
    description: 'Fundamentals: conditionals, loops, strings & operators',
    icon: '🟢',
    color: '#10b981',
    gradient: 'linear-gradient(135deg, #10b981, #06b6d4)',
    timeLimit: 30,
    questionIds: ['e1', 'e2', 'e3', 'e4', 'e5', 'e6', 'e7', 'e8', 'e9', 'e10'],
    topics: ['Conditionals', 'Loops', 'Strings', 'Operators']
  },
  {
    id: 'medium',
    title: 'Medium Practice Test',
    description: 'Lists, lambda expressions, filter & map',
    icon: '🟡',
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)',
    timeLimit: 40,
    questionIds: ['m1', 'm2', 'm3', 'm4', 'm5', 'm6'],
    topics: ['Lists', 'Lambda', 'Filter/Map']
  },
  {
    id: 'hard',
    title: 'Hard Practice Test',
    description: 'Floats, sets, regex validation & recursion',
    icon: '🔴',
    color: '#f43f5e',
    gradient: 'linear-gradient(135deg, #f43f5e, #8b5cf6)',
    timeLimit: 50,
    questionIds: ['h1', 'h2', 'h3', 'h4'],
    topics: ['Floats', 'Sets', 'Regex', 'Recursion']
  },
  {
    id: 'debug',
    title: 'Debug Challenge',
    description: 'Spot and fix bugs in broken Python programs',
    icon: '🐛',
    color: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
    timeLimit: 20,
    questionIds: ['d1', 'd2'],
    topics: ['Functions', 'Loops', 'Logic Errors']
  },
  {
    id: 'mixed',
    title: 'Mixed Practice',
    description: 'A balanced selection across all difficulty levels',
    icon: '⚡',
    color: '#3b82f6',
    gradient: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
    timeLimit: 60,
    questionIds: ['e1', 'e4', 'e9', 'e16', 'e20', 'm1', 'm3', 'm6', 'h2', 'd1'],
    topics: ['Conditionals', 'Loops', 'Regex', 'Lists', 'Sets', 'Debug']
  }
]

// Helper — get question objects for a test
export function getTestQuestions(testId) {
  const test = tests.find(t => t.id === testId)
  if (!test) return []
  return test.questionIds.map(qid => questions.find(q => q.id === qid)).filter(Boolean)
}

export const DIFFICULTY_COLORS = {
  easy: '#10b981',
  medium: '#f59e0b',
  hard: '#f43f5e',
  debug: '#8b5cf6'
}

export const DIFFICULTY_LABELS = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
  debug: 'Debug'
}
