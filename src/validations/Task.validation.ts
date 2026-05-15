import { z } from "zod";

export const TaskIdSchema = z
    .string()
    .length(24, "Task ID must be a valid 24-character MongoDB ObjectId")
    .describe("The MongoDB ObjectId of the task");

export const PrioritySchema = z
    .enum(["low", "medium", "high"])
    .describe("Priority level: low, medium, or high");

export const StatusSchema = z
    .enum(["pending", "completed"])
    .describe("Task status: pending or completed");

export const DueDateSchema = z
    .string()
    .describe("Due date in any readable format, e.g. 2025-12-31 or Dec 31 2025");


export const CreateTaskSchema = z.object({
    title: z
        .string()
        .min(1, "Title cannot be empty")
        .max(200, "Title too long")
        .describe("Title of the task, e.g. Submit project report"),
    description: z
        .string()
        .optional()
        .describe("Optional extra details about the task"),
    category: z
        .string()
        .optional()
        .describe("Category label e.g. work, personal, shopping, health"),
    priority: PrioritySchema.optional(),
    dueDate: DueDateSchema.optional(),
});


// get_task / delete_task / complete_task
export const TaskIdInputSchema = z.object({
    id: TaskIdSchema,
});


export const ListTasksSchema = z.object({
    status: StatusSchema.optional(),
    priority: PrioritySchema.optional(),
});


export const UpdateTaskSchema = z.object({
    id: TaskIdSchema,
    title: z.string().min(1).max(200).optional().describe("New title"),
    description: z.string().optional().describe("New description"),
    category: z.string().optional().describe("New category"),
});


export const SetPrioritySchema = z.object({
    id: TaskIdSchema,
    priority: PrioritySchema,
});


export const SetDueDateSchema = z.object({
    id: TaskIdSchema,
    dueDate: DueDateSchema,
});


export const ListByCategorySchema = z.object({
    category: z
        .string()
        .min(1)
        .describe("Category name to filter by, e.g. work"),
});


export const SearchTasksSchema = z.object({
    keyword: z
        .string()
        .min(1)
        .describe("Word or phrase to search across title, description and category"),
});


export const PlanMyWeekSchema = z.object({
    available_hours: z
        .string()
        .describe("How many hours per day you have available, e.g. 4"),
});