import { Assignment } from '../../models/assignment.model';

export class SearchAssignment {
  page!: number;
  totalPages!: number;
  totalItems!: number;
  items!: Assignment[];
  hasNext!: boolean;
  hasPrevious!: boolean;
}
