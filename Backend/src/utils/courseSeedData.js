const playlistBase = "https://www.youtube.com/playlist?list=";

const createLessons = (playlistId, sectionOrder, sectionTitle, entries) =>
  entries.map((entry, index) => ({
    title: entry.title,
    description: entry.description,
    durationLabel: entry.durationLabel,
    orderIndex: index + 1,
    sectionOrder,
    playlistIndex: (sectionOrder - 1) * 5 + index,
    isFreePreview: sectionOrder === 1 && index === 0,
    playlistId,
    youtubeUrl: `${playlistBase}${playlistId}`,
    sectionTitle,
  }));

const courseSeedData = [
  {
    title: "Java Foundations Bootcamp",
    slug: "java-foundations-bootcamp",
    category: "Programming",
    level: "Beginner",
    duration: "20 guided lessons",
    price: 999,
    thumbnail:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80",
    playlistId: "PLu0W_9lII9agS67Uits0UnJyrYiXhDS6q",
    description:
      "Build real confidence with Java fundamentals through a structured path that covers syntax, control flow, object-oriented thinking, and practical coding habits.",
    sections: [
      {
        title: "Getting Started With Java",
        lessons: createLessons("PLu0W_9lII9agS67Uits0UnJyrYiXhDS6q", 1, "Getting Started With Java", [
          { title: "Course Orientation and Java Mindset", description: "Understand how the Java course is structured and what concepts you will master first.", durationLabel: "12 min" },
          { title: "Installing Java and IDE Setup", description: "Prepare your system with the essential tools needed to write and run Java programs.", durationLabel: "15 min" },
          { title: "Your First Java Program", description: "Create, run, and break down the structure of a simple Java application.", durationLabel: "11 min" },
          { title: "Variables, Data Types, and Input", description: "Learn how Java stores values and how user input flows into a program.", durationLabel: "14 min" },
          { title: "Operators and Expressions", description: "Use arithmetic, logical, and comparison operators to build meaningful code.", durationLabel: "13 min" },
        ]),
      },
      {
        title: "Control Flow and Logic",
        lessons: createLessons("PLu0W_9lII9agS67Uits0UnJyrYiXhDS6q", 2, "Control Flow and Logic", [
          { title: "Conditional Statements in Practice", description: "Write cleaner decision-making logic using if, else if, and nested conditions.", durationLabel: "16 min" },
          { title: "Switch Statements and Clean Branching", description: "Use switch-based control flow to simplify repetitive conditional logic.", durationLabel: "10 min" },
          { title: "Loops and Iteration Patterns", description: "Master for, while, and do-while loops with practical programming examples.", durationLabel: "18 min" },
          { title: "Debugging Common Logic Errors", description: "Spot the most common beginner mistakes and fix them with confidence.", durationLabel: "12 min" },
          { title: "Mini Practice on Core Logic", description: "Apply conditions and loops in a compact coding exercise set.", durationLabel: "14 min" },
        ]),
      },
      {
        title: "Arrays, Methods, and Reuse",
        lessons: createLessons("PLu0W_9lII9agS67Uits0UnJyrYiXhDS6q", 3, "Arrays, Methods, and Reuse", [
          { title: "Working With Arrays", description: "Store and traverse groups of values using arrays and indexing.", durationLabel: "15 min" },
          { title: "Method Basics and Parameters", description: "Create reusable methods and understand inputs, outputs, and method calls.", durationLabel: "14 min" },
          { title: "Return Values and Method Design", description: "Write methods that return data and keep your code modular.", durationLabel: "11 min" },
          { title: "String Handling Essentials", description: "Manipulate and compare strings in everyday Java workflows.", durationLabel: "13 min" },
          { title: "Practice Set on Arrays and Methods", description: "Strengthen your understanding with a guided method and array exercise pack.", durationLabel: "17 min" },
        ]),
      },
      {
        title: "OOP Fundamentals",
        lessons: createLessons("PLu0W_9lII9agS67Uits0UnJyrYiXhDS6q", 4, "OOP Fundamentals", [
          { title: "Classes and Objects", description: "Understand how Java models real-world data with classes and objects.", durationLabel: "18 min" },
          { title: "Constructors and Initialization", description: "Set up object state correctly using constructors and defaults.", durationLabel: "12 min" },
          { title: "Encapsulation and Access Modifiers", description: "Protect data and expose clean APIs with encapsulation rules.", durationLabel: "13 min" },
          { title: "Inheritance and Code Reuse", description: "Build class hierarchies and reuse behavior effectively.", durationLabel: "16 min" },
          { title: "Final OOP Recap", description: "Review the key OOP ideas that prepare you for advanced Java development.", durationLabel: "15 min" },
        ]),
      },
    ],
  },
  {
    title: "Python Beginner to Builder",
    slug: "python-beginner-to-builder",
    category: "Programming",
    level: "Beginner",
    duration: "20 guided lessons",
    price: 999,
    thumbnail:
      "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=1200&q=80",
    playlistId: "PLu0W_9lII9agwh1XjRt242xIpHhPT2llg",
    description:
      "Learn Python through a clean progression from setup and syntax to functions, collections, and problem-solving patterns used in everyday development.",
    sections: [
      {
        title: "Python Setup and Syntax",
        lessons: createLessons("PLu0W_9lII9agwh1XjRt242xIpHhPT2llg", 1, "Python Setup and Syntax", [
          { title: "Welcome to Python and Course Roadmap", description: "Get familiar with the learning path and understand how Python is used in practice.", durationLabel: "10 min" },
          { title: "Installing Python and Running Code", description: "Set up Python locally and run your first script with confidence.", durationLabel: "12 min" },
          { title: "Variables and Basic Data Types", description: "Understand strings, numbers, and the basics of storing information in Python.", durationLabel: "14 min" },
          { title: "Input, Output, and Type Conversion", description: "Handle user data and convert between values safely.", durationLabel: "13 min" },
          { title: "Operators and Expressions", description: "Use arithmetic and logical operators to write expressive Python code.", durationLabel: "11 min" },
        ]),
      },
      {
        title: "Decision Making and Loops",
        lessons: createLessons("PLu0W_9lII9agwh1XjRt242xIpHhPT2llg", 2, "Decision Making and Loops", [
          { title: "If, Elif, and Else", description: "Build branching logic and make decisions based on real input values.", durationLabel: "15 min" },
          { title: "Looping With While", description: "Use while loops for repeated tasks and controlled execution.", durationLabel: "12 min" },
          { title: "Looping With For and Range", description: "Write concise iteration logic for sequences and counted loops.", durationLabel: "16 min" },
          { title: "Break, Continue, and Loop Patterns", description: "Control loop flow for better readability and performance.", durationLabel: "11 min" },
          { title: "Practice: Logic and Iteration", description: "Apply decision-making and loops in a short problem-solving session.", durationLabel: "14 min" },
        ]),
      },
      {
        title: "Collections and Functions",
        lessons: createLessons("PLu0W_9lII9agwh1XjRt242xIpHhPT2llg", 3, "Collections and Functions", [
          { title: "Lists and List Operations", description: "Work with ordered collections using indexing, slicing, and updates.", durationLabel: "15 min" },
          { title: "Tuples, Sets, and Dictionaries", description: "Choose the right Python collection for each use case.", durationLabel: "17 min" },
          { title: "Functions and Parameters", description: "Package logic into reusable functions with clean interfaces.", durationLabel: "13 min" },
          { title: "Return Values and Scope", description: "Understand local scope and how functions pass data back.", durationLabel: "12 min" },
          { title: "Practice: Collections and Reuse", description: "Combine functions and collections to solve small real problems.", durationLabel: "14 min" },
        ]),
      },
      {
        title: "Strings, Files, and Wrap-Up",
        lessons: createLessons("PLu0W_9lII9agwh1XjRt242xIpHhPT2llg", 4, "Strings, Files, and Wrap-Up", [
          { title: "String Methods That Matter", description: "Use Python string tools for formatting, searching, and cleaning text.", durationLabel: "14 min" },
          { title: "Exception Handling Basics", description: "Write safer programs using try, except, and graceful error handling.", durationLabel: "12 min" },
          { title: "Reading and Writing Files", description: "Persist data and process files using common Python patterns.", durationLabel: "16 min" },
          { title: "Mini Project Walkthrough", description: "See how core Python concepts fit together in a small project flow.", durationLabel: "18 min" },
          { title: "Course Recap and Next Steps", description: "Review what you learned and where to continue after the foundations.", durationLabel: "9 min" },
        ]),
      },
    ],
  },
  {
    title: "Artificial Intelligence Core Concepts",
    slug: "artificial-intelligence-core-concepts",
    category: "AI & ML",
    level: "Intermediate",
    duration: "20 guided lessons",
    price: 999,
    thumbnail:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80",
    playlistId: "PLxCzCOWd7aiHGhOHV-nwb0HR5US5GFKFI",
    description:
      "Explore the foundations of AI with a structured introduction to intelligent systems, search, reasoning, and machine learning concepts presented in a beginner-friendly flow.",
    sections: [
      {
        title: "AI Overview and Terminology",
        lessons: createLessons("PLxCzCOWd7aiHGhOHV-nwb0HR5US5GFKFI", 1, "AI Overview and Terminology", [
          { title: "What Artificial Intelligence Really Means", description: "Frame the field of AI and understand the key themes that shape modern systems.", durationLabel: "13 min" },
          { title: "History and Evolution of AI", description: "Trace the major milestones that moved AI from theory to modern practice.", durationLabel: "15 min" },
          { title: "Problem Solving as an AI Discipline", description: "Learn how AI models problems, states, actions, and goals.", durationLabel: "12 min" },
          { title: "Agents, Environments, and Rationality", description: "Understand the core language used to describe intelligent behavior.", durationLabel: "14 min" },
          { title: "Types of AI Systems", description: "Compare symbolic, rule-based, and learning-driven AI approaches.", durationLabel: "11 min" },
        ]),
      },
      {
        title: "Search and Decision Systems",
        lessons: createLessons("PLxCzCOWd7aiHGhOHV-nwb0HR5US5GFKFI", 2, "Search and Decision Systems", [
          { title: "State Space Search Basics", description: "Understand why search is central to classical AI.", durationLabel: "14 min" },
          { title: "Breadth-First and Depth-First Search", description: "Compare fundamental search strategies and their tradeoffs.", durationLabel: "17 min" },
          { title: "Heuristics and Informed Search", description: "Use heuristics to guide better decisions and reduce search time.", durationLabel: "15 min" },
          { title: "Optimization and Local Search", description: "Explore practical AI problem solving beyond exhaustive search.", durationLabel: "13 min" },
          { title: "Constraint Satisfaction Ideas", description: "Learn the basics of AI constraint solving and consistent assignment.", durationLabel: "12 min" },
        ]),
      },
      {
        title: "Knowledge and Reasoning",
        lessons: createLessons("PLxCzCOWd7aiHGhOHV-nwb0HR5US5GFKFI", 3, "Knowledge and Reasoning", [
          { title: "Knowledge Representation", description: "See how facts and relationships are modeled for machine reasoning.", durationLabel: "15 min" },
          { title: "Logic in AI", description: "Understand propositional reasoning and why logical structure matters.", durationLabel: "16 min" },
          { title: "Inference and Rule Systems", description: "Follow how AI systems derive new knowledge from existing facts.", durationLabel: "14 min" },
          { title: "Uncertainty and Probabilistic Thinking", description: "Move from rigid logic to probability-aware reasoning.", durationLabel: "13 min" },
          { title: "Expert Systems Overview", description: "Review how expert systems apply rules to mimic domain specialists.", durationLabel: "10 min" },
        ]),
      },
      {
        title: "Machine Learning Bridge",
        lessons: createLessons("PLxCzCOWd7aiHGhOHV-nwb0HR5US5GFKFI", 4, "Machine Learning Bridge", [
          { title: "Where Machine Learning Fits in AI", description: "Connect AI fundamentals with modern learning systems.", durationLabel: "12 min" },
          { title: "Supervised vs Unsupervised Learning", description: "Compare the main learning paradigms used in AI workflows.", durationLabel: "15 min" },
          { title: "Model Training and Evaluation", description: "Understand the basic loop of data, training, and validation.", durationLabel: "14 min" },
          { title: "Neural Networks in Context", description: "See how neural models extend the AI toolbox.", durationLabel: "16 min" },
          { title: "AI Course Wrap-Up", description: "Summarize the concepts that prepare you for deeper machine learning study.", durationLabel: "9 min" },
        ]),
      },
    ],
  },
  {
    title: "Full Stack Web Development Path",
    slug: "full-stack-web-development-path",
    category: "Web Development",
    level: "Beginner to Intermediate",
    duration: "20 guided lessons",
    price: 999,
    thumbnail:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
    playlistId: "PLQEaRBV9gAFsistSzOgnD4cWgFGRVda4X",
    description:
      "Get a broad and practical overview of web development by learning frontend, backend, APIs, databases, and modern full-stack thinking in one guided journey.",
    sections: [
      {
        title: "Web Foundations",
        lessons: createLessons("PLQEaRBV9gAFsistSzOgnD4cWgFGRVda4X", 1, "Web Foundations", [
          { title: "How the Web Works", description: "Understand the request-response cycle, browsers, servers, and deployment basics.", durationLabel: "11 min" },
          { title: "HTML Structure Essentials", description: "Build semantic page structure that supports scalable interfaces.", durationLabel: "14 min" },
          { title: "CSS Layout and Styling Principles", description: "Learn spacing, layout systems, and visual consistency for modern UI.", durationLabel: "15 min" },
          { title: "JavaScript in the Browser", description: "Add interactivity and understand DOM-driven workflows.", durationLabel: "13 min" },
          { title: "Mini Frontend Recap", description: "Review core browser skills before moving into modern tooling.", durationLabel: "10 min" },
        ]),
      },
      {
        title: "Modern Frontend Thinking",
        lessons: createLessons("PLQEaRBV9gAFsistSzOgnD4cWgFGRVda4X", 2, "Modern Frontend Thinking", [
          { title: "Component-Based UI Patterns", description: "Understand how modern frontend frameworks structure reusable views.", durationLabel: "16 min" },
          { title: "State and Data Flow", description: "Learn how applications manage changing data across screens.", durationLabel: "12 min" },
          { title: "Routing and Multi-Page Experiences", description: "Design smooth navigation for production-grade web apps.", durationLabel: "14 min" },
          { title: "Forms and Validation", description: "Create reliable user input flows with clear validation states.", durationLabel: "11 min" },
          { title: "Frontend Project Organization", description: "Structure growing UI projects for clarity and maintainability.", durationLabel: "13 min" },
        ]),
      },
      {
        title: "Backend and APIs",
        lessons: createLessons("PLQEaRBV9gAFsistSzOgnD4cWgFGRVda4X", 3, "Backend and APIs", [
          { title: "Backend Responsibilities Explained", description: "See where authentication, data, and business logic belong.", durationLabel: "12 min" },
          { title: "REST API Fundamentals", description: "Design resource-oriented APIs with clean request and response patterns.", durationLabel: "15 min" },
          { title: "Databases and Data Modeling", description: "Model structured application data and understand persistence choices.", durationLabel: "16 min" },
          { title: "Authentication and Authorization", description: "Secure your app with identity, sessions, and access control concepts.", durationLabel: "14 min" },
          { title: "Connecting Frontend to Backend", description: "Move data between UI and server reliably with modern patterns.", durationLabel: "13 min" },
        ]),
      },
      {
        title: "Full Stack Delivery",
        lessons: createLessons("PLQEaRBV9gAFsistSzOgnD4cWgFGRVda4X", 4, "Full Stack Delivery", [
          { title: "Deployment Concepts for Real Apps", description: "Prepare your project for hosting, environment variables, and builds.", durationLabel: "12 min" },
          { title: "Debugging Across the Stack", description: "Trace problems through frontend, API, and database layers.", durationLabel: "11 min" },
          { title: "Performance and Scalability Basics", description: "Identify the improvements that matter most as your app grows.", durationLabel: "14 min" },
          { title: "Production Readiness Checklist", description: "Review what makes a full-stack app feel polished and reliable.", durationLabel: "10 min" },
          { title: "Career Roadmap and Next Projects", description: "Use your foundations to plan deeper specialization and project building.", durationLabel: "9 min" },
        ]),
      },
    ],
  },
  {
    title: "SQL Mastery for Developers",
    slug: "sql-mastery-for-developers",
    category: "Databases",
    level: "Beginner to Intermediate",
    duration: "20 guided lessons",
    price: 999,
    thumbnail:
      "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=1200&q=80",
    playlistId: "PLNcg_FV9n7qZY_2eAtUzEUulNjTJREhQe",
    description:
      "Build strong SQL fundamentals with a structured path through querying, filtering, joins, aggregation, and practical database operations for application development.",
    sections: [
      {
        title: "SQL Basics and Setup",
        lessons: createLessons("PLNcg_FV9n7qZY_2eAtUzEUulNjTJREhQe", 1, "SQL Basics and Setup", [
          { title: "What SQL Solves", description: "Understand the role of SQL in storing and retrieving application data.", durationLabel: "10 min" },
          { title: "Databases, Tables, and Rows", description: "Learn the building blocks of relational database structure.", durationLabel: "12 min" },
          { title: "Writing Your First SELECT Queries", description: "Start querying data with confidence using the most common SQL statement.", durationLabel: "13 min" },
          { title: "Filtering Results With WHERE", description: "Return the exact records you need using conditions.", durationLabel: "11 min" },
          { title: "Sorting and Limiting Data", description: "Control result ordering and size for cleaner output.", durationLabel: "10 min" },
        ]),
      },
      {
        title: "Core Querying Skills",
        lessons: createLessons("PLNcg_FV9n7qZY_2eAtUzEUulNjTJREhQe", 2, "Core Querying Skills", [
          { title: "Working With Multiple Conditions", description: "Combine AND, OR, and grouping to express precise logic.", durationLabel: "12 min" },
          { title: "Pattern Matching and IN Clauses", description: "Use LIKE, IN, and related operators for flexible searches.", durationLabel: "14 min" },
          { title: "Aggregate Functions", description: "Summarize data using COUNT, SUM, AVG, MIN, and MAX.", durationLabel: "13 min" },
          { title: "GROUP BY and HAVING", description: "Analyze grouped data and filter aggregated results correctly.", durationLabel: "15 min" },
          { title: "Null Handling and Clean Results", description: "Understand NULL semantics and avoid common query mistakes.", durationLabel: "11 min" },
        ]),
      },
      {
        title: "Joins and Relationships",
        lessons: createLessons("PLNcg_FV9n7qZY_2eAtUzEUulNjTJREhQe", 3, "Joins and Relationships", [
          { title: "Relational Thinking for SQL", description: "Learn how tables relate and why keys matter in schema design.", durationLabel: "12 min" },
          { title: "INNER JOIN Fundamentals", description: "Combine data across related tables using inner joins.", durationLabel: "16 min" },
          { title: "LEFT JOIN and Optional Relations", description: "Handle incomplete data without losing important records.", durationLabel: "13 min" },
          { title: "Multi-Table Queries", description: "Build larger queries that model real application data needs.", durationLabel: "14 min" },
          { title: "Join Practice and Review", description: "Consolidate relationship-based querying through practical examples.", durationLabel: "12 min" },
        ]),
      },
      {
        title: "Data Operations and Wrap-Up",
        lessons: createLessons("PLNcg_FV9n7qZY_2eAtUzEUulNjTJREhQe", 4, "Data Operations and Wrap-Up", [
          { title: "INSERT, UPDATE, and DELETE", description: "Change stored data safely using core data manipulation statements.", durationLabel: "13 min" },
          { title: "Creating Tables and Constraints", description: "Define better schemas with keys, rules, and constraints.", durationLabel: "15 min" },
          { title: "Indexes and Query Performance", description: "Improve common queries with the right indexing mindset.", durationLabel: "12 min" },
          { title: "SQL in Application Development", description: "Understand how SQL fits inside backend services and apps.", durationLabel: "10 min" },
          { title: "Final SQL Roadmap", description: "Review the essentials and identify the next level topics to study.", durationLabel: "9 min" },
        ]),
      },
    ],
  },
];

module.exports = { courseSeedData };
