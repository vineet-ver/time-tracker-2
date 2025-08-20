import mongoose, { Schema, Model } from "mongoose";

export interface ITimeEntry {
  taskId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  startTime: Date;
  endTime?: Date; // if ongoing, endTime is undefined
  durationMinutes?: number; // for manual entries
  note?: string;
  createdAt: Date;
}

export interface ITimeEntryDocument extends ITimeEntry, mongoose.Document {}

const TimeEntrySchema = new Schema<ITimeEntryDocument>({
  taskId: { type: Schema.Types.ObjectId, ref: "Task", required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date },
  durationMinutes: { type: Number },
  note: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const TimeEntry: Model<ITimeEntryDocument> =
  (mongoose.models.TimeEntry as Model<ITimeEntryDocument>) ||
  mongoose.model<ITimeEntryDocument>("TimeEntry", TimeEntrySchema);


