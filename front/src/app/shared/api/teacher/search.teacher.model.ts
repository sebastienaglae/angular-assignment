import { Teacher } from '../../models/teacher.model';

export class SearchTeacher {
  page!: number;
  totalPages!: number;
  totalItems!: number;
  items!: Teacher[];
  hasNext!: boolean;
  hasPrevious!: boolean;
}
