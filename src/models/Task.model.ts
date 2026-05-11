import mongoose, { Document, Schema } from "mongoose";

// TypeScript interface — describes what a Task document looks like Used for type safety throughout the codebase
export interface ITask extends Document {
    title: string;
    description: string;
    category: string;
    priority: "low" | "medium" | "high";
    status: "pending" | "completed";
    dueDate: Date | null;
    createdAt: Date;
    updatedAt: Date;
    toReadableString(): string;  // method to format task for Claude
}


const TaskSchema = new Schema<ITask>({
    title: {
        type: String,
        required: [true, "Title is required"],
        trim: true,
        maxlength: [200, "Title cannot exceed 200 characters"],
    },

    description: {
        type: String,
        default: "",
        trim: true,
    },

    category: {
        type: String,
        default: "general",
        trim: true,
        lowercase: true,    // always stored in lowercase for consistent querying
    },

    priority: {
        type: String,
        enum: {
            values: ["low", "medium", "high"],
            message: "Priority must be low, medium or high",
        },
        default: "medium",
    },

    status: {
        type: String,
        enum: {
            values: ["pending", "completed"],
            message: "Status must be pending or completed",
        },
        default: "pending",
    },

    dueDate: {
        type: Date,
        default: null,
    },
},
    {
        timestamps: true,
    }
);


//  Indexes — speed up the most common queries

TaskSchema.index({ status: 1 });    // filter by status
TaskSchema.index({ priority: 1 });  // filter by priority
TaskSchema.index({ category: 1 });  // filter by category
TaskSchema.index({ dueDate: 1 });  // sort/filter by due date
TaskSchema.index({ createdAt: -1 });  // list newest first


//  Helper method on the model — formats a task as readable text for returning to Claude

TaskSchema.methods.toReadableString = function (): string {
    const due = this.dueDate
        ? new Date(this.dueDate).toDateString()
        : "No due date";

    return [
        `ID:          ${this._id}`,
        `Title:       ${this.title}`,
        `Description: ${this.description || "None"}`,
        `Category:    ${this.category}`,
        `Priority:    ${this.priority.toUpperCase()}`,
        `Status:      ${this.status}`,
        `Due:         ${due}`,
        `Created:     ${new Date(this.createdAt).toDateString()}`,
        "─────────────────────────────",
    ].join("\n");
};


export const Task = mongoose.model<ITask>("Task", TaskSchema);