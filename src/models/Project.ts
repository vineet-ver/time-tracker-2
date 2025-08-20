import mongoose, { Schema, Model } from "mongoose";

export interface IProject {
  name: string;
  description?: string;
  ownerId: mongoose.Types.ObjectId;
  memberIds: mongoose.Types.ObjectId[];
  createdAt: Date;
}

export interface IProjectDocument extends IProject, mongoose.Document {}

const ProjectSchema = new Schema<IProjectDocument>({
  name: { type: String, required: true },
  description: { type: String },
  ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  memberIds: [{ type: Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now },
});

export const Project: Model<IProjectDocument> =
  (mongoose.models.Project as Model<IProjectDocument>) ||
  mongoose.model<IProjectDocument>("Project", ProjectSchema);


