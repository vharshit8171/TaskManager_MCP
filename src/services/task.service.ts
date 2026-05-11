import type z from "zod";
import { Task } from "../models/Task.model.js";
import type { CreateTaskSchema, ListTasksSchema, UpdateTaskSchema, SetPrioritySchema, SetDueDateSchema, ListByCategorySchema, SearchTasksSchema } from "../validations/Task.validation.js";

//  Helper — convert a Mongoose document to readable text
function format(task: any): string {
    return task.toReadableString();
}

type CreateTaskData = z.infer<typeof CreateTaskSchema>
type ListTasksData = z.infer<typeof ListTasksSchema>
type UpdateTaskData = z.infer<typeof UpdateTaskSchema>
type SetPriorityData = z.infer<typeof SetPrioritySchema>
type SetDueDateData = z.infer<typeof SetDueDateSchema>
type ListByCategoryData = z.infer<typeof ListByCategorySchema>
type SearchTasksData = z.infer<typeof SearchTasksSchema>

export async function createTask(data: CreateTaskData): Promise<string> {
    try {
        const task = await Task.create({
            title: data.title,
            description: data.description ?? "",
            category: data.category ?? "general",
            priority: data.priority ?? "medium",
            dueDate: data.dueDate ? new Date(data.dueDate) : null,
        });

        return [
            "Task created successfully!",
            `ID:       ${task._id}`,
            `Title:    ${task.title}`,
            `Category: ${task.category}`,
            `Priority: ${task.priority}`,
            `Due:      ${task.dueDate ? new Date(task.dueDate).toDateString() : "Not set"}`,
        ].join("\n");
    } catch (err: any) {
        return `Failed to create task: ${err.message}`;
    }
}


export async function getTask(id: string): Promise<string> {
    try {
        const task = await Task.findById(id);
        if (!task) return `No task found with ID: ${id}`;
        return format(task);
    } catch {
        return `Invalid task ID: "${id}". Must be a 24-character MongoDB ObjectId.`;
    }
}


export async function listTasks(filter: ListTasksData): Promise<string> {
    try {
        const query: Record<string, any> = {};
        if (filter?.status) query.status = filter.status;
        if (filter?.priority) query.priority = filter.priority;

        const tasks = await Task.find(query).sort({ createdAt: -1 });

        if (tasks.length === 0) {
            const filterDesc = filter?.status || filter?.priority
                ? ` matching the given filters`
                : "";
            return `No tasks found${filterDesc}.`;
        }

        const header = `Found ${tasks.length} task(s):\n${"─".repeat(32)}\n`;
        return header + tasks.map(format).join("\n");
    } catch (err: any) {
        return `Failed to list tasks: ${err.message}`;
    }
}


export async function updateTask(id: string,
    updates: Omit<UpdateTaskData, 'id'>
): Promise<string> {
    try {
        // Filter out undefined values so we don't overwrite with undefined
        const cleanUpdates = Object.fromEntries(
            Object.entries(updates).filter(([, v]) => v !== undefined)
        );

        if (Object.keys(cleanUpdates).length === 0) {
            return "No updates provided. Please pass at least one field to update.";
        }

        const task = await Task.findByIdAndUpdate(
            id,
            { $set: cleanUpdates },
            { new: true, runValidators: true }   // return updated doc, run schema validators
        );

        if (!task) return `No task found with ID: ${id}`;

        return ["Task updated successfully!",format(task),].join("\n");
    } catch (err: any) {
        return `Failed to update task: ${err.message}`;
    }
}


export async function deleteTask(id: string): Promise<string> {
    try {
        const task = await Task.findByIdAndDelete(id);
        if (!task) return `No task found with ID: ${id}`;
        return `Task "${task.title}" (ID: ${id}) deleted permanently.`;
    } catch {
        return `Invalid task ID: "${id}".`;
    }
}


export async function completeTask(id: string): Promise<string> {
    try {
        const task = await Task.findByIdAndUpdate(
            id,
            { $set: { status: "completed" } },
            { new: true }
        );
        if (!task) return `No task found with ID: ${id}`;
        return `✓ Task "${task.title}" marked as completed!`;
    } catch {
        return `Invalid task ID: "${id}".`;
    }
}


export async function setPriority(data: SetPriorityData): Promise<string> {
    try {
        const task = await Task.findByIdAndUpdate(
            data.id,
            { $set: { priority: data.priority } },
            { new: true }
        );
        if (!task) return `No task found with ID: ${data.id}`;
        return `Priority of "${task.title}" updated to "${data.priority}".`;
    } catch {
        return `Invalid task ID: "${data.id}".`;
    }
}


export async function setDueDate(data: SetDueDateData): Promise<string> {
    try {
        const parsed = new Date(data.dueDate);
        if (isNaN(parsed.getTime())) {
            return `Invalid date format: "${data.dueDate}". Try something like 2025-12-31.`;
        }

        const task = await Task.findByIdAndUpdate(
            data.id,
            { $set: { dueDate: parsed } },
            { new: true }
        );
        if (!task) return `No task found with ID: ${data.id}`;
        return `Due date of "${task.title}" set to ${parsed.toDateString()}.`;
    } catch {
        return `Invalid task ID: "${data.id}".`;
    }
}


export async function listByCategory(data: ListByCategoryData): Promise<string> {
    try {
        const tasks = await Task.find({
            category: { $regex: new RegExp(data.category, "i") },
        }).sort({ priority: 1, createdAt: -1 });

        if (tasks.length === 0)
            return `No tasks found in category "${data.category}".`;

        const header = `Tasks in category "${data.category}" (${tasks.length}):\n${"─".repeat(32)}\n`;
        return header + tasks.map(format).join("\n");
    } catch (err: any) {
        return `Failed to list by category: ${err.message}`;
    }
}


export async function searchTasks(data: SearchTasksData): Promise<string> {
    try {
        const regex = new RegExp(data.keyword, "i");
        const tasks = await Task.find({
            $or: [
                { title: { $regex: regex } },
                { description: { $regex: regex } },
                { category: { $regex: regex } },
            ],
        }).sort({ createdAt: -1 });

        if (tasks.length === 0)
            return `No tasks found matching "${data.keyword}".`;

        const header = `Found ${tasks.length} task(s) matching "${data.keyword}":\n${"─".repeat(32)}\n`;
        return header + tasks.map(format).join("\n");
    } catch (err: any) {
        return `Search failed: ${err.message}`;
    }
}

// ─────────────────────────────────────────────────────────────
//  SUMMARY — used by Resource and daily-briefing Prompt
// ─────────────────────────────────────────────────────────────
export async function getTaskSummary(): Promise<string> {
    try {
        const [total, pending, completed, highPriority, overdue] =
            await Promise.all([
                Task.countDocuments(),
                Task.countDocuments({ status: "pending" }),
                Task.countDocuments({ status: "completed" }),
                Task.countDocuments({ priority: "high", status: "pending" }),
                Task.countDocuments({
                    dueDate: { $lt: new Date() },
                    status: "pending",
                }),
            ]);

        return [
            "TASK DASHBOARD",
            "─".repeat(30),
            `Total tasks:        ${total}`,
            `Pending:            ${pending}`,
            `Completed:          ${completed}`,
            `High priority:      ${highPriority}`,
            `Overdue:            ${overdue}`,
            `Last refreshed:     ${new Date().toLocaleString()}`,
        ].join("\n");
    } catch (err: any) {
        return `Could not load summary: ${err.message}`;
    }
}

// ─────────────────────────────────────────────────────────────
//  OVERDUE — used by Resource and daily-briefing Prompt
// ─────────────────────────────────────────────────────────────
export async function getOverdueTasks(): Promise<string> {
    try {
        const tasks = await Task.find({
            dueDate: { $lt: new Date() },
            status: "pending",
        }).sort({ dueDate: 1 });

        if (tasks.length === 0)
            return "No overdue tasks. You are all caught up!";

        const header = `OVERDUE TASKS (${tasks.length})\n${"─".repeat(32)}\n`;
        return header + tasks.map(format).join("\n");
    } catch (err: any) {
        return `Could not load overdue tasks: ${err.message}`;
    }
}

// ─────────────────────────────────────────────────────────────
//  PENDING LIST — used by Prompts
// ─────────────────────────────────────────────────────────────
export async function getPendingTasks(): Promise<string> {
    return listTasks({ status: "pending" });
}