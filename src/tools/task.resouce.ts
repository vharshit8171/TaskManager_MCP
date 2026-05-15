import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getTaskSummary, getOverdueTasks } from "../services/task.service.js";


//  Resources expose read-only data as always-available context. Claude can read these without making a tool call.

export function registerResources(server: McpServer): void {
    // -------------------- Resource 1: tasks://summary -------------------------

    // A live dashboard snapshot of all task counts.
    // Claude reads this automatically for context before answering, questions like "how many tasks do I have?" or "am I on track?"

    server.registerResource(
        "task-summary",
        "tasks://summary",
        {
            title: "Task Summary",
            description: "A live snapshot of your task counts, including pending, completed, and overdue tasks. Claude reads this automatically for context before answering questions like 'how many tasks do I have?' or 'am I on track?'",
            mimeType: "text/plain",
        },
        async (uri: any) => ({
            contents: [{uri: uri.href,mimeType: "text/plain",text: await getTaskSummary(),}]
        })
    );

    // ------------------ Resource 2: tasks://overdue -----------------------

    // Always-visible list of overdue pending tasks.
    // Claude reads this to proactively warn you about missed deadlines without you having to ask.

    server.registerResource(
        "overdue-tasks",
        "tasks://overdue",
        {
            title: "OverDue-Tasks",
            description: "Full list of all pending tasks that are past their due date. Claude will check this automatically and can warn you about missed deadlines.",
            mimeType: "text/plain"
        },
        async (uri) => ({
            contents: [{uri: uri.href,mimeType: "text/plain",text: await getOverdueTasks(),
            }]
        })
    )
}