import mongoose, { Document, Schema } from "mongoose";

export interface ITask extends Document {
  name: string;
  description?: string;
  dueDate?: Date;
  createdBy?: mongoose.Types.ObjectId;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITask>(
  {
    name: {
      type: String,
      required: [true, "Task name is required"],
      trim: true,
      maxlength: [100, "Task name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    dueDate: {
      type: Date,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Creator user ID is required"],
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// Check if model already exists to avoid OverwriteModelError in development
const Task = mongoose.models.Task || mongoose.model<ITask>("Task", taskSchema);

export default Task;
