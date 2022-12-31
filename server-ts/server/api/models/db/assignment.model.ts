import { Schema, model } from 'mongoose';

interface IAssignment {
  creator: Schema.Types.ObjectId;
  domain: Schema.Types.ObjectId;
  group: Schema.Types.ObjectId;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  dueDate: Date;
}

const AssignmentSchema = new Schema<IAssignment>({
  creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  domain: { type: Schema.Types.ObjectId, ref: 'Domain', required: true },
  group: { type: Schema.Types.ObjectId, ref: 'Group', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now },
  updatedAt: { type: Date, required: true, default: Date.now },
  dueDate: { type: Date, required: true },
});
const Assignment = model<IAssignment>('Assignment', AssignmentSchema);

export default Assignment;
