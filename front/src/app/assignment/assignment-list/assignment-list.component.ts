import { Component, OnInit } from '@angular/core';
import { AssignmentService } from 'src/app/assignment.service';
import { Assignment } from 'src/app/shared/assignment.model';

@Component({
  selector: 'app-assignment-list',
  templateUrl: './assignment-list.component.html',
  styleUrls: ['./assignment-list.component.css'],
})
export class AssignmentListComponent implements OnInit {
  assignments: Assignment[] = [];
  constructor(private assignmentService: AssignmentService) {}

  ngOnInit(): void {
    this.setupAssignment();
  }

  setupAssignment() {
    this.assignmentService
      .getAssignments()
      .subscribe((data) => (this.assignments = data.items));
  }
}
