import { Assignment } from '../../models/assignment.model';
import { ErrorRequest } from '../error.model';

export class ResultAssignment {
  result!: Assignment;
  error!: ErrorRequest;
}
