import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [skill, setSkill] = useState('programming');
  const [answers, setAnswers] = useState({}); // Store all answers across levels
  const [levelResults, setLevelResults] = useState({}); // Store results for each level
  const [error, setError] = useState(null);
  const [currentLevel, setCurrentLevel] = useState('beginner'); // Track current level
  const [selectedQuestions, setSelectedQuestions] = useState({}); // Store selected questions

  // Static question pool with 30 questions per level for each of the 5 skills
  const questionPool = {
    programming: {
      beginner: [
        { id: 1, text: 'What is the output of print(2 ** 3) in Python?', options: ['6', '8', '9', '2'], correct: '8' },
        { id: 2, text: 'Which data type is used to store a single character in Python?', options: ['int', 'char', 'str', 'float'], correct: 'str' },
        { id: 3, text: 'What will print(len("hello")) return?', options: ['4', '5', '6', 'Error'], correct: '5' },
        { id: 4, text: 'What is the correct way to comment a single line in Python?', options: ['//', '#', '/* */', '--'], correct: '#' },
        { id: 5, text: 'Which operator is used for integer division in Python?', options: ['/', '//', '%', '*'], correct: '//' },
        { id: 6, text: 'What is the output of print(type(42)) in Python?', options: ['int', 'float', 'str', 'bool'], correct: 'int' },
        { id: 7, text: 'Which keyword is used to define a variable in Python?', options: ['var', 'let', 'def', 'No keyword needed'], correct: 'No keyword needed' },
        { id: 8, text: 'What does the range(5) function generate in Python?', options: ['[0, 1, 2, 3, 4]', '[1, 2, 3, 4, 5]', '[0, 5]', 'Error'], correct: '[0, 1, 2, 3, 4]' },
        { id: 9, text: 'Which method converts a string to uppercase in Python?', options: ['toUpper()', 'upper()', 'capitalize()', 'uppercase()'], correct: 'upper()' },
        { id: 10, text: 'What is the output of print(10 % 3) in Python?', options: ['3', '3.3', '1', '0'], correct: '1' },
        { id: 11, text: 'What is the output of print("Python"[0])?', options: ['P', 'y', 't', 'Error'], correct: 'P' },
        { id: 12, text: 'Which operator checks for equality in Python?', options: ['=', '==', '!=', '==='], correct: '==' },
        { id: 13, text: 'What is the output of print(5 > 3)?', options: ['True', 'False', '5', 'Error'], correct: 'True' },
        { id: 14, text: 'What is the output of print(3 + 2 * 2)?', options: ['7', '10', '9', '5'], correct: '7' },
        { id: 15, text: 'Which method converts an integer to a string in Python?', options: ['str()', 'int()', 'float()', 'bool()'], correct: 'str()' },
        { id: 16, text: 'What is the output of print("Hello" + "World")?', options: ['Hello World', 'HelloWorld', 'HW', 'Error'], correct: 'HelloWorld' },
        { id: 17, text: 'Which keyword is used for a loop in Python?', options: ['loop', 'for', 'while', 'both for and while'], correct: 'both for and while' },
        { id: 18, text: 'What is the output of print(5 // 2)?', options: ['2.5', '2', '3', '1'], correct: '2' },
        { id: 19, text: 'What is the default value of a boolean variable in Python?', options: ['True', 'False', '0', 'None'], correct: 'False' },
        { id: 20, text: 'Which function gets user input in Python?', options: ['get()', 'input()', 'read()', 'scan()'], correct: 'input()' },
        { id: 21, text: 'What is the output of print(3 != 3)?', options: ['True', 'False', '3', 'Error'], correct: 'False' },
        { id: 22, text: 'Which data type stores a sequence of characters?', options: ['list', 'str', 'tuple', 'set'], correct: 'str' },
        { id: 23, text: 'What is the output of print(4 <= 4)?', options: ['True', 'False', '4', 'Error'], correct: 'True' },
        { id: 24, text: 'Which operator is used for exponentiation in Python?', options: ['^', '**', '*', '//'], correct: '**' },
        { id: 25, text: 'What is the output of print(8 - 3)?', options: ['5', '11', '3', 'Error'], correct: '5' },
        { id: 26, text: 'Which method checks if a string is a digit?', options: ['isdigit()', 'isnumber()', 'isnumeric()', 'both isdigit() and isnumeric()'], correct: 'both isdigit() and isnumeric()' },
        { id: 27, text: 'What is the output of print("abc" * 2)?', options: ['abc2', 'abcabc', '2abc', 'Error'], correct: 'abcabc' },
        { id: 28, text: 'Which keyword checks a condition in Python?', options: ['condition', 'check', 'if', 'when'], correct: 'if' },
        { id: 29, text: 'What is the output of print(2 + float("3"))?', options: ['5', '5.0', '23', 'Error'], correct: '5.0' },
        { id: 30, text: 'What does the "and" operator do in Python?', options: ['Returns True if both conditions are true', 'Returns True if either condition is true', 'Returns False always', 'Error'], correct: 'Returns True if both conditions are true' },
      ],
      intermediate: [
        { id: 31, text: 'What is the output of x = [1, 2, 3]; x.append(4); print(x)?', options: ['[4, 1, 2, 3]', 'Error', '[1, 2, 3]', '[1, 2, 3, 4]'], correct: '[1, 2, 3, 4]' },
        { id: 32, text: 'Which keyword is used to define a function in Python?', options: ['fun', 'define', 'function', 'def'], correct: 'def' },
        { id: 33, text: 'What does list comprehension [x * 2 for x in range(3)] produce?', options: ['[1, 2, 3]', '[0, 1, 2]', '[2, 4, 6]', '[0, 2, 4]'], correct: '[0, 2, 4]' },
        { id: 34, text: 'What is the output of print("Hello"[1:4]) in Python?', options: ['Hello', 'lo', 'ell', 'Hel'], correct: 'ell' },
        { id: 35, text: 'Which method removes the last element from a list in Python?', options: ['clear()', 'delete()', 'remove()', 'pop()'], correct: 'pop()' },
        { id: 36, text: 'What is the output of print(list(filter(lambda x: x > 0, [-1, 0, 1, 2])))?', options: ['Error', '[0, 1, 2]', '[1, 2]', '[-1, 0, 1, 2]'], correct: '[1, 2]' },
        { id: 37, text: 'Which module is used for mathematical functions in Python?', options: ['os', 'time', 'random', 'math'], correct: 'math' },
        { id: 38, text: 'What does the break statement do in a Python loop?', options: ['Restarts the loop', 'Continues the loop', 'Exits the loop', 'Skips to the next iteration'], correct: 'Exits the loop' },
        { id: 39, text: 'What is the output of print(dict([("a", 1), ("b", 2)]))?', options: ['Error', '[(a, 1), (b, 2)]', '{"a": 1, "b": 2}', '{a: 1, b: 2}'], correct: '{"a": 1, "b": 2}' },
        { id: 40, text: 'Which method adds an element at the end of a list in Python?', options: ['insert()', 'extend()', 'append()', 'add()'], correct: 'append()' },
        { id: 41, text: 'What is the output of print(sorted([3, 1, 2]))?', options: ['Error', '[3, 1, 2]', '[3, 2, 1]', '[1, 2, 3]'], correct: '[1, 2, 3]' },
        { id: 42, text: 'Which method removes all elements from a list in Python?', options: ['pop()', 'remove()', 'delete()', 'clear()'], correct: 'clear()' },
        { id: 43, text: 'What is the output of print([x for x in range(5) if x % 2 == 0])?', options: ['Error', '[0, 1, 2, 3, 4]', '[1, 3]', '[0, 2, 4]'], correct: '[0, 2, 4]' },
        { id: 44, text: 'What does the continue statement do in a Python loop?', options: ['Pauses the loop', 'Restarts the loop', 'Skips to the next iteration', 'Exits the loop'], correct: 'Skips to the next iteration' },
        { id: 45, text: 'What is the output of print(len([1, [2, 3], 4]))?', options: ['Error', '5', '4', '3'], correct: '3' },
        { id: 46, text: 'Which method adds multiple elements to a list in Python?', options: ['add()', 'insert()', 'extend()', 'append()'], correct: 'extend()' },
        { id: 47, text: 'What is the output of print(tuple([1, 2, 3]))?', options: ['Error', '{1, 2, 3}', '[1, 2, 3]', '(1, 2, 3)'], correct: '(1, 2, 3)' },
        { id: 48, text: 'Which module is used to generate random numbers in Python?', options: ['sys', 'time', 'math', 'random'], correct: 'random' },
        { id: 49, text: 'What is the output of print(set([1, 2, 2, 3]))?', options: ['Error', '[1, 2, 3]', '{1, 2, 2, 3}', '{1, 2, 3}'], correct: '{1, 2, 3}' },
        { id: 50, text: 'What does the "in" keyword do in Python?', options: ['Declares a variable', 'Imports a module', 'Defines a loop', 'Checks membership'], correct: 'Checks membership' },
        { id: 51, text: 'What is the output of print([1, 2, 3].index(2))?', options: ['Error', '2', '1', '0'], correct: '1' },
        { id: 52, text: 'Which method reverses a list in Python?', options: ['sort()', 'flip()', 'revert()', 'reverse()'], correct: 'reverse()' },
        { id: 53, text: 'What is the output of print("python".capitalize())?', options: ['Error', 'python', 'PYTHON', 'Python'], correct: 'Python' },
        { id: 54, text: 'What does the "pass" statement do in Python?', options: ['Raises an error', 'Skips an iteration', 'Does nothing', 'Exits a loop'], correct: 'Does nothing' },
        { id: 55, text: 'What is the output of print(max([1, 5, 3]))?', options: ['Error', '5', '3', '1'], correct: '5' },
        { id: 56, text: 'Which method checks if a key exists in a dictionary?', options: ['contains()', 'in', 'has_key()', 'exists()'], correct: 'in' },
        { id: 57, text: 'What is the output of print([1, 2, 3][1])?', options: ['Error', '3', '2', '1'], correct: '2' },
        { id: 58, text: 'What does the "or" operator do in Python?', options: ['Error', 'Returns False always', 'Returns True if either condition is true', 'Returns True if both conditions are true'], correct: 'Returns True if either condition is true' },
        { id: 59, text: 'What is the output of print(list(range(2, 5)))?', options: ['Error', '[1, 2, 3, 4]', '[2, 3, 4, 5]', '[2, 3, 4]'], correct: '[2, 3, 4]' },
        { id: 60, text: 'Which method removes a specific element from a list?', options: ['clear()', 'pop()', 'delete()', 'remove()'], correct: 'remove()' },
      ],
      advanced: [
        { id: 61, text: 'What is the output of def fib(n): return n if n <= 1 else fib(n-1) + fib(n-2); print(fib(4))?', options: ['Error', '8', '5', '3'], correct: '3' },
        { id: 62, text: 'Which module is used for handling regular expressions in Python?', options: ['os', 'regex', 're', 'math'], correct: 're' },
        { id: 63, text: 'What will this code do: with open("file.txt", "w") as f: f.write("test")?', options: ['Deletes file.txt', 'Appends "test" to file.txt', 'Writes "test" to file.txt', 'Reads from file.txt'], correct: 'Writes "test" to file.txt' },
        { id: 64, text: 'What does the "lambda" keyword do in Python?', options: ['Declares a class', 'Imports a module', 'Creates an anonymous function', 'Defines a loop'], correct: 'Creates an anonymous function' },
        { id: 65, text: 'What is the output of print(list(map(lambda x: x*2, [1, 2, 3])))?', options: ['Error', '[1, 4, 9]', '[2, 4, 6]', '[1, 2, 3]'], correct: '[2, 4, 6]' },
        { id: 66, text: 'What does the @staticmethod decorator do in Python?', options: ['Defines a private method', 'Converts a method to a property', 'Creates a static method that doesn\'t need self', 'Decorates a class method'], correct: 'Creates a static method that doesn\'t need self' },
        { id: 67, text: 'Which method is used to handle exceptions in Python?', options: ['exception', 'handle', 'try-except', 'catch-error'], correct: 'try-except' },
        { id: 68, text: 'What is the output of print([x for x in range(10) if x % 2 == 0][-1])?', options: ['Error', '10', '9', '8'], correct: '8' },
        { id: 69, text: 'What does the "super()" function do in Python?', options: ['Imports a module', 'Defines a new class', 'Calls the parent class method', 'Creates a superclass'], correct: 'Calls the parent class method' },
        { id: 70, text: 'Which module is used for working with dates in Python?', options: ['date', 'calendar', 'datetime', 'time'], correct: 'datetime' },
        { id: 71, text: 'What is the output of print(list(zip([1, 2], [3, 4])))?', options: ['Error', '[(1, 2), (3, 4)]', '[1, 2, 3, 4]', '[(1, 3), (2, 4)]'], correct: '[(1, 3), (2, 4)]' },
        { id: 72, text: 'What does the "yield" keyword do in Python?', options: ['Pauses a loop', 'Exits a function', 'Creates a generator', 'Returns a value'], correct: 'Creates a generator' },
        { id: 73, text: 'Which method is called when an object is created in Python?', options: ['__start__', '__create__', '__init__', '__new__'], correct: '__init__' },
        { id: 74, text: 'What is the output of print(isinstance(42, int))?', options: ['Error', '42', 'False', 'True'], correct: 'True' },
        { id: 75, text: 'What does the "global" keyword do in Python?', options: ['Creates a class', 'Defines a function', 'Declares a global variable', 'Imports a module'], correct: 'Declares a global variable' },
        { id: 76, text: 'What is the output of print([1, 2, 3].__len__())?', options: ['Error', '1', '2', '3'], correct: '3' },
        { id: 77, text: 'Which module is used for file system operations in Python?', options: ['path', 'file', 'sys', 'os'], correct: 'os' },
        { id: 78, text: 'What does the "@property" decorator do in Python?', options: ['Defines a private method', 'Creates a setter method', 'Creates a getter method', 'Defines a static method'], correct: 'Creates a getter method' },
        { id: 79, text: 'What is the output of print(frozenset([1, 2, 2, 3]))?', options: ['Error', '[1, 2, 3]', 'frozenset({1, 2, 2, 3})', 'frozenset({1, 2, 3})'], correct: 'frozenset({1, 2, 3})' },
        { id: 80, text: 'What does the "nonlocal" keyword do in Python?', options: ['Defines a function', 'Imports a module', 'Accesses a variable in an outer scope', 'Declares a global variable'], correct: 'Accesses a variable in an outer scope' },
        { id: 81, text: 'What is the output of print(sum([1, 2, 3, 4]))?', options: ['Error', '7', '9', '10'], correct: '10' },
        { id: 82, text: 'Which method is used to create a new thread in Python?', options: ['thread.start', 'new_thread', 'threading.Thread', 'thread.create'], correct: 'threading.Thread' },
        { id: 83, text: 'What does the "assert" statement do in Python?', options: ['Creates a class', 'Imports a module', 'Defines a loop', 'Raises an error if a condition is false'], correct: 'Raises an error if a condition is false' },
        { id: 84, text: 'What is the output of print(any([False, True, False]))?', options: ['None', 'Error', 'False', 'True'], correct: 'True' },
        { id: 85, text: 'What does the "collections" module provide in Python?', options: ['Networking tools', 'File handling utilities', 'Specialized container datatypes', 'Mathematical functions'], correct: 'Specialized container datatypes' },
        { id: 86, text: 'What is the output of print(all([True, True, False]))?', options: ['None', 'Error', 'False', 'True'], correct: 'False' },
        { id: 87, text: 'Which method is used to deep copy an object in Python?', options: ['deepcopy', 'clone', 'copy.copy', 'copy.deepcopy'], correct: 'copy.deepcopy' },
        { id: 88, text: 'What does the "itertools" module provide in Python?', options: ['Networking tools', 'File handling utilities', 'Mathematical functions', 'Tools for working with iterators'], correct: 'Tools for working with iterators' },
        { id: 89, text: 'What is the output of print(list(enumerate([\'a\', \'b\'])))?', options: ['Error', '[\'a\', \'b\']', '[0, 1]', '[(0, \'a\'), (1, \'b\')]'], correct: '[(0, \'a\'), (1, \'b\')]' },
        { id: 90, text: 'What does the "asyncio" module provide in Python?', options: ['Mathematical functions', 'Networking tools', 'File handling utilities', 'Asynchronous programming support'], correct: 'Asynchronous programming support' },
      ],
    },
    web_development: {
      beginner: [
        { id: 91, text: 'Which tag is used to define the structure of an HTML document?', options: ['<div>', '<html>', '<head>', '<body>'], correct: '<html>' },
        { id: 92, text: 'What does the CSS property "margin" control?', options: ['Background color', 'Border thickness', 'Space outside an element', 'Text color'], correct: 'Space outside an element' },
        { id: 93, text: 'Which symbol is used to select an element by ID in CSS?', options: ['@', '$', '#', '.'], correct: '#' },
        { id: 94, text: 'What is the default display value of a <div> element in CSS?', options: ['none', 'flex', 'block', 'inline'], correct: 'block' },
        { id: 95, text: 'Which HTML tag is used to create a hyperlink?', options: ['<url>', '<href>', '<a>', '<link>'], correct: '<a>' },
        { id: 96, text: 'What does the CSS property "padding" control?', options: ['Text alignment', 'Space inside an element', 'Space outside an element', 'Border thickness'], correct: 'Space inside an element' },
        { id: 97, text: 'Which HTML tag is used to define a paragraph?', options: ['<paragraph>', '<text>', '<p>', '<para>'], correct: '<p>' },
        { id: 98, text: 'What does the CSS property "color" control?', options: ['Shadow color', 'Text color', 'Border color', 'Background color'], correct: 'Text color' },
        { id: 99, text: 'Which tag is used to add an image in HTML?', options: ['<src>', '<picture>', '<img>', '<image>'], correct: '<img>' },
        { id: 100, text: 'What is the correct CSS syntax to change font size?', options: ['fontsize: 16px;', 'size: 16px;', 'font-size: 16px;', 'font: 16px;'], correct: 'font-size: 16px;' },
        { id: 101, text: 'Which HTML tag defines a heading?', options: ['<heading>', '<header>', '<h1>', '<head>'], correct: '<h1>' },
        { id: 102, text: 'What does the CSS property "border" control?', options: ['Font style', 'Space inside an element', 'Border around an element', 'Text alignment'], correct: 'Border around an element' },
        { id: 103, text: 'Which HTML tag is used to create an unordered list?', options: ['<list>', '<li>', '<ul>', '<ol>'], correct: '<ul>' },
        { id: 104, text: 'What does the CSS "display: none;" do?', options: ['Increases opacity', 'Aligns an element', 'Hides an element', 'Shows an element'], correct: 'Hides an element' },
        { id: 105, text: 'Which HTML attribute specifies the URL of a link?', options: ['link', 'url', 'href', 'src'], correct: 'href' },
        { id: 106, text: 'What is the correct HTML tag for a line break?', options: ['<newline>', '<lb>', '<br>', '<break>'], correct: '<br>' },
        { id: 107, text: 'Which CSS property sets the background color?', options: ['background', 'bg-color', 'color', 'background-color'], correct: 'background-color' },
        { id: 108, text: 'Which HTML tag is used to define a table?', options: ['<td>', '<tr>', '<table>', '<tab>'], correct: '<table>' },
        { id: 109, text: 'What does the CSS property "text-align" control?', options: ['Text spacing', 'Text size', 'Text alignment', 'Text color'], correct: 'Text alignment' },
        { id: 110, text: 'Which HTML tag is used to include CSS in an HTML file?', options: ['<css>', 'Both <style> and <link>', '<link>', '<style>'], correct: 'Both <style> and <link>' },
        { id: 111, text: 'What is the correct CSS syntax to center an element horizontally?', options: ['horizontal-align: center;', 'center: true;', 'text-align: center;', 'align: center;'], correct: 'text-align: center;' },
        { id: 112, text: 'Which HTML tag defines a form?', options: ['<field>', '<submit>', '<form>', '<input>'], correct: '<form>' },
        { id: 113, text: 'What does the CSS "float" property do?', options: ['Hides an element', 'Changes font size', 'Floats an element to the left or right', 'Aligns text'], correct: 'Floats an element to the left or right' },
        { id: 114, text: 'Which HTML tag is used to define a table row?', options: ['<table>', '<th>', '<tr>', '<td>'], correct: '<tr>' },
        { id: 115, text: 'What does the CSS "position: absolute;" do?', options: ['Aligns an element', 'Hides an element', 'Positions an element relative to its parent', 'Positions an element relative to the viewport'], correct: 'Positions an element relative to its parent' },
        { id: 116, text: 'Which HTML attribute specifies an image source?', options: ['url', 'img', 'src', 'href'], correct: 'src' },
        { id: 117, text: 'What does the CSS "font-weight" property control?', options: ['Font color', 'Font boldness', 'Font style', 'Font size'], correct: 'Font boldness' },
        { id: 118, text: 'Which HTML tag defines a list item?', options: ['<item>', '<ol>', '<li>', '<ul>'], correct: '<li>' },
        { id: 119, text: 'What does the CSS "z-index" property control?', options: ['Element position', 'Element size', 'Stacking order of elements', 'Element opacity'], correct: 'Stacking order of elements' },
        { id: 120, text: 'Which HTML tag is used to define a header cell in a table?', options: ['<table>', '<tr>', '<th>', '<td>'], correct: '<th>' },
      ],
      intermediate: [
        { id: 121, text: 'What is the purpose of the flexbox in CSS?', options: ['To handle HTTP requests', 'To style text fonts', 'To layout items in a flexible container', 'To create animations'], correct: 'To layout items in a flexible container' },
        { id: 122, text: 'Which event is triggered when a user clicks a button in JavaScript?', options: ['onhover', 'onload', 'onclick', 'onchange'], correct: 'onclick' },
        { id: 123, text: 'What does JSON.stringify() do in JavaScript?', options: ['Creates a new JSON file', 'Validates JSON syntax', 'Converts an object to a JSON string', 'Parses a JSON string to an object'], correct: 'Converts an object to a JSON string' },
        { id: 124, text: 'Which CSS property aligns items in a flex container along the main axis?', options: ['flex-direction', 'align-content', 'justify-content', 'align-items'], correct: 'justify-content' },
        { id: 125, text: 'What does the JavaScript method "querySelector" do?', options: ['Adds an event listener', 'Removes an element', 'Selects the first element matching a CSS selector', 'Creates a new element'], correct: 'Selects the first element matching a CSS selector' },
        { id: 126, text: 'What does the CSS "flex-direction" property control?', options: ['Size of flex items', 'Spacing of flex items', 'Direction of flex items', 'Alignment of flex items'], correct: 'Direction of flex items' },
        { id: 127, text: 'Which JavaScript method adds an event listener to an element?', options: ['listenEvent()', 'attachEvent()', 'addEventListener()', 'onEvent()'], correct: 'addEventListener()' },
        { id: 128, text: 'What does the CSS "transition" property do?', options: ['Aligns text', 'Hides an element', 'Animates changes in properties', 'Changes element position'], correct: 'Animates changes in properties' },
        { id: 129, text: 'Which HTML attribute is used to specify a form submission method?', options: ['type', 'submit', 'method', 'action'], correct: 'method' },
        { id: 130, text: 'What does the JavaScript "getElementById" method do?', options: ['Removes an element', 'Creates an element', 'Selects an element by ID', 'Selects elements by class'], correct: 'Selects an element by ID' },
        { id: 131, text: 'What does the CSS "align-items" property do in flexbox?', options: ['Controls item spacing', 'Sets flex direction', 'Aligns items along the cross axis', 'Aligns items along the main axis'], correct: 'Aligns items along the cross axis' },
        { id: 132, text: 'Which JavaScript method removes an event listener?', options: ['stopEvent()', 'offEvent()', 'removeEventListener()', 'detachEvent()'], correct: 'removeEventListener()' },
        { id: 133, text: 'What does the CSS "box-shadow" property do?', options: ['Hides an element', 'Aligns text', 'Adds a shadow to an element', 'Changes element size'], correct: 'Adds a shadow to an element' },
        { id: 134, text: 'Which HTML tag is used to embed a video?', options: ['<movie>', '<embed>', '<video>', '<media>'], correct: '<video>' },
        { id: 135, text: 'What does the JavaScript "innerHTML" property do?', options: ['Adds an event listener', 'Removes an element', 'Gets or sets the HTML content of an element', 'Gets the text content'], correct: 'Gets or sets the HTML content of an element' },
        { id: 136, text: 'What does the CSS "grid-template-columns" property do?', options: ['Sets grid gaps', 'Aligns grid items', 'Defines columns in a grid layout', 'Defines rows in a grid layout'], correct: 'Defines columns in a grid layout' },
        { id: 137, text: 'Which JavaScript method creates a new array with the results of calling a function on every element?', options: ['forEach()', 'reduce()', 'map()', 'filter()'], correct: 'map()' },
        { id: 138, text: 'What does the CSS "overflow" property control?', options: ['Font size', 'Text alignment', 'Content overflow behavior', 'Element visibility'], correct: 'Content overflow behavior' },
        { id: 139, text: 'Which HTML tag is used to embed audio?', options: ['<play>', '<media>', '<audio>', '<sound>'], correct: '<audio>' },
        { id: 140, text: 'What does the JavaScript "setTimeout" function do?', options: ['Creates a loop', 'Stops execution', 'Delays execution of a function', 'Repeats a function'], correct: 'Delays execution of a function' },
        { id: 141, text: 'What does the CSS "position: relative;" do?', options: ['Aligns an element', 'Hides an element', 'Positions an element relative to its normal position', 'Positions an element relative to the viewport'], correct: 'Positions an element relative to its normal position' },
        { id: 142, text: 'Which JavaScript method filters elements from an array?', options: ['forEach()', 'reduce()', 'filter()', 'map()'], correct: 'filter()' },
        { id: 143, text: 'What does the CSS "opacity" property control?', options: ['Element color', 'Element position', 'Element transparency', 'Element size'], correct: 'Element transparency' },
        { id: 144, text: 'Which HTML attribute specifies the destination of a form submission?', options: ['target', 'submit', 'action', 'method'], correct: 'action' },
        { id: 145, text: 'What does the JavaScript "Array.prototype.push" method do?', options: ['Removes an element from the start', 'Adds an element to the start', 'Adds an element to the end of an array', 'Removes an element from the end'], correct: 'Adds an element to the end of an array' },
        { id: 146, text: 'What does the CSS "display: inline-block;" do?', options: ['Aligns text', 'Displays an element as a block', 'Displays an element as an inline-level block container', 'Hides an element'], correct: 'Displays an element as an inline-level block container' },
        { id: 147, text: 'Which JavaScript method combines elements of an array into a single value?', options: ['forEach()', 'filter()', 'reduce()', 'map()'], correct: 'reduce()' },
        { id: 148, text: 'What does the CSS "border-radius" property do?', options: ['Aligns the border', 'Sets the border thickness', 'Rounds the corners of an element', 'Sets the border color'], correct: 'Rounds the corners of an element' },
        { id: 149, text: 'Which HTML tag is used to create a dropdown menu?', options: ['<option>', '<menu>', '<select>', '<dropdown>'], correct: '<select>' },
        { id: 150, text: 'What does the JavaScript "setInterval" function do?', options: ['Creates a loop', 'Stops execution', 'Repeats a function at intervals', 'Delays execution of a function'], correct: 'Repeats a function at intervals' },
      ],
      advanced: [
        { id: 151, text: 'What is the purpose of the "async" keyword in JavaScript?', options: ['To handle CSS styles', 'To create a loop', 'To define an asynchronous function', 'To define a synchronous function'], correct: 'To define an asynchronous function' },
        { id: 152, text: 'Which HTTP status code indicates a successful GET request?', options: ['301', '500', '200', '404'], correct: '200' },
        { id: 153, text: 'What does the CSS property "transform: rotate(90deg)" do?', options: ['Changes element opacity', 'Scales an element by 90%', 'Rotates an element 90 degrees', 'Shifts an element 90px'], correct: 'Rotates an element 90 degrees' },
        { id: 154, text: 'What does the "await" keyword do in JavaScript?', options: ['Handles errors', 'Creates a new Promise', 'Pauses execution until a Promise resolves', 'Defines a loop'], correct: 'Pauses execution until a Promise resolves' },
        { id: 155, text: 'Which method is used to handle HTTP requests in modern JavaScript?', options: ['http', 'ajax', 'fetch', 'XMLHttpRequest'], correct: 'fetch' },
        { id: 156, text: 'What does the CSS "grid-gap" property do?', options: ['Sets grid rows', 'Aligns grid items', 'Sets the gap between grid items', 'Defines grid columns'], correct: 'Sets the gap between grid items' },
        { id: 157, text: 'Which JavaScript method creates a new Promise?', options: ['Promise.new', 'createPromise', 'new Promise', 'Promise'], correct: 'new Promise' },
        { id: 158, text: 'What does the CSS "@media" rule do?', options: ['Imports fonts', 'Sets global styles', 'Applies styles based on media queries', 'Defines animations'], correct: 'Applies styles based on media queries' },
        { id: 159, text: 'Which HTML tag is used for semantic sectioning?', options: ['<block>', '<span>', '<section>', '<div>'], correct: '<section>' },
        { id: 160, text: 'What does the JavaScript "Promise.all" method do?', options: ['Delays Promise resolution', 'Creates a new Promise', 'Resolves multiple Promises concurrently', 'Rejects all Promises'], correct: 'Resolves multiple Promises concurrently' },
        { id: 161, text: 'What does the CSS "clip-path" property do?', options: ['Scales an element', 'Rotates an element', 'Clips an element to a specific shape', 'Hides an element'], correct: 'Clips an element to a specific shape' },
        { id: 162, text: 'Which JavaScript method stops event propagation?', options: ['cancelEvent()', 'stopEvent()', 'stopPropagation()', 'preventDefault()'], correct: 'stopPropagation()' },
        { id: 163, text: 'What does the CSS "object-fit" property do?', options: ['Changes opacity', 'Aligns text', 'Controls how an image fits in its container', 'Sets object position'], correct: 'Controls how an image fits in its container' },
        { id: 164, text: 'Which HTML tag is used for semantic navigation?', options: ['<footer>', '<header>', '<nav>', '<menu>'], correct: '<nav>' },
        { id: 165, text: 'What does the JavaScript "Promise.reject" method do?', options: ['Delays a Promise', 'Creates a new Promise', 'Rejects a Promise', 'Resolves a Promise'], correct: 'Rejects a Promise' },
        { id: 166, text: 'What does the CSS "backdrop-filter" property do?', options: ['Aligns text', 'Hides an element', 'Applies a filter to the background', 'Sets background color'], correct: 'Applies a filter to the background' },
        { id: 167, text: 'Which JavaScript method prevents the default behavior of an event?', options: ['stopDefault()', 'cancelEvent()', 'preventDefault()', 'stopPropagation()'], correct: 'preventDefault()' },
        { id: 168, text: 'What does the CSS "will-change" property do?', options: ['Aligns text', 'Sets element opacity', 'Hints at future changes for optimization', 'Changes element position'], correct: 'Hints at future changes for optimization' },
        { id: 169, text: 'Which HTML tag is used for semantic articles?', options: ['<content>', '<div>', '<article>', '<section>'], correct: '<article>' },
        { id: 170, text: 'What does the JavaScript "Promise.resolve" method do?', options: ['Delays a Promise', 'Creates a new Promise', 'Resolves a Promise', 'Rejects a Promise'], correct: 'Resolves a Promise' },
        { id: 171, text: 'What does the CSS "pointer-events" property do?', options: ['Aligns text', 'Hides an element', 'Controls mouse events on an element', 'Sets cursor style'], correct: 'Controls mouse events on an element' },
        { id: 172, text: 'Which JavaScript method checks if an array includes a value?', options: ['find()', 'has()', 'includes()', 'contains()'], correct: 'includes()' },
        { id: 173, text: 'What does the CSS "aspect-ratio" property do?', options: ['Hides an element', 'Rotates an element', 'Sets the aspect ratio of an element', 'Sets element size'], correct: 'Sets the aspect ratio of an element' },
        { id: 174, text: 'Which HTML tag is used for semantic footers?', options: ['<section>', '<end>', '<footer>', '<bottom>'], correct: '<footer>' },
        { id: 175, text: 'What does the JavaScript "Array.from" method do?', options: ['Sorts an array', 'Reverses an array', 'Creates an array from an iterable', 'Removes elements from an array'], correct: 'Creates an array from an iterable' },
        { id: 176, text: 'What does the CSS "mix-blend-mode" property do?', options: ['Aligns text', 'Hides an element', 'Blends an element with its background', 'Sets element opacity'], correct: 'Blends an element with its background' },
        { id: 177, text: 'Which JavaScript method sorts an array?', options: ['sortBy()', 'arrange()', 'sort()', 'order()'], correct: 'sort()' },
        { id: 178, text: 'What does the CSS "writing-mode" property do?', options: ['Aligns text', 'Hides an element', 'Changes the direction of text', 'Sets text color'], correct: 'Changes the direction of text' },
        { id: 179, text: 'Which HTML tag is used for semantic headers?', options: ['<h1>', '<top>', '<header>', '<head>'], correct: '<header>' },
        { id: 180, text: 'What does the JavaScript "Object.keys" method do?', options: ['Deletes an object', 'Creates a new object', 'Returns an array of object keys', 'Returns an array of object values'], correct: 'Returns an array of object keys' },
      ],
    },
    data_analysis: {
      beginner: [
        { id: 181, text: 'What does the SUM function do in Excel?', options: ['Sorts data', 'Averages numbers', 'Adds a range of numbers', 'Counts rows'], correct: 'Adds a range of numbers' },
        { id: 182, text: 'Which data type is used to store dates in SQL?', options: ['TEXT', 'INT', 'DATE', 'VARCHAR'], correct: 'DATE' },
        { id: 183, text: 'What is the purpose of a pivot table in Excel?', options: ['To delete rows', 'To create charts', 'To summarize data', 'To write formulas'], correct: 'To summarize data' },
        { id: 184, text: 'What does the COUNT function do in Excel?', options: ['Sorts data', 'Averages numbers', 'Counts non-empty cells', 'Sums numbers'], correct: 'Counts non-empty cells' },
        { id: 185, text: 'Which SQL keyword retrieves data from a table?', options: ['DELETE', 'SELECT', 'UPDATE', 'INSERT'], correct: 'SELECT' },
        { id: 186, text: 'What does the AVERAGE function do in Excel?', options: ['Finds the maximum', 'Counts cells', 'Calculates the mean of numbers', 'Sums numbers'], correct: 'Calculates the mean of numbers' },
        { id: 187, text: 'Which SQL clause filters rows?', options: ['GROUP BY', 'ORDER BY', 'WHERE', 'SELECT'], correct: 'WHERE' },
        { id: 188, text: 'What does the MAX function do in Excel?', options: ['Averages values', 'Sums values', 'Finds the largest value', 'Finds the smallest value'], correct: 'Finds the largest value' },
        { id: 189, text: 'Which SQL keyword inserts data into a table?', options: ['DELETE', 'SELECT', 'INSERT', 'UPDATE'], correct: 'INSERT' },
        { id: 190, text: 'What does the MIN function do in Excel?', options: ['Averages values', 'Sums values', 'Finds the smallest value', 'Finds the largest value'], correct: 'Finds the smallest value' },
        { id: 191, text: 'Which SQL keyword updates data in a table?', options: ['DELETE', 'SELECT', 'UPDATE', 'INSERT'], correct: 'UPDATE' },
        { id: 192, text: 'What does the ROUND function do in Excel?', options: ['Finds the maximum', 'Counts cells', 'Rounds a number to a specified decimal', 'Sums numbers'], correct: 'Rounds a number to a specified decimal' },
        { id: 193, text: 'Which SQL keyword deletes data from a table?', options: ['TRUNCATE', 'REMOVE', 'DELETE', 'DROP'], correct: 'DELETE' },
        { id: 194, text: 'What does the IF function do in Excel?', options: ['Sorts data', 'Counts cells', 'Performs conditional logic', 'Sums numbers'], correct: 'Performs conditional logic' },
        { id: 195, text: 'Which SQL clause specifies the columns to retrieve?', options: ['ORDER BY', 'FROM', 'SELECT', 'WHERE'], correct: 'SELECT' },
        { id: 196, text: 'What does the CONCAT function do in Excel?', options: ['Sorts text', 'Counts characters', 'Combines text from multiple cells', 'Splits text'], correct: 'Combines text from multiple cells' },
        { id: 197, text: 'Which SQL keyword specifies the table to query?', options: ['GROUP BY', 'SELECT', 'FROM', 'WHERE'], correct: 'FROM' },
        { id: 198, text: 'What does the LEN function do in Excel?', options: ['Averages numbers', 'Finds the maximum', 'Counts characters in a cell', 'Sums numbers'], correct: 'Counts characters in a cell' },
        { id: 199, text: 'Which SQL keyword sorts the result set?', options: ['WHERE', 'GROUP BY', 'ORDER BY', 'SORT BY'], correct: 'ORDER BY' },
        { id: 200, text: 'What does the LEFT function do in Excel?', options: ['Counts characters', 'Combines strings', 'Extracts characters from the left of a string', 'Extracts characters from the right'], correct: 'Extracts characters from the left of a string' },
        { id: 201, text: 'Which SQL keyword limits the number of rows returned?', options: ['Both LIMIT and TOP', 'ROWNUM', 'TOP', 'LIMIT'], correct: 'Both LIMIT and TOP' },
        { id: 202, text: 'What does the RIGHT function do in Excel?', options: ['Counts characters', 'Combines strings', 'Extracts characters from the right of a string', 'Extracts characters from the left'], correct: 'Extracts characters from the right of a string' },
        { id: 203, text: 'Which SQL keyword removes a table?', options: ['REMOVE', 'TRUNCATE', 'DROP', 'DELETE'], correct: 'DROP' },
        { id: 204, text: 'What does the TODAY function do in Excel?', options: ['Counts days', 'Sums dates', 'Returns the current date', 'Returns the current time'], correct: 'Returns the current date' },
        { id: 205, text: 'Which SQL keyword creates a new table?', options: ['ADD TABLE', 'MAKE TABLE', 'CREATE TABLE', 'NEW TABLE'], correct: 'CREATE TABLE' },
        { id: 206, text: 'What does the NOW function do in Excel?', options: ['Counts days', 'Returns the current time', 'Returns the current date and time', 'Returns the current date'], correct: 'Returns the current date and time' },
        { id: 207, text: 'Which SQL keyword adds a new column to a table?', options: ['UPDATE TABLE', 'MODIFY TABLE', 'ALTER TABLE', 'ADD COLUMN'], correct: 'ALTER TABLE' },
        { id: 208, text: 'What does the TRIM function do in Excel?', options: ['Extracts text', 'Counts characters', 'Removes leading and trailing spaces', 'Combines strings'], correct: 'Removes leading and trailing spaces' },
        { id: 209, text: 'Which SQL keyword specifies a condition for groups?', options: ['ORDER BY', 'GROUP BY', 'HAVING', 'WHERE'], correct: 'HAVING' },
        { id: 210, text: 'What does the UPPER function do in Excel?', options: ['Counts characters', 'Combines strings', 'Converts text to uppercase', 'Converts text to lowercase'], correct: 'Converts text to uppercase' }
      ],
      intermediate: [
        { id: 211, text: 'What does the VLOOKUP function do in Excel?', options: ['Creates a vertical chart', 'Validates data', 'Looks up a value vertically in a range', 'Calculates variance'], correct: 'Looks up a value vertically in a range' },
        { id: 212, text: 'Which SQL clause is used to sort results?', options: ['HAVING', 'GROUP BY', 'ORDER BY', 'WHERE'], correct: 'ORDER BY' },
        { id: 213, text: 'What does df.describe() do in Pandas?', options: ['Merges dataframes', 'Sorts the dataframe', 'Generates descriptive statistics', 'Filters data'], correct: 'Generates descriptive statistics' },
        { id: 214, text: 'What does the SQL GROUP BY clause do?', options: ['Joins tables', 'Filters rows', 'Groups rows with the same values', 'Sorts data'], correct: 'Groups rows with the same values' },
        { id: 215, text: 'Which Excel function finds the largest value in a range?', options: ['LARGE', 'AVERAGE', 'MAX', 'MIN'], correct: 'MAX' },
        { id: 216, text: 'What does the HLOOKUP function do in Excel?', options: ['Averages values', 'Sums values', 'Looks up a value horizontally in a range', 'Looks up a value vertically'], correct: 'Looks up a value horizontally in a range' },
        { id: 217, text: 'Which SQL function counts the number of rows?', options: ['MAX()', 'AVG()', 'COUNT()', 'SUM()'], correct: 'COUNT()' },
        { id: 218, text: 'What does df.head() do in Pandas?', options: ['Filters the dataframe', 'Sorts the dataframe', 'Displays the first few rows', 'Displays the last few rows'], correct: 'Displays the first few rows' },
        { id: 219, text: 'What does the SQL HAVING clause do?', options: ['Joins tables', 'Sorts data', 'Filters groups after GROUP BY', 'Filters rows before grouping'], correct: 'Filters groups after GROUP BY' },
        { id: 220, text: 'Which Excel function counts cells that meet a condition?', options: ['AVERAGEIF', 'SUMIF', 'COUNTIF', 'COUNT'], correct: 'COUNTIF' },
        { id: 221, text: 'Which SQL function calculates the average of a column?', options: ['MAX()', 'COUNT()', 'AVG()', 'SUM()'], correct: 'AVG()' },
        { id: 222, text: 'What does df.tail() do in Pandas?', options: ['Filters the dataframe', 'Sorts the dataframe', 'Displays the last few rows', 'Displays the first few rows'], correct: 'Displays the last few rows' },
        { id: 223, text: 'Which SQL function finds the maximum value in a column?', options: ['SUM()', 'AVG()', 'MAX()', 'MIN()'], correct: 'MAX()' },
        { id: 224, text: 'What does the SUMIF function do in Excel?', options: ['Finds the maximum', 'Averages values', 'Sums values that meet a condition', 'Counts values'], correct: 'Sums values that meet a condition' },
        { id: 225, text: 'Which SQL function finds the minimum value in a column?', options: ['SUM()', 'AVG()', 'MIN()', 'MAX()'], correct: 'MIN()' },
        { id: 226, text: 'What does df.shape do in Pandas?', options: ['Merges dataframes', 'Filters the dataframe', 'Returns the dimensions of the dataframe', 'Sorts the dataframe'], correct: 'Returns the dimensions of the dataframe' },
        { id: 227, text: 'Which SQL clause combines rows from two tables?', options: ['ORDER BY', 'GROUP BY', 'JOIN', 'WHERE'], correct: 'JOIN' },
        { id: 228, text: 'What does the AVERAGEIF function do in Excel?', options: ['Finds the maximum', 'Counts values', 'Averages values that meet a condition', 'Sums values'], correct: 'Averages values that meet a condition' },
        { id: 229, text: 'Which SQL keyword performs a left join?', options: ['FULL JOIN', 'INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN'], correct: 'LEFT JOIN' },
        { id: 230, text: 'What does df.drop() do in Pandas?', options: ['Merges dataframes', 'Filters the dataframe', 'Removes rows or columns', 'Sorts the dataframe'], correct: 'Removes rows or columns' },
        { id: 231, text: 'Which SQL keyword performs a right join?', options: ['FULL JOIN', 'INNER JOIN', 'RIGHT JOIN', 'LEFT JOIN'], correct: 'RIGHT JOIN' },
        { id: 232, text: 'What does the INDEX function do in Excel?', options: ['Averages values', 'Counts cells', 'Returns a value at a specific position', 'Sums values'], correct: 'Returns a value at a specific position' },
        { id: 233, text: 'Which SQL keyword performs an inner join?', options: ['FULL JOIN', 'RIGHT JOIN', 'INNER JOIN', 'LEFT JOIN'], correct: 'INNER JOIN' },
        { id: 234, text: 'What does df.sort_values() do in Pandas?', options: ['Drops rows', 'Merges dataframes', 'Sorts the dataframe', 'Filters the dataframe'], correct: 'Sorts the dataframe' },
        { id: 235, text: 'Which SQL keyword performs a full join?', options: ['INNER JOIN', 'RIGHT JOIN', 'FULL JOIN', 'LEFT JOIN'], correct: 'FULL JOIN' },
        { id: 236, text: 'What does the MATCH function do in Excel?', options: ['Averages values', 'Counts cells', 'Finds the position of a value in a range', 'Sums values'], correct: 'Finds the position of a value in a range' },
        { id: 237, text: 'Which SQL function concatenates strings?', options: ['ADD()', 'MERGE()', 'CONCAT()', 'JOIN()'], correct: 'CONCAT()' },
        { id: 238, text: 'What does df.groupby() do in Pandas?', options: ['Merges dataframes', 'Filters the dataframe', 'Groups data by a column', 'Sorts the dataframe'], correct: 'Groups data by a column' },
        { id: 239, text: 'Which SQL function converts text to uppercase?', options: ['TEXTUP()', 'CAPITALIZE()', 'UPPER()', 'LOWER()'], correct: 'UPPER()' },
        { id: 240, text: 'What does the CHOOSE function do in Excel?', options: ['Averages values', 'Counts cells', 'Selects a value from a list based on an index', 'Sums values'], correct: 'Selects a value from a list based on an index' },
      ],
      advanced: [
        { id: 241, text: 'What is the purpose of the JOIN clause in SQL?', options: ['To delete tables', 'To calculate aggregates', 'To combine rows from two or more tables', 'To filter rows'], correct: 'To combine rows from two or more tables' },
        { id: 242, text: 'Which Pandas method is used to handle missing values?', options: ['df.remove()', 'df.dropna()', 'df.fillna() or df.dropna()', 'df.clean()'], correct: 'df.fillna() or df.dropna()' },
        { id: 243, text: 'What does a correlation coefficient close to 1 indicate in data analysis?', options: ['Random data', 'Weak negative relationship', 'Strong positive relationship', 'No relationship'], correct: 'Strong positive relationship' },
        { id: 244, text: 'What does the SQL HAVING clause do?', options: ['Joins tables', 'Sorts data', 'Filters groups after GROUP BY', 'Filters rows before grouping'], correct: 'Filters groups after GROUP BY' },
        { id: 245, text: 'Which Pandas method merges two dataframes?', options: ['combine()', 'join()', 'merge()', 'concat()'], correct: 'merge()' },
        { id: 246, text: 'What does the SQL WITH clause do?', options: ['Sorts data', 'Filters rows', 'Defines a temporary result set (CTE)', 'Joins tables'], correct: 'Defines a temporary result set (CTE)' },
        { id: 247, text: 'Which Pandas method pivots a dataframe?', options: ['pivot_table()', 'transpose()', 'pivot()', 'melt()'], correct: 'pivot()' },
        { id: 248, text: 'What does a correlation coefficient close to -1 indicate?', options: ['Random data', 'Strong negative relationship', 'No relationship', 'Strong positive relationship'], correct: 'Strong negative relationship' },
        { id: 249, text: 'Which SQL function calculates the standard deviation?', options: ['SUM()', 'AVG()', 'STDDEV()', 'VARIANCE()'], correct: 'STDDEV()' },
        { id: 250, text: 'What does df.pivot_table() do in Pandas?', options: ['Filters the dataframe', 'Sorts the dataframe', 'Creates a pivot table', 'Merges dataframes'], correct: 'Creates a pivot table' },
        { id: 251, text: 'Which SQL clause partitions data for window functions?', options: ['WHERE', 'ORDER BY', 'PARTITION BY', 'GROUP BY'], correct: 'PARTITION BY' },
        { id: 252, text: 'Which Pandas method calculates the correlation between columns?', options: ['describe()', 'stats()', 'corr()', 'cov()'], correct: 'corr()' },
        { id: 253, text: 'What does the SQL RANK() function do?', options: ['Joins tables', 'Filters rows', 'Assigns a rank to rows in a result set', 'Sorts data'], correct: 'Assigns a rank to rows in a result set' },
        { id: 254, text: 'Which Pandas method resamples time-series data?', options: ['sort_values()', 'groupby()', 'resample()', 'sample()'], correct: 'resample()' },
        { id: 255, text: 'What does the SQL DENSE_RANK() function do?', options: ['Filters rows', 'Sorts data', 'Assigns a rank without gaps', 'Assigns a rank with gaps'], correct: 'Assigns a rank without gaps' },
        { id: 256, text: 'Which Pandas method calculates the covariance between columns?', options: ['describe()', 'stats()', 'cov()', 'corr()'], correct: 'cov()' },
        { id: 257, text: 'What does the SQL ROW_NUMBER() function do?', options: ['Joins tables', 'Filters rows', 'Assigns a unique number to each row', 'Sorts data'], correct: 'Assigns a unique number to each row' },
        { id: 258, text: 'Which Pandas method converts a dataframe to a NumPy array?', options: ['numpy()', 'as_numpy()', 'to_numpy()', 'to_array()'], correct: 'to_numpy()' },
        { id: 259, text: 'Which SQL function calculates the variance?', options: ['SUM()', 'AVG()', 'VARIANCE()', 'STDDEV()'], correct: 'VARIANCE()' },
        { id: 260, text: 'What does df.rolling() do in Pandas?', options: ['Merges dataframes', 'Filters the dataframe', 'Applies a rolling window calculation', 'Sorts the dataframe'], correct: 'Applies a rolling window calculation' },
        { id: 261, text: 'Which SQL clause defines the order for window functions?', options: ['WHERE', 'GROUP BY', 'ORDER BY', 'PARTITION BY'], correct: 'ORDER BY' },
        { id: 262, text: 'Which Pandas method applies a function to each element?', options: ['both apply() and applymap()', 'applymap()', 'apply()', 'map()'], correct: 'both apply() and applymap()' },
        { id: 263, text: 'What does the SQL LEAD() function do?', options: ['Filters rows', 'Sorts data', 'Accesses the next row in a result set', 'Accesses the previous row'], correct: 'Accesses the next row in a result set' },
        { id: 264, text: 'Which Pandas method creates a histogram?', options: ['scatter()', 'bar()', 'hist()', 'plot()'], correct: 'hist()' },
        { id: 265, text: 'What does the SQL LAG() function do?', options: ['Filters rows', 'Sorts data', 'Accesses the previous row in a result set', 'Accesses the next row'], correct: 'Accesses the previous row in a result set' },
        { id: 266, text: 'Which Pandas method plots data?', options: ['visualize()', 'graph()', 'plot()', 'chart()'], correct: 'plot()' },
        { id: 267, text: 'Which SQL function calculates the cumulative sum?', options: ['AGGREGATE()', 'TOTAL()', 'SUM() OVER', 'CUMSUM()'], correct: 'SUM() OVER' },
        { id: 268, text: 'Which Pandas method handles categorical data?', options: ['convert_category()', 'categorical()', 'astype("category")', 'to_category()'], correct: 'astype("category")' },
        { id: 269, text: 'What does the SQL NTILE() function do?', options: ['Joins tables', 'Filters rows', 'Divides rows into buckets', 'Sorts data'], correct: 'Divides rows into buckets' },
        { id: 270, text: 'Which Pandas method converts a column to datetime?', options: ['datetime()', 'as_datetime()', 'to_datetime()', 'convert_datetime()'], correct: 'to_datetime()' },
      ],
    },
    machine_learning: {
      beginner: [
        { id: 271, text: 'What does ML stand for in the context of technology?', options: ['Machine Language', 'Multi-Level', 'Machine Learning', 'Manual Learning'], correct: 'Machine Learning' },
        { id: 272, text: 'Which Python library is commonly used for machine learning?', options: ['numpy', 'matplotlib', 'scikit-learn', 'pandas'], correct: 'scikit-learn' },
        { id: 273, text: 'What is the primary goal of supervised learning?', options: ['To explore data', 'To reduce dimensions', 'To predict outcomes', 'To cluster data'], correct: 'To predict outcomes' },
        { id: 274, text: 'What is an example of a supervised learning task?', options: ['Dimensionality reduction', 'Association', 'Classification', 'Clustering'], correct: 'Classification' },
        { id: 275, text: 'What is the purpose of a training dataset?', options: ['To deploy the model', 'To validate the model', 'To train the model', 'To test the model'], correct: 'To train the model' },
        { id: 276, text: 'What does overfitting mean in machine learning?', options: ['Model fails to train', 'Model performs well on both training and test data', 'Model performs well on training data but poorly on test data', 'Model performs poorly on both training and test data'], correct: 'Model performs well on training data but poorly on test data' },
        { id: 277, text: 'What is the purpose of a test dataset?', options: ['To visualize the data', 'To preprocess the data', 'To evaluate the model', 'To train the model'], correct: 'To evaluate the model' },
        { id: 278, text: 'Which algorithm is used for linear regression?', options: ['K-Nearest Neighbors', 'Decision Tree', 'Linear Regression', 'K-Means'], correct: 'Linear Regression' },
        { id: 279, text: 'What is the purpose of a feature in machine learning?', options: ['A loss function', 'A hyperparameter', 'An input variable used by the model', 'The output of the model'], correct: 'An input variable used by the model' },
        { id: 280, text: 'What does unsupervised learning aim to do?', options: ['Optimize a function', 'Classify data', 'Find patterns in data', 'Predict outcomes'], correct: 'Find patterns in data' },
        { id: 281, text: 'What is an example of an unsupervised learning task?', options: ['Prediction', 'Regression', 'Clustering', 'Classification'], correct: 'Clustering' },
        { id: 282, text: 'Which Python library is used for numerical computations in ML?', options: ['pandas', 'matplotlib', 'numpy', 'scikit-learn'], correct: 'numpy' },
        { id: 283, text: 'What is a label in supervised learning?', options: ['A clustering result', 'A hyperparameter', 'The target variable to predict', 'An input feature'], correct: 'The target variable to predict' },
        { id: 284, text: 'What does the term "bias" refer to in machine learning?', options: ['The complexity of the model', 'The accuracy of the model', 'The error due to overly simplistic assumptions', 'The error due to variance'], correct: 'The error due to overly simplistic assumptions' },
        { id: 285, text: 'What is the purpose of data preprocessing in ML?', options: ['To visualize the data', 'To evaluate the model', 'To clean and prepare data for modeling', 'To deploy the model'], correct: 'To clean and prepare data for modeling' },
        { id: 286, text: 'Which algorithm is commonly used for classification?', options: ['Linear Regression', 'PCA', 'Logistic Regression', 'K-Means'], correct: 'Logistic Regression' },
        { id: 287, text: 'What is a hyperparameter in machine learning?', options: ['An output label', 'An input feature', 'A parameter set before training', 'A parameter learned during training'], correct: 'A parameter set before training' },
        { id: 288, text: 'What does the term "variance" refer to in machine learning?', options: ['The simplicity of the model', 'The accuracy of the model', 'The error due to sensitivity to small fluctuations', 'The error due to bias'], correct: 'The error due to sensitivity to small fluctuations' },
        { id: 289, text: 'What is the purpose of a validation dataset?', options: ['To deploy the model', 'To test the model', 'To tune the model', 'To train the model'], correct: 'To tune the model' },
        { id: 290, text: 'Which Python library is used for data manipulation in ML?', options: ['numpy', 'matplotlib', 'pandas', 'scikit-learn'], correct: 'pandas' },
        { id: 291, text: 'What is the output of a regression task?', options: ['A reduced dimension', 'A cluster', 'A continuous value', 'A class label'], correct: 'A continuous value' },
        { id: 292, text: 'What is the output of a classification task?', options: ['A reduced dimension', 'A cluster', 'A class label', 'A continuous value'], correct: 'A class label' },
        { id: 293, text: 'What does the term "model" refer to in machine learning?', options: ['A visualization tool', 'A programming language', 'A mathematical representation of data', 'A dataset'], correct: 'A mathematical representation of data' },
        { id: 294, text: 'What is the purpose of feature scaling?', options: ['To predict outcomes', 'To cluster data', 'To normalize feature values', 'To reduce dimensions'], correct: 'To normalize feature values' },
        { id: 295, text: 'Which algorithm is used for clustering?', options: ['Linear Regression', 'Decision Tree', 'K-Means', 'Logistic Regression'], correct: 'K-Means' },
        { id: 296, text: 'What is the purpose of a loss function in ML?', options: ['To deploy the model', 'To visualize data', 'To measure model error', 'To preprocess data'], correct: 'To measure model error' },
        { id: 297, text: 'What does the term "epoch" refer to in machine learning?', options: ['A hyperparameter', 'A clustering result', 'One complete pass through the training data', 'A single prediction'], correct: 'One complete pass through the training data' },
        { id: 298, text: 'What is the purpose of splitting data into train and test sets?', options: ['To deploy the model', 'To visualize data', 'To evaluate model performance', 'To preprocess data'], correct: 'To evaluate model performance' },
        { id: 299, text: 'Which Python library is used for data visualization in ML?', options: ['numpy', 'pandas', 'matplotlib', 'scikit-learn'], correct: 'matplotlib' },
        { id: 300, text: 'What is the goal of regression in machine learning?', options: ['To reduce dimensions', 'To cluster data', 'To predict a continuous value', 'To classify data'], correct: 'To predict a continuous value' },
      ],
      intermediate: [
        { id: 301, text: 'What is the purpose of cross-validation in machine learning?', options: ['To deploy the model', 'To visualize data', 'To assess model performance', 'To preprocess data'], correct: 'To assess model performance' },
        { id: 302, text: 'Which algorithm is used for decision tree classification?', options: ['PCA', 'Linear Regression', 'Decision Tree', 'K-Means'], correct: 'Decision Tree' },
        { id: 303, text: 'What does the confusion matrix show in classification?', options: ['Feature importance', 'Variance and bias', 'True positives, false positives, true negatives, false negatives', 'Mean squared error'], correct: 'True positives, false positives, true negatives, false negatives' },
        { id: 304, text: 'What is the purpose of the train_test_split function in scikit-learn?', options: ['To deploy the model', 'To visualize data', 'To split data into training and testing sets', 'To preprocess data'], correct: 'To split data into training and testing sets' },
        { id: 305, text: 'Which metric is used to evaluate a classification model?', options: ['Silhouette Score', 'R-squared', 'Accuracy', 'Mean Squared Error'], correct: 'Accuracy' },
        { id: 306, text: 'What does the term "gradient descent" refer to in ML?', options: ['A preprocessing step', 'A classification algorithm', 'An optimization algorithm', 'A clustering algorithm'], correct: 'An optimization algorithm' },
        { id: 307, text: 'Which algorithm is used for support vector machines?', options: ['Linear Regression', 'Decision Tree', 'SVM', 'K-Means'], correct: 'SVM' },
        { id: 308, text: 'What does the term "precision" mean in classification?', options: ['The error rate', 'The overall accuracy', 'The ratio of true positives to all predicted positives', 'The ratio of true positives to all actual positives'], correct: 'The ratio of true positives to all predicted positives' },
        { id: 309, text: 'What does the term "recall" mean in classification?', options: ['The error rate', 'The overall accuracy', 'The ratio of true positives to all actual positives', 'The ratio of true positives to all predicted positives'], correct: 'The ratio of true positives to all actual positives' },
        { id: 310, text: 'What does the F1-score measure in classification?', options: ['The variance', 'The error rate', 'The harmonic mean of precision and recall', 'The overall accuracy'], correct: 'The harmonic mean of precision and recall' },
        { id: 311, text: 'What is the purpose of feature selection in ML?', options: ['To predict outcomes', 'To cluster data', 'To reduce the number of features', 'To increase model complexity'], correct: 'To reduce the number of features' },
        { id: 312, text: 'Which algorithm is used for K-nearest neighbors?', options: ['Decision Tree', 'SVM', 'KNN', 'K-Means'], correct: 'KNN' },
        { id: 313, text: 'What does the term "dimensionality reduction" refer to?', options: ['Predicting outcomes', 'Clustering data', 'Reducing the number of features', 'Increasing the number of features'], correct: 'Reducing the number of features' },
        { id: 314, text: 'Which technique is used for dimensionality reduction?', options: ['Decision Tree', 'SVM', 'PCA', 'K-Means'], correct: 'PCA' },
        { id: 315, text: 'What does the term "regularization" mean in ML?', options: ['Predicting outcomes', 'Clustering data', 'Adding a penalty to prevent overfitting', 'Increasing model complexity'], correct: 'Adding a penalty to prevent overfitting' },
        { id: 316, text: 'Which regularization technique adds an L1 penalty?', options: ['Dropout', 'Elastic Net', 'Lasso', 'Ridge'], correct: 'Lasso' },
        { id: 317, text: 'Which regularization technique adds an L2 penalty?', options: ['Dropout', 'Elastic Net', 'Ridge', 'Lasso'], correct: 'Ridge' },
        { id: 318, text: 'What does the term "bagging" refer to in ML?', options: ['Clustering', 'Stacking', 'Bootstrap aggregating', 'Boosting'], correct: 'Bootstrap aggregating' },
        { id: 319, text: 'Which algorithm uses bagging?', options: ['SVM', 'AdaBoost', 'Random Forest', 'Gradient Boosting'], correct: 'Random Forest' },
        { id: 320, text: 'What does the term "boosting" refer to in ML?', options: ['Predicting outcomes', 'Clustering data', 'Improving model performance by combining weak learners', 'Reducing dimensions'], correct: 'Improving model performance by combining weak learners' },
        { id: 321, text: 'Which algorithm uses boosting?', options: ['PCA', 'K-Means', 'Gradient Boosting', 'Random Forest'], correct: 'Gradient Boosting' },
        { id: 322, text: 'What is the purpose of the GridSearchCV in scikit-learn?', options: ['To deploy the model', 'To visualize data', 'To perform hyperparameter tuning', 'To preprocess data'], correct: 'To perform hyperparameter tuning' },
        { id: 323, text: 'What does the term "imbalanced dataset" mean?', options: ['A dataset with outliers', 'A dataset with high variance', 'A dataset with unequal class distribution', 'A dataset with missing values'], correct: 'A dataset with unequal class distribution' },
        { id: 324, text: 'Which technique handles imbalanced datasets?', options: ['SVM', 'K-Means', 'SMOTE', 'PCA'], correct: 'SMOTE' },
        { id: 325, text: 'What does the term "pipeline" mean in scikit-learn?', options: ['A deployment method', 'A visualization tool', 'A sequence of data processing steps', 'A clustering algorithm'], correct: 'A sequence of data processing steps' },
        { id: 326, text: 'Which metric evaluates a regression model?', options: ['Silhouette Score', 'F1-score', 'Mean Squared Error', 'Accuracy'], correct: 'Mean Squared Error' },
        { id: 327, text: 'What does the R-squared metric measure in regression?', options: ['The F1-score', 'The accuracy', 'The proportion of variance explained', 'The error rate'], correct: 'The proportion of variance explained' },
        { id: 328, text: 'What does the term "ensemble learning" mean?', options: ['Predicting outcomes', 'Clustering data', 'Combining multiple models to improve performance', 'Reducing dimensions'], correct: 'Combining multiple models to improve performance' },
        { id: 329, text: 'Which Python library is used for deep learning?', options: ['matplotlib', 'pandas', 'TensorFlow', 'scikit-learn'], correct: 'TensorFlow' },
        { id: 330, text: 'What does the term "one-hot encoding" mean?', options: ['Clustering data', 'Reducing dimensions', 'Converting categorical variables to binary vectors', 'Normalizing numerical data'], correct: 'Converting categorical variables to binary vectors' },
      ],
      advanced: [
        { id: 331, text: 'What does the term "backpropagation" refer to in deep learning?', options: ['A deployment method', 'A preprocessing step', 'The process of updating weights using gradients', 'A clustering algorithm'], correct: 'The process of updating weights using gradients' },
        { id: 332, text: 'Which activation function is commonly used in hidden layers?', options: ['Softmax', 'Tanh', 'ReLU', 'Sigmoid'], correct: 'ReLU' },
        { id: 333, text: 'What does the term "dropout" refer to in deep learning?', options: ['A deployment method', 'A preprocessing step', 'A regularization technique to prevent overfitting', 'A clustering algorithm'], correct: 'A regularization technique to prevent overfitting' },
        { id: 334, text: 'Which algorithm is used for natural language processing?', options: ['PCA', 'SVM', 'LSTM', 'K-Means'], correct: 'LSTM' },
        { id: 335, text: 'What does the term "convolutional neural network" refer to?', options: ['A deployment method', 'A preprocessing step', 'A neural network for image processing', 'A clustering algorithm'], correct: 'A neural network for image processing' },
        { id: 336, text: 'What is the purpose of a validation set in deep learning?', options: ['To deploy the model', 'To test the model', 'To tune hyperparameters', 'To train the model'], correct: 'To tune hyperparameters' },
        { id: 337, text: 'Which Python library is used for building neural networks?', options: ['matplotlib', 'pandas', 'Keras', 'scikit-learn'], correct: 'Keras' },
        { id: 338, text: 'What does the term "gradient vanishing" mean?', options: ['A preprocessing error', 'A clustering issue', 'Gradients becoming too small during backpropagation', 'Gradients becoming too large'], correct: 'Gradients becoming too small during backpropagation' },
        { id: 339, text: 'Which technique mitigates gradient vanishing?', options: ['Reducing the learning rate', 'Increasing model complexity', 'Using ReLU activation', 'Using Sigmoid activation'], correct: 'Using ReLU activation' },
        { id: 340, text: 'What does the term "transfer learning" mean?', options: ['Preprocessing data', 'Clustering data', 'Using a pre-trained model for a new task', 'Training a model from scratch'], correct: 'Using a pre-trained model for a new task' },
        { id: 341, text: 'Which pre-trained model is commonly used for image classification?', options: ['PCA', 'SVM', 'VGG16', 'K-Means'], correct: 'VGG16' },
        { id: 342, text: 'What does the term "batch normalization" mean?', options: ['Preprocessing data', 'Clustering data', 'Normalizing inputs of each layer', 'Normalizing the entire dataset'], correct: 'Normalizing inputs of each layer' },
        { id: 343, text: 'Which algorithm is used for reinforcement learning?', options: ['PCA', 'SVM', 'Q-Learning', 'K-Means'], correct: 'Q-Learning' },
        { id: 344, text: 'What does the term "exploration vs exploitation" mean in reinforcement learning?', options: ['Predicting outcomes', 'Preprocessing data', 'Balancing trying new actions vs using known actions', 'Clustering data'], correct: 'Balancing trying new actions vs using known actions' },
        { id: 345, text: 'Which technique is used for word embeddings in NLP?', options: ['PCA', 'SVM', 'Word2Vec', 'K-Means'], correct: 'Word2Vec' },
        { id: 346, text: 'What does the term "attention mechanism" mean in NLP?', options: ['Predicting outcomes', 'Preprocessing data', 'Focusing on important parts of the input', 'Clustering data'], correct: 'Focusing on important parts of the input' },
        { id: 347, text: 'Which model is commonly used for sequence-to-sequence tasks?', options: ['PCA', 'SVM', 'Transformer', 'K-Means'], correct: 'Transformer' },
        { id: 348, text: 'What does the term "GAN" stand for?', options: ['Grouped Analysis Network', 'Generalized Autoencoder Network', 'Generative Adversarial Network', 'Gradient Aggregation Network'], correct: 'Generative Adversarial Network' },
        { id: 349, text: 'What is the purpose of the generator in a GAN?', options: ['To preprocess data', 'To cluster data', 'To generate synthetic data', 'To classify data'], correct: 'To generate synthetic data' },
        { id: 350, text: 'What is the purpose of the discriminator in a GAN?', options: ['To preprocess data', 'To cluster data', 'To distinguish real data from fake', 'To generate synthetic data'], correct: 'To distinguish real data from fake' },
        { id: 351, text: 'What does the term "autoencoder" refer to?', options: ['A deployment method', 'A preprocessing step', 'A neural network for unsupervised learning', 'A clustering algorithm'], correct: 'A neural network for unsupervised learning' },
        { id: 352, text: 'What is the purpose of an autoencoder?', options: ['Regression', 'Clustering', 'Dimensionality reduction or data compression', 'Classification'], correct: 'Dimensionality reduction or data compression' },
        { id: 353, text: 'Which technique is used for anomaly detection?', options: ['PCA', 'SVM', 'Isolation Forest', 'K-Means'], correct: 'Isolation Forest' },
        { id: 354, text: 'What does the term "learning rate" mean in deep learning?', options: ['The rate of prediction', 'The rate of clustering', 'The step size for weight updates', 'The speed of data preprocessing'], correct: 'The step size for weight updates' },
        { id: 355, text: 'Which optimizer is commonly used in deep learning?', options: ['PCA', 'SVM', 'Adam', 'K-Means'], correct: 'Adam' },
        { id: 356, text: 'What does the term "early stopping" mean?', options: ['Preprocessing data', 'Clustering data', 'Stopping training when performance stops improving', 'Stopping training after one epoch'], correct: 'Stopping training when performance stops improving' },
        { id: 357, text: 'Which technique is used for data augmentation?', options: ['PCA', 'SVM', 'Image rotation, flipping, scaling', 'K-Means'], correct: 'Image rotation, flipping, scaling' },
        { id: 358, text: 'What does the term "fine-tuning" mean in transfer learning?', options: ['Preprocessing data', 'Clustering data', 'Adjusting a pre-trained model for a specific task', 'Training a model from scratch'], correct: 'Adjusting a pre-trained model for a specific task' },
        { id: 359, text: 'Which model is commonly used for object detection?', options: ['PCA', 'SVM', 'YOLO', 'K-Means'], correct: 'YOLO' },
        { id: 360, text: 'What does the term "self-supervised learning" mean?', options: ['Preprocessing data', 'Clustering data', 'Learning from unlabeled data with generated labels', 'Learning from labeled data'], correct: 'Learning from unlabeled data with generated labels' },
      ],
    },
    cybersecurity: {
      beginner: [
        { id: 361, text: 'What does the term "firewall" refer to in cybersecurity?', options: ['A password generator', 'A type of malware', 'A network security device', 'A barrier to prevent fires'], correct: 'A network security device' },
        { id: 362, text: 'What is the purpose of a password?', options: ['To hack systems', 'To create malware', 'To authenticate users', 'To encrypt data'], correct: 'To authenticate users' },
        { id: 363, text: 'What does the term "phishing" mean?', options: ['A firewall setting', 'A network protocol', 'A type of cyberattack using fraudulent emails', 'A type of encryption'], correct: 'A type of cyberattack using fraudulent emails' },
        { id: 364, text: 'What is the purpose of antivirus software?', options: ['To manage passwords', 'To create backups', 'To detect and remove malware', 'To encrypt data'], correct: 'To detect and remove malware' },
        { id: 365, text: 'What does the term "encryption" mean?', options: ['Creating malware', 'Sharing data publicly', 'Converting data into a secure format', 'Deleting data'], correct: 'Converting data into a secure format' },
        { id: 366, text: 'What is a common example of a strong password?', options: ['admin', 'password', 'P@ssw0rd123!', '123456'], correct: 'P@ssw0rd123!' },
        { id: 367, text: 'What does the term "malware" stand for?', options: ['Mainframe Logic', 'Multiple Access', 'Malicious Software', 'Managed Learning'], correct: 'Malicious Software' },
        { id: 368, text: 'What is the purpose of a VPN?', options: ['To manage passwords', 'To hack systems', 'To create a secure connection over the internet', 'To create malware'], correct: 'To create a secure connection over the internet' },
        { id: 369, text: 'What does the term "DDoS" stand for?', options: ['Data Distribution Service', 'Dynamic Defense System', 'Distributed Denial of Service', 'Direct Data Service'], correct: 'Distributed Denial of Service' },
        { id: 370, text: 'What is the goal of a DDoS attack?', options: ['To manage passwords', 'To create backups', 'To overwhelm a system with traffic', 'To encrypt data'], correct: 'To overwhelm a system with traffic' },
        { id: 371, text: 'What does the term "two-factor authentication" mean?', options: ['Hacking two systems', 'Creating two backups', 'Using two methods to verify identity', 'Encrypting data twice'], correct: 'Using two methods to verify identity' },
        { id: 372, text: 'What is an example of two-factor authentication?', options: ['Email and phone number', 'Password and username', 'Password and SMS code', 'Username and email'], correct: 'Password and SMS code' },
        { id: 373, text: 'What does the term "virus" refer to in cybersecurity?', options: ['A password generator', 'A firewall setting', 'A type of malware that spreads', 'A network protocol'], correct: 'A type of malware that spreads' },
        { id: 374, text: 'What is the purpose of a security patch?', options: ['To hack systems', 'To encrypt data', 'To fix vulnerabilities in software', 'To create malware'], correct: 'To fix vulnerabilities in software' },
        { id: 375, text: 'What does the term "social engineering" mean?', options: ['Creating malware', 'Encrypting data', 'Manipulating people to gain information', 'Building social networks'], correct: 'Manipulating people to gain information' },
        { id: 376, text: 'What is an example of social engineering?', options: ['Managing passwords', 'Creating a firewall', 'Pretending to be a tech support agent', 'Encrypting data'], correct: 'Pretending to be a tech support agent' },
        { id: 377, text: 'What does the term "HTTPS" stand for?', options: ['Host Transmission Protocol', 'HyperText Testing Protocol', 'HyperText Transfer Protocol Secure', 'High Transfer Protocol System'], correct: 'HyperText Transfer Protocol Secure' },
        { id: 378, text: 'What does HTTPS ensure?', options: ['Malware creation', 'Data deletion', 'Secure data transfer', 'Unsecure data transfer'], correct: 'Secure data transfer' },
        { id: 379, text: 'What is the purpose of a backup?', options: ['To hack systems', 'To encrypt data', 'To recover data after loss', 'To create malware'], correct: 'To recover data after loss' },
        { id: 380, text: 'What does the term "ransomware" mean?', options: ['A password generator', 'A network protocol', 'Malware that locks data until a ransom is paid', 'A type of firewall'], correct: 'Malware that locks data until a ransom is paid' },
        { id: 381, text: 'What is the purpose of access control?', options: ['To hack systems', 'To encrypt data', 'To restrict access to authorized users', 'To create malware'], correct: 'To restrict access to authorized users' },
        { id: 382, text: 'What does the term "spyware" mean?', options: ['A password generator', 'A network protocol', 'Malware that spies on user activities', 'A type of firewall'], correct: 'Malware that spies on user activities' },
        { id: 383, text: 'What is the purpose of a security policy?', options: ['To hack systems', 'To encrypt data', 'To define rules for protecting data', 'To create malware'], correct: 'To define rules for protecting data' },
        { id: 384, text: 'What does the term "worm" refer to in cybersecurity?', options: ['A password generator', 'A firewall setting', 'A type of malware that self-replicates', 'A network protocol'], correct: 'A type of malware that self-replicates' },
        { id: 385, text: 'What is the purpose of a secure password manager?', options: ['To hack systems', 'To encrypt data', 'To store and generate secure passwords', 'To create malware'], correct: 'To store and generate secure passwords' },
        { id: 386, text: 'What does the term "brute force attack" mean?', options: ['Managing passwords', 'Creating a firewall', 'Trying all possible password combinations', 'Encrypting data'], correct: 'Trying all possible password combinations' },
        { id: 387, text: 'What is the purpose of a CAPTCHA?', options: ['To hack systems', 'To encrypt data', 'To verify that a user is not a bot', 'To create malware'], correct: 'To verify that a user is not a bot' },
        { id: 388, text: 'What does the term "trojan" mean in cybersecurity?', options: ['A password generator', 'A firewall setting', 'Malware disguised as legitimate software', 'A network protocol'], correct: 'Malware disguised as legitimate software' },
        { id: 389, text: 'What is the purpose of network monitoring?', options: ['To hack systems', 'To encrypt data', 'To detect suspicious activity', 'To create malware'], correct: 'To detect suspicious activity' },
        { id: 390, text: 'What does the term "data breach" mean?', options: ['Managing passwords', 'Creating a firewall', 'Unauthorized access to sensitive data', 'Encrypting data'], correct: 'Unauthorized access to sensitive data' },
      ],
      intermediate: [
        { id: 391, text: 'What does the term "intrusion detection system" do?', options: ['Hacks systems', 'Creates malware', 'Monitors network for suspicious activity', 'Encrypts data'], correct: 'Monitors network for suspicious activity' },
        { id: 392, text: 'What is the purpose of penetration testing?', options: ['To manage passwords', 'To encrypt data', 'To identify vulnerabilities in a system', 'To create malware'], correct: 'To identify vulnerabilities in a system' },
        { id: 393, text: 'What does the term "SQL injection" mean?', options: ['Managing passwords', 'Creating a firewall', 'Injecting malicious SQL code into a query', 'Encrypting SQL data'], correct: 'Injecting malicious SQL code into a query' },
        { id: 394, text: 'What is the purpose of a digital certificate?', options: ['To hack systems', 'To encrypt data', 'To verify the identity of a website', 'To create malware'], correct: 'To verify the identity of a website' },
        { id: 395, text: 'What does the term "cross-site scripting" (XSS) mean?', options: ['Managing passwords', 'Creating a firewall', 'Injecting malicious scripts into web pages', 'Encrypting web data'], correct: 'Injecting malicious scripts into web pages' },
        { id: 396, text: 'What is the purpose of a public key in encryption?', options: ['To hack systems', 'To create malware', 'To encrypt data', 'To decrypt data'], correct: 'To encrypt data' },
        { id: 397, text: 'What is the purpose of a private key in encryption?', options: ['To hack systems', 'To create malware', 'To decrypt data', 'To encrypt data'], correct: 'To decrypt data' },
        { id: 398, text: 'What does the term "hashing" mean in cybersecurity?', options: ['Managing passwords', 'Creating a firewall', 'Converting data into a fixed-length string', 'Encrypting data'], correct: 'Converting data into a fixed-length string' },
        { id: 399, text: 'Which algorithm is commonly used for hashing?', options: ['DES', 'RSA', 'SHA-256', 'AES'], correct: 'SHA-256' },
        { id: 400, text: 'What does the term "man-in-the-middle attack" mean?', options: ['Managing passwords', 'Creating a firewall', 'Intercepting communication between two parties', 'Encrypting data'], correct: 'Intercepting communication between two parties' },
        { id: 401, text: 'What is the purpose of a secure socket layer (SSL)?', options: ['To hack systems', 'To encrypt data', 'To secure data transfer', 'To create malware'], correct: 'To secure data transfer' },
        { id: 402, text: 'What does the term "zero-day exploit" mean?', options: ['A firewall setting', 'A network protocol', 'A vulnerability exploited before it is patched', 'A type of encryption'], correct: 'A vulnerability exploited before it is patched' },
        { id: 403, text: 'What is the purpose of a security information and event management (SIEM) system?', options: ['To hack systems', 'To encrypt data', 'To collect and analyze security events', 'To create malware'], correct: 'To collect and analyze security events' },
        { id: 404, text: 'What does the term "keylogger" mean?', options: ['A password generator', 'A network protocol', 'Malware that records keystrokes', 'A type of firewall'], correct: 'Malware that records keystrokes' },
        { id: 405, text: 'What is the purpose of a vulnerability scan?', options: ['To hack systems', 'To encrypt data', 'To identify weaknesses in a system', 'To create malware'], correct: 'To identify weaknesses in a system' },
        { id: 406, text: 'What does the term "botnet" mean?', options: ['A password generator', 'A firewall setting', 'A network of infected computers', 'A type of encryption'], correct: 'A network of infected computers' },
        { id: 407, text: 'What is the purpose of a sandbox in cybersecurity?', options: ['To hack systems', 'To encrypt data', 'To test suspicious code in a safe environment', 'To create malware'], correct: 'To test suspicious code in a safe environment' },
        { id: 408, text: 'What does the term "exploit" mean in cybersecurity?', options: ['A firewall setting', 'A network protocol', 'A method to take advantage of a vulnerability', 'A type of encryption'], correct: 'A method to take advantage of a vulnerability' },
        { id: 409, text: 'What is the purpose of a DMZ in network security?', options: ['To hack systems', 'To encrypt data', 'To create a buffer zone between networks', 'To create malware'], correct: 'To create a buffer zone between networks' },
        { id: 410, text: 'What does the term "rootkit" mean?', options: ['A password generator', 'A network protocol', 'Malware that provides unauthorized access', 'A type of firewall'], correct: 'Malware that provides unauthorized access' },
        { id: 411, text: 'What is the purpose of a security audit?', options: ['To hack systems', 'To encrypt data', 'To evaluate security controls', 'To create malware'], correct: 'To evaluate security controls' },
        { id: 412, text: 'What does the term "cryptography" mean?', options: ['The study of passwords', 'The study of networks', 'The study of secure communication', 'The study of malware'], correct: 'The study of secure communication' },
        { id: 413, text: 'Which protocol is used for secure file transfer?', options: ['SMTP', 'HTTP', 'SFTP', 'FTP'], correct: 'SFTP' },
        { id: 414, text: 'What does the term "adware" mean?', options: ['A password generator', 'A network protocol', 'Malware that displays unwanted ads', 'A type of firewall'], correct: 'Malware that displays unwanted ads' },
        { id: 415, text: 'What is the purpose of a honeypot in cybersecurity?', options: ['To hack systems', 'To encrypt data', 'To attract and detect attackers', 'To create malware'], correct: 'To attract and detect attackers' },
        { id: 416, text: 'What does the term "session hijacking" mean?', options: ['Managing passwords', 'Creating a firewall', 'Stealing an active user session', 'Encrypting a session'], correct: 'Stealing an active user session' },
        { id: 417, text: 'What is the purpose of a security token?', options: ['To hack systems', 'To encrypt data', 'To provide secure authentication', 'To create malware'], correct: 'To provide secure authentication' },
        { id: 418, text: 'What does the term "clickjacking" mean?', options: ['Managing passwords', 'Creating a firewall', 'Tricking users into clicking malicious links', 'Encrypting clicks'], correct: 'Tricking users into clicking malicious links' },
        { id: 419, text: 'What is the purpose of a network access control (NAC) system?', options: ['To hack systems', 'To encrypt data', 'To enforce security policies on devices', 'To create malware'], correct: 'To enforce security policies on devices' },
        { id: 420, text: 'What does the term "pharming" mean?', options: ['Managing passwords', 'Creating a firewall', 'Redirecting users to fake websites', 'Encrypting websites'], correct: 'Redirecting users to fake websites' },
      ],
      advanced: [
        { id: 421, text: 'What does the term "advanced persistent threat" (APT) mean?', options: ['A firewall setting', 'A network protocol', 'A prolonged and targeted cyberattack', 'A type of encryption'], correct: 'A prolonged and targeted cyberattack' },
        { id: 422, text: 'What is the purpose of a security operations center (SOC)?', options: ['To hack systems', 'To encrypt data', 'To monitor and respond to security incidents', 'To create malware'], correct: 'To monitor and respond to security incidents' },
        { id: 423, text: 'What does the term "OWASP" stand for?', options: ['Operational Web Attack Security Project', 'Open Wireless Application Security Protocol', 'Open Web Application Security Project', 'Online Web Access Security Protocol'], correct: 'Open Web Application Security Project' },
        { id: 424, text: 'What is the purpose of the OWASP Top 10?', options: ['To hack systems', 'To encrypt data', 'To list the most critical web vulnerabilities', 'To create malware'], correct: 'To list the most critical web vulnerabilities' },
        { id: 425, text: 'What does the term "buffer overflow" mean?', options: ['A firewall setting', 'A network protocol', 'A vulnerability that allows code execution', 'A type of encryption'], correct: 'A vulnerability that allows code execution' },
        { id: 426, text: 'What is the purpose of a web application firewall (WAF)?', options: ['To hack systems', 'To encrypt data', 'To protect web applications from attacks', 'To create malware'], correct: 'To protect web applications from attacks' },
        { id: 427, text: 'What does the term "side-channel attack" mean?', options: ['A firewall setting', 'A network protocol', 'An attack exploiting physical implementation', 'A type of encryption'], correct: 'An attack exploiting physical implementation' },
        { id: 428, text: 'What is the purpose of a threat intelligence platform?', options: ['To hack systems', 'To encrypt data', 'To collect and analyze threat data', 'To create malware'], correct: 'To collect and analyze threat data' },
        { id: 429, text: 'What does the term "cryptojacking" mean?', options: ['Managing passwords', 'Creating a firewall', 'Using a victim’s device to mine cryptocurrency', 'Encrypting crypto data'], correct: 'Using a victim’s device to mine cryptocurrency' },
        { id: 430, text: 'What is the purpose of a public key infrastructure (PKI)?', options: ['To hack systems', 'To encrypt data', 'To manage digital certificates', 'To create malware'], correct: 'To manage digital certificates' },
        { id: 431, text: 'What does the term "fileless malware" mean?', options: ['A password generator', 'A network protocol', 'Malware that operates without files', 'A type of firewall'], correct: 'Malware that operates without files' },
        { id: 432, text: 'What is the purpose of a security orchestration, automation, and response (SOAR) system?', options: ['To hack systems', 'To encrypt data', 'To automate security incident response', 'To create malware'], correct: 'To automate security incident response' },
        { id: 433, text: 'What does the term "supply chain attack" mean?', options: ['Managing passwords', 'Creating a firewall', 'Attacking a third-party vendor to gain access', 'Encrypting supply data'], correct: 'Attacking a third-party vendor to gain access' },
        { id: 434, text: 'What is the purpose of a deception technology?', options: ['To hack systems', 'To encrypt data', 'To mislead attackers with fake assets', 'To create malware'], correct: 'To mislead attackers with fake assets' },
        { id: 435, text: 'What does the term "ransomware-as-a-service" (RaaS) mean?', options: ['A firewall setting', 'A network protocol', 'Ransomware sold as a service to attackers', 'A type of encryption'], correct: 'Ransomware sold as a service to attackers' },
        { id: 436, text: 'What is the purpose of a data loss prevention (DLP) system?', options: ['To hack systems', 'To encrypt data', 'To prevent unauthorized data exfiltration', 'To create malware'], correct: 'To prevent unauthorized data exfiltration' },
        { id: 437, text: 'What does the term "privilege escalation" mean?', options: ['Managing passwords', 'Creating a firewall', 'Gaining higher-level access than authorized', 'Encrypting privileges'], correct: 'Gaining higher-level access than authorized' },
        { id: 438, text: 'What is the purpose of a security awareness training?', options: ['To hack systems', 'To encrypt data', 'To educate employees about security risks', 'To create malware'], correct: 'To educate employees about security risks' },
        { id: 439, text: 'What does the term "dark pool" mean in cybersecurity?', options: ['A firewall setting', 'A network protocol', 'A private forum for sharing cyberthreat info', 'A type of encryption'], correct: 'A private forum for sharing cyberthreat info' },
        { id: 440, text: 'What is the purpose of a secure coding practice?', options: ['To hack systems', 'To encrypt data', 'To reduce vulnerabilities in software', 'To create malware'], correct: 'To reduce vulnerabilities in software' },
        { id: 441, text: 'What does the term "endpoint detection and response" (EDR) mean?', options: ['Managing passwords', 'Creating a firewall', 'Monitoring and responding to endpoint threats', 'Encrypting endpoints'], correct: 'Monitoring and responding to endpoint threats' },
        { id: 442, text: 'What is the purpose of a security posture assessment?', options: ['To hack systems', 'To encrypt data', 'To evaluate an organization’s security readiness', 'To create malware'], correct: 'To evaluate an organization’s security readiness' },
        { id: 443, text: 'What does the term "identity and access management" (IAM) mean?', options: ['Managing passwords', 'Creating a firewall', 'Managing user identities and permissions', 'Encrypting identities'], correct: 'Managing user identities and permissions' },
        { id: 444, text: 'What is the purpose of a zero trust architecture?', options: ['To hack systems', 'To encrypt data', 'To verify every user and device', 'To create malware'], correct: 'To verify every user and device' },
        { id: 445, text: 'What does the term "threat hunting" mean?', options: ['Managing passwords', 'Creating a firewall', 'Proactively searching for cyber threats', 'Encrypting threats'], correct: 'Proactively searching for cyber threats' },
        { id: 446, text: 'What is the purpose of a cyber kill chain?', options: ['To hack systems', 'To encrypt data', 'To model the stages of a cyberattack', 'To create malware'], correct: 'To model the stages of a cyberattack' },
        { id: 447, text: 'What does the term "red teaming" mean?', options: ['Managing passwords', 'Creating a firewall', 'Simulating attacks to test defenses', 'Encrypting teams'], correct: 'Simulating attacks to test defenses' },
        { id: 448, text: 'What is the purpose of a blue team in cybersecurity?', options: ['To hack systems', 'To encrypt data', 'To defend against simulated attacks', 'To create malware'], correct: 'To defend against simulated attacks' },
        { id: 449, text: 'What does the term "purple teaming" mean?', options: ['Managing passwords', 'Creating a firewall', 'Collaboration between red and blue teams', 'Encrypting teams'], correct: 'Collaboration between red and blue teams' },
        { id: 450, text: 'What is the purpose of a cyber incident response plan?', options: ['To hack systems', 'To encrypt data', 'To manage and recover from security incidents', 'To create malware'], correct: 'To manage and recover from security incidents' },
      ],
    },
  };

  // Job and company mappings
  const jobMappings = {
    programming: {
      beginner: 'Should Learn more programs',
      intermediate: 'Software Developer',
      advanced: 'Senior Software Engineer',
    },
    web_development: {
      beginner: 'Should learn more about web development',
      intermediate: 'Front-End Developer',
      advanced: 'Full-Stack Developer',
    },
    data_analysis: {
      beginner: 'Should Learn More About Data Analytics',
      intermediate: 'Data Analyst',
      advanced: 'Data Scientist',
    },
    machine_learning: {
      beginner: 'Should Learn More About Machine Learning',
      intermediate: 'Machine Learning Engineer',
      advanced: 'Senior ML Engineer',
    },
    cybersecurity: {
      beginner: 'Should Learn More About Cyber Security',
      intermediate: 'Cybersecurity Analyst',
      advanced: 'Senior Cybersecurity Engineer',
    },
  };

  const companyMappings = {
    'Should Learn more programs': ['', ''],
    'Software Developer': ['Wipro', 'HCL'],
    'Senior Software Engineer': ['Google', 'Microsoft'],
    'Should Learn More About Machine Learning': ['', ''],
    'Front-End Developer': ['Amazon', 'Flipkart'],
    'Full-Stack Developer': ['Facebook', 'Netflix'],
    'Should Learn More About Data Analytics': ['', ''],
    'Data Analyst': ['Deloitte', 'EY'],
    'Data Scientist': ['IBM', 'Oracle'],
    'Should Learn More About Machine Learning': ['', ''],
    'Machine Learning Engineer': ['Tesla', 'Uber'],
    'Senior ML Engineer': ['DeepMind', 'OpenAI'],
    'Should Learn More About Cyber Securitys': ['', ''],
    'Cybersecurity Analyst': ['Palo Alto Networks', 'Cisco'],
    'Senior Cybersecurity Engineer': ['FireEye', 'CrowdStrike'],
  };

  // Function to randomly select 10 questions from the pool of 30
  const getRandomQuestions = (questions) => {
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 10);
  };

  // Load questions for the current level when the skill or level changes
  useEffect(() => {
    if (questionPool[skill] && questionPool[skill][currentLevel]) {
      const questions = getRandomQuestions(questionPool[skill][currentLevel]);
      setSelectedQuestions((prev) => ({
        ...prev,
        [currentLevel]: questions,
      }));
    }
  }, [skill, currentLevel]);

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [currentLevel]: {
        ...prev[currentLevel],
        [questionId]: value,
      },
    }));
  };

  const handleSubmit = async () => {
    try {
      const currentAnswers = selectedQuestions[currentLevel].map((q) => ({
        id: q.id,
        value: answers[currentLevel]?.[q.id] || '',
      }));

      const response = await axios.post('http://localhost:5000/submit', {
        skill,
        answers: currentAnswers,
      });

      setLevelResults((prev) => ({
        ...prev,
        [currentLevel]: response.data,
      }));
    } catch (err) {
      setError('Error submitting answers. Please try again.');
    }
  };

  const handleNextLevel = () => {
    if (currentLevel === 'beginner') {
      setCurrentLevel('intermediate');
    } else if (currentLevel === 'intermediate') {
      setCurrentLevel('advanced');
    }
  };

  const getFinalResult = () => {
    const totalScore = Object.values(levelResults).reduce((sum, result) => sum + result.score, 0);
    const totalQuestions = 30; // 10 questions per level × 3 levels
    const percentage = (totalScore / totalQuestions) * 100;

    let level;
    if (percentage <= 33) level = 'beginner';
    else if (percentage <= 66) level = 'intermediate';
    else level = 'advanced';

    const job = jobMappings[skill][level];
    const companies = companyMappings[job];

    return {
      totalScore,
      percentage,
      level,
      job,
      companies,
    };
  };

  const handleRestart = () => {
    setSkill('programming');
    setAnswers({});
    setLevelResults({});
    setError(null);
    setCurrentLevel('beginner');
    setSelectedQuestions({});
  };

  const isAssessmentComplete = () => {
    return levelResults.beginner && levelResults.intermediate && levelResults.advanced;
  };

  return (
    <div className="App">
      {/* Update 1: Add Header */}
      <header className="app-header">
        <h1>Skill Assessment App</h1>
      </header>

      {/* Update 2: Wrap main content in a main tag for better semantics */}
      <main className="app-content">
        {!isAssessmentComplete() && (
          <>
            <label>Select Skill: </label>
            <select value={skill} onChange={(e) => setSkill(e.target.value)} disabled={levelResults.beginner}>
              <option value="programming">Programming</option>
              <option value="web_development">Web Development</option>
              <option value="data_analysis">Data Analysis</option>
              <option value="machine_learning">Machine Learning</option>
              <option value="cybersecurity">Cybersecurity</option>
            </select>

            <h2>Level: {currentLevel.charAt(0).toUpperCase() + currentLevel.slice(1)}</h2>

            {selectedQuestions[currentLevel] && (
              <div>
                {selectedQuestions[currentLevel].map((question) => (
                  <div key={question.id} className="question">
                    <p>{question.text}</p>
                    {question.options.map((option) => (
                      <label key={option}>
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value={option}
                          checked={answers[currentLevel]?.[question.id] === option}
                          onChange={() => handleAnswerChange(question.id, option)}
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                ))}
                <button onClick={handleSubmit}>Submit</button>
              </div>
            )}

            {levelResults[currentLevel] && (
              <div className="result">
                <h3>Results for {currentLevel.charAt(0).toUpperCase() + currentLevel.slice(1)} Level</h3>
                <p>Score: {levelResults[currentLevel].score}/10</p>
                <p>Percentage: {levelResults[currentLevel].percentage}%</p>
                {currentLevel !== 'advanced' && (
                  <button onClick={handleNextLevel}>Next Level</button>
                )}
              </div>
            )}
          </>
        )}

        {isAssessmentComplete() && (
          <div className="result">
            <h2>Final Results</h2>
            {(() => {
              const { totalScore, percentage, level, job, companies } = getFinalResult();
              return (
                <>
                  <p>Total Score: {totalScore}/30</p>
                  <p>Percentage: {percentage}%</p>
                  <p>Level: {level.charAt(0).toUpperCase() + level.slice(1)}</p>
                  <p>Job Recommendation: {job}</p>
                  <p>Companies: {companies.join(', ')}</p>
                </>
              );
            })()}
            <button onClick={handleRestart}>Restart Assessment</button>
          </div>
        )}

        {error && <p className="error">{error}</p>}
      </main>

      {/* Update 3: Add Footer with Copyright */}
      <footer className="app-footer">
        <p>&copy; Skill Assessment App. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default App;