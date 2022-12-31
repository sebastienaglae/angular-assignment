import { Schema, model } from 'mongoose';

interface IDomain {
  name: string;
  iconUrl: string;
  createdAt: Date;
}

const DomainSchema = new Schema<IDomain>({
  name: { type: String, required: true, unique: true },
  iconUrl: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now },
});
const Domain = model<IDomain>('Domain', DomainSchema);

export default Domain;
