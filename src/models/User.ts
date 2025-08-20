import mongoose, { Schema, Model } from "mongoose";

export interface IUser {
  email: string;
  name: string;
  passwordHash: string;
  role: "user" | "admin";
  createdAt: Date;
}

export interface IUserDocument extends IUser, mongoose.Document {}

const UserSchema = new Schema<IUserDocument>({
  email: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  createdAt: { type: Date, default: Date.now },
});

export const User: Model<IUserDocument> =
  (mongoose.models.User as Model<IUserDocument>) ||
  mongoose.model<IUserDocument>("User", UserSchema);


