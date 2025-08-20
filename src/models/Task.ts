import mongoose, { Schema, Model } from "mongoose";

export interface ITask {
  projectId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  assignedToId?: mongoose.Types.ObjectId;
  status: "todo" | "in_progress" | "done";
  createdAt: Date;
}

export interface ITaskDocument extends ITask, mongoose.Document {}

const TaskSchema = new Schema<ITaskDocument>({
  projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
  title: { type: String, required: true },
  description: { type: String },
  assignedToId: { type: Schema.Types.ObjectId, ref: "User" },
  status: { type: String, enum: ["todo", "in_progress", "done"], default: "todo" },
  createdAt: { type: Date, default: Date.now },
});

export const Task: Model<ITaskDocument> =
  (mongoose.models.Task as Model<ITaskDocument>) ||
  mongoose.model<ITaskDocument>("Task", TaskSchema);


