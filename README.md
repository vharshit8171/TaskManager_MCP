# Task Manager MCP Server
A production-style Task Manager MCP (Model Context Protocol) Server built with TypeScript, MongoDB, Mongoose, Zod, and the official MCP SDK.
This project exposes task management capabilities as MCP tools so AI assistants and MCP clients can create, update, fetch, and delete tasks through natural language interactions.

## ✨ Features

- Create Tasks
- Fetch All Tasks
- Update Existing Tasks
- Delete Tasks
- MongoDB Integration
- Zod Validation
- TypeScript Support
- MCP Tool-Based Architecture
- Clean Scalable Folder Structure
- Service-Based Backend Design


## 🧠 What is MCP?

Model Context Protocol (MCP) is a protocol that allows AI models to interact with external systems through tools, resources, and prompts.
Instead of only generating text, AI models can use MCP servers to perform real actions such as:
- Managing tasks
- Reading files
- Calling APIs
- Updating databases
- Automating workflows

This project demonstrates how to build a structured backend system that AI agents can interact with using MCP tools.

## 🏗️ Project Structure

task-mcp-server-ts/

├── src/
│
├── config/
│ └── db.ts
│
├── models/
│ └── task.model.ts
│
├── validations/
│ └── task.validation.ts
│
├── services/
│ └── task.service.ts
│
├── tools/
│ └── task.tools.ts
│
└── server.ts
│
├── .env
├── package.json
├── tsconfig.json
└── README.md

## ⚙️ Tech Stack

- TypeScript
- Node.js
- MongoDB
- Mongoose
- Zod
- MCP SDK

## 🔌Some Available MCP Tools

### 1. create_task
Creates a new task.

### 2. get_tasks
Fetches all tasks from the database.

### 3. update_task
Updates an existing task.

### 4. delete_task
Deletes a task from the database.

## 📦 Task Schema

```ts
{
  title: string;
  description?: string;
  status: "pending" | "in-progress" | "completed";
  priority: "low" | "medium" | "high";
  dueDate?: Date;
}
