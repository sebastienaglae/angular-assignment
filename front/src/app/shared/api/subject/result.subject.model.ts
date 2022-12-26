import { Subject } from '../../models/subject.model';
import { ErrorRequest } from '../error.model';

export class ResultSubject {
  subject!: Subject;
  error!: ErrorRequest;
}
