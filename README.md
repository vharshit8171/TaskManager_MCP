# Task Manager MCP Server
A production-style Task Manager MCP (Model Context Protocol) Server built using TypeScript, MongoDB, Mongoose, Zod, and the official MCP SDK.

This project demonstrates how AI assistants and MCP clients can interact with a real backend system using:
- MCP Tools
- MCP Resources
- MCP Prompts

The server allows AI agents to create, update, fetch, delete, analyze, and intelligently plan tasks through natural language interactions.

---

# ✨ Features

## 🔧 MCP Tools
- Create Tasks
- Fetch Tasks
- Update Tasks
- Delete Tasks
- Task Filtering & Search
- Priority & Status Updates

## 📚 MCP Resources
- Live Task Summary Resource
- Overdue Tasks Resource
- Always-Available AI Context

## 🧠 MCP Prompts
- Daily Productivity Briefing
- Smart Weekly Planning
- AI-Powered Task Prioritization

## ⚙️ Backend Features
- MongoDB Integration
- Mongoose ODM
- Zod Validation
- TypeScript Support
- Service-Based Architecture
- Modular Folder Structure

---

# 🧠 What is MCP?

Model Context Protocol (MCP) is a protocol that allows AI models to interact with external systems through:
- Tools
- Resources
- Prompts

Instead of only generating text, AI assistants can use MCP servers to perform real-world actions such as:
- Managing tasks
- Reading files
- Calling APIs
- Updating databases
- Automating workflows
- Generating intelligent plans

This project demonstrates how to build an AI-native backend system that exposes capabilities directly to AI models.

---

# 🏗️ Project Structure

```bash
task-mcp-server-ts/

├── src/
│
├── config/
│   └── db.ts
│
├── models/
│   └── task.model.ts
│
├── validations/
│   └── task.validation.ts
│
├── services/
│   └── task.service.ts
│
├── tools/
│   └── task.tools.ts
│
├── resources/
│   └── task.resources.ts
│
├── prompts/
│   └── task.prompts.ts
│
└── server.ts
│
├── .env
├── package.json
├── tsconfig.json
└── README.md
```

---

# ⚙️ Tech Stack

- TypeScript
- Node.js
- MongoDB
- Mongoose
- Zod
- MCP SDK

---

# 🔧 MCP Tools

## 1. create_task
Creates a new task.

## 2. get_tasks
Fetches all tasks from the database.

## 3. update_task
Updates an existing task.

## 4. delete_task
Deletes a task from the database.

## 5. search_tasks
Searches tasks by title or keyword.

## 6. set_priority
Updates task priority.

## 7. set_due_date
Updates task due dates.

---

# 📚 MCP Resources

Resources provide always-available read-only context to AI assistants.
Unlike tools, resources are automatically readable by AI models without requiring explicit user actions.

## 1. tasks://summary

Provides a live snapshot of:
- Total Tasks
- Pending Tasks
- Completed Tasks
- Overdue Tasks
This helps AI assistants understand the user's productivity status instantly.

---

## 2. tasks://overdue
Provides a live list of all overdue pending tasks.
AI assistants can proactively warn users about missed deadlines and urgent work.

---

# 🧠 MCP Prompts

Prompts are reusable AI instruction templates powered by real backend data.
They combine:
- AI instructions
- Database data
- Structured workflows
to generate intelligent responses.

---

## 1. daily-briefing

Generates a smart daily productivity briefing using:
- Task summary
- Overdue tasks
- Pending tasks

The AI assistant provides:
- Current productivity status
- Top priority tasks
- Urgent overdue work
- Motivational guidance

---

## 2. plan-my-week

Creates a realistic 7-day task schedule based on:
- Available hours per day
- Pending tasks
- Task priorities
- Due dates
The AI assistant intelligently distributes work across the week.

---

# 📦 Task Schema

```ts
{
  title: string;
  description?: string;
  status: "pending" | "in-progress" | "completed";
  priority: "low" | "medium" | "high";
  dueDate?: Date;
}
```

---

# 🚀 Getting Started

## 1. Clone Repository

```bash
git clone <your-repo-url>
cd task-mcp-server-ts
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Configure Environment Variables

Create a `.env` file:

```env
MONGODB_URI=your_mongodb_connection_string
```

---

## 4. Run Development Server

```bash
npm run dev
```

---

# 🧪 Example MCP Capabilities

Examples of natural language interactions supported by this MCP server:
- "Create a high priority task for tomorrow"
- "Show all pending tasks"
- "What tasks are overdue?"
- "Give me my daily productivity briefing"
- "Plan my week with 4 available hours daily"

---

# 🏛️ Architecture Overview

This project follows a production-style layered architecture:

## Validation Layer
Handles request validation using Zod.

## Service Layer
Contains all business logic and database interactions.

## MCP Layer
Exposes:
- Tools
- Resources
- Prompts
to AI assistants through the MCP SDK.

## Database Layer
MongoDB + Mongoose models.