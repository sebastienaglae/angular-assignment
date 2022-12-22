import { Component, OnInit } from '@angular/core';
import { AssignmentService } from '../assignment.service';
import { Assignment } from '../shared/assignment.model';

@Component({
  selector: 'app-assignment',
  templateUrl: './assignment.component.html',
  styleUrls: ['./assignment.component.css'],
})
export class AssignmentComponent implements OnInit {
  titre = 'Mon app sur les assignments';
  selectedAssignment: Assignment | undefined = undefined;
  // formVisible = false;
  assignments: Assignment[] = [];

  constructor(private assignementService: AssignmentService) {}

  ngOnInit(): void {
    this.getAssignments();
  }

  getAssignments() {
    this.assignementService
      .getAssignments()
      .subscribe((data) => (this.assignments = data));
  }

  onSelect(assignment: Assignment) {
    this.selectedAssignment = assignment;
  }

  onAddAssignment() {
    // this.formVisible = true;
  }

  onNewAssignment(assignment: Assignment) {
    // this.assignementService
    //   .addAssignment(assignment)
    //   .subscribe((message) => console.log(message));
    // this.formVisible = false;
  }

  onModifyAssignment(assignment: Assignment) {
    this.assignementService
      .updateAssignment(assignment)
      .subscribe((message) => console.log(message));
    // this.formVisible = false;
  }
}
