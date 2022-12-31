import { Schema, model } from 'mongoose';
import UserType from '../user/user.type';

export interface IUser {
  _id: Schema.Types.ObjectId;
  username: string;
  passwordHash: string;
  email: string;
  createdAt: Date;
  type: UserType;
}

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  createdAt: { type: Date, required: true, default: Date.now },
  type: { type: Number, required: true, index: true },
});

export const User = model<IUser>('User', UserSchema);
