import { Assignment } from '../../assignment.model';
import { ErrorAssignment } from './error.model';

export class ResultAssignment {
  result!: Assignment;
  error!: ErrorAssignment;
}
