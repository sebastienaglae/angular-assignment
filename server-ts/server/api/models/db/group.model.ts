import { Schema, model } from 'mongoose';

interface IGroup {
  name: string;
  creator: Schema.Types.ObjectId;
  members: Schema.Types.ObjectId[];
}

const GroupSchema = new Schema<IGroup>({
  name: { type: String, required: true },
  creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
});
const Group = model<IGroup>('Group', GroupSchema);

export default Group;
