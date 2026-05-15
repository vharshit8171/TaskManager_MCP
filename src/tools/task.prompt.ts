import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getTaskSummary, getOverdueTasks, getPendingTasks } from "../services/task.service.js";
import { PlanMyWeekSchema } from "../validations/Task.validation.js";

export function registerPrompts(server: McpServer): void {
    // ---------------- DAILY BRIEFING ----------------

    server.registerPrompt(
        "daily-briefing",
        {
            title: "Daily Briefing",
            description: "Get a smart daily briefing of all your tasks with priorities and focus areas",
        },

        async () => {
            const [summary, overdue, pending] = await Promise.all([
                getTaskSummary(),
                getOverdueTasks(),
                getPendingTasks(),
            ]);

            return {
                messages: [{
                    role: "user",
                    content: {
                        type: "text",
                        text: `You are a productivity assistant giving me my daily briefing.
Based on the task data below, give me:
1. A quick one-line status of where I stand today
2. The top 3 tasks I should focus on right now
3. Any overdue tasks I must handle immediately
4. One motivational closing line

Keep it concise and actionable.

${"─".repeat(40)}
SUMMARY
${"─".repeat(40)}
${summary}

${"─".repeat(40)}
OVERDUE TASKS
${"─".repeat(40)}
${overdue}

${"─".repeat(40)}
ALL PENDING TASKS
${"─".repeat(40)}
${pending}`,
                    },
                },
                ],
            };
        }
    );

    // ---------------- PLAN MY WEEK ----------------

    server.registerPrompt(
        "plan-my-week",
        {
            title: "Plan My Week",
            description: "Create a realistic weekly plan from pending tasks",
            argsSchema: PlanMyWeekSchema.shape,
        },
        async ({ available_hours }) => {

            const pending = await getPendingTasks();

            return {
                messages: [{role: "user",
                        content: {
                            type: "text",
                            text: `You are a productivity planner.

Create a realistic 7-day schedule.
Constraints:
- ${available_hours} hours available daily
- High priority first
- Respect due dates
- Group similar tasks
- Avoid overload

Format:
Day 1 → tasks
Day 2 → tasks

${"─".repeat(40)}
PENDING TASKS
${"─".repeat(40)}
${pending}`,
                        },
                    },
                ],
            };
        }
    );
}