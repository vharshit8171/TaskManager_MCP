import type z from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { CreateTaskSchema, TaskIdInputSchema, ListTasksSchema, UpdateTaskSchema, SetPrioritySchema, SetDueDateSchema, ListByCategorySchema, SearchTasksSchema, } from "../validations/Task.validation.js";
import { createTask, getTask, listTasks, updateTask, deleteTask, completeTask, setPriority, setDueDate, listByCategory, searchTasks, } from "../services/task.service.js";


// This line is the key because what we are doing we are creating a TS type from the Zod schema. In simple language "Dear TypeScript, please automatically create the type from my Zod schema".
type CreateTaskData = z.infer<typeof CreateTaskSchema>


//  registerTools- call this in index.ts after creating the McpServer instance.
export function registerTools(server: McpServer): void {

    server.registerTool(
        "create_task",
        {
            description: "Create a new task with title, description, category, priority and due date",
            inputSchema: CreateTaskSchema,
        },
        async (args: CreateTaskData) => ({
            content: [{ type: "text", text: await createTask(args) }],
        })
    )


    server.registerTool(
        "get_task",
        {
            description: "Get full details of a single task by its ID",
            inputSchema: TaskIdInputSchema

        },
        async ({ id }) => ({
            content: [{ type: "text", text: await getTask(id) }]
        })
    )


    server.registerTool(
        "list_tasks",
        {
            description: "List all tasks. Optionally filter by status or priority",
            inputSchema: ListTasksSchema,
        },
        async (args) => ({
            content: [{ type: "text", text: await listTasks(args) }],
        })
    );


    server.registerTool(
        "update_task",
        {
            description: "Update the title, description or category of an existing task",
            inputSchema: UpdateTaskSchema,
        },
        async ({ id, ...updates }) => ({
            content: [{ type: "text", text: await updateTask(id, updates) }],
        })
    );


    server.registerTool(
        "delete_task",
        {
            description: "Permanently delete a task by its ID",
            inputSchema: TaskIdInputSchema,
        },
        async ({ id }) => ({
            content: [{ type: "text", text: await deleteTask(id) }],
        })
    );


    server.registerTool(
        "complete_task",
        {
            description: "Mark a task as completed",
            inputSchema: TaskIdInputSchema,
        },
        async ({ id }) => ({
            content: [{ type: "text", text: await completeTask(id) }],
        })
    );


    server.registerTool(
        "set_priority",
        {
            description: "Change the priority of a task to low, medium or high",
            inputSchema: SetPrioritySchema,
        },
        async ({ id, priority }) => ({
            content: [{ type: "text", text: await setPriority({ id, priority }) }],
        })
    );


    server.registerTool(
        "set_due_date",
        {
            description: "Set or update the due date of a task",
            inputSchema: SetDueDateSchema,
        },
        async ({ id, dueDate }) => ({
            content: [{ type: "text", text: await setDueDate({ id, dueDate }) }],
        })
    );


    server.registerTool(
        "list_by_category",
        {
            description: "List all tasks that belong to a specific category",
            inputSchema: ListByCategorySchema,
        },
        async ({ category }) => ({
            content: [{ type: "text", text: await listByCategory({ category }) }],
        })
    );


    server.registerTool(
        "search_tasks",
        {
            description: "Search tasks by keyword across title, description and category",
            inputSchema: SearchTasksSchema,
        },
        async ({ keyword }) => ({
            content: [{ type: "text", text: await searchTasks({ keyword }) }],
        })
    );


    server.registerTool(
        "list_tools",
        {
            description: "Show all available tools, resources and prompts with full details",
            inputSchema: {},
        },
        async () => ({
            content: [{
                type: "text",
                text: `
TASK MANAGER MCP — FULL CAPABILITIES
${"═".repeat(40)}

TOOLS (actions Claude can perform)
${"─".repeat(40)}
 1. create_task        Create a new task
    Inputs: title, description?, category?, priority?, dueDate?

 2. get_task           Get one task by ID
    Inputs: id

 3. list_tasks         List all tasks
    Inputs: status? (pending|completed), priority? (low|medium|high)

 4. update_task        Update title, description or category
    Inputs: id, title?, description?, category?

 5. delete_task        Delete a task permanently
    Inputs: id

 6. complete_task      Mark a task as completed
    Inputs: id

 7. set_priority       Change priority level
    Inputs: id, priority (low|medium|high)

 8. set_due_date       Set or update due date
    Inputs: id, dueDate (any date string)

 9. list_by_category   List tasks in a category
    Inputs: category

10. search_tasks       Search by keyword
    Inputs: keyword

11. list_tools         Show this help
    Inputs: none

RESOURCES (always available as context)
${"─".repeat(40)}
• tasks://summary   Live dashboard (totals, pending, overdue)
• tasks://overdue   All overdue pending tasks

PROMPTS (saved instruction templates)
${"─".repeat(40)}
• daily-briefing    Smart briefing of today's tasks
  Inputs: none

• plan-my-week      Weekly task planner
  Inputs: available_hours (e.g. "4")
`.trim(),
            }],
        })
    );
}