import { AssignmentSearch } from '../../models/assignment.search.model';

export class SearchAssignment {
  page!: number;
  totalPages!: number;
  totalItems!: number;
  items!: AssignmentSearch[];
  hasNext!: boolean;
  hasPrevious!: boolean;
}
