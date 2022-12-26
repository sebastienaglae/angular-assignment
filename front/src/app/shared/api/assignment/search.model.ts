import { Assignment } from '../../assignment.model';

export class SearchAssignment {
  page!: number;
  totalPages!: number;
  totalItems!: number;
  items!: Assignment[];
  hasNext!: boolean;
  hasPrevious!: boolean;
}