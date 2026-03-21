# PyACT-R Tutorial Webapp Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         PyACT-R Tutorial Webapp                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─────────────────────────┐         ┌──────────────────────────┐  │
│  │      Frontend (React)    │         │    Backend (FastAPI)     │  │
│  │                          │         │                          │  │
│  │  ┌───────────────────┐  │         │  ┌──────────────────┐   │  │
│  │  │   Homepage        │  │         │  │  POST /api/      │   │  │
│  │  │  - Tutorial Grid  │  │ ──────> │  │    /execute      │   │  │
│  │  │  - Overview       │  │         │  │                  │   │  │
│  │  └───────────────────┘  │         │  │  - Run Python    │   │  │
│  │                          │         │  │  - PyACT-R code  │   │  │
│  │  ┌───────────────────┐  │         │  │  - Return output │   │  │
│  │  │  Tutorial Viewer  │  │         │  └──────────────────┘   │  │
│  │  │  - Content        │  │         │                          │  │
│  │  │  - Code Examples  │  │         │  ┌──────────────────┐   │  │
│  │  │  - Run Button     │  │         │  │  GET /api/health │   │  │
│  │  └───────────────────┘  │         │  └──────────────────┘   │  │
│  │                          │         │                          │  │
│  │  ┌───────────────────┐  │         │  ┌──────────────────┐   │  │
│  │  │   Playground      │  │         │  │  Subprocess      │   │  │
│  │  │  - Code Editor    │  │         │  │  Execution       │   │  │
│  │  │  - Output Panel   │  │         │  │  - Timeout       │   │  │
│  │  │  - Examples       │  │         │  │  - Sandboxed     │   │  │
│  │  └───────────────────┘  │         │  └──────────────────┘   │  │
│  │                          │         │                          │  │
│  └─────────────────────────┘         └──────────────────────────┘  │
│                                                                      │
│  Technologies:                        Technologies:                  │
│  - React + TypeScript                 - FastAPI                     │
│  - Tailwind CSS                      - Python 3.11                 │
│  - Monaco Editor                     - PyACT-R                     │
│  - Vite                             - Uvicorn                     │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘

Data Flow:
===========

1. User opens tutorial
   └──> Frontend loads content from tutorialContent.ts

2. User clicks "Run Code"
   └──> Frontend sends POST to /api/execute
        └──> Backend creates subprocess
             └──> Executes Python/PyACT-R code
                  └──> Returns output
                       └──> Frontend displays result

3. User writes code in Playground
   └──> Monaco Editor provides syntax highlighting
        └──> User clicks "Run"
             └──> Same execution flow as above

Security:
=========
- Code runs in isolated subprocess
- 10-second timeout
- No file system access
- Output capture only
```