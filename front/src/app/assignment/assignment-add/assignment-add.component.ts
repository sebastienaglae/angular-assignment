import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Assignment } from 'src/app/shared/assignment.model';
import { ActivatedRoute } from '@angular/router';
import { AssignmentService } from 'src/app/assignment.service';

@Component({
  selector: 'app-assignment-add',
  templateUrl: './assignment-add.component.html',
  styleUrls: ['./assignment-add.component.css'],
})
export class AssignmentAddComponent implements OnInit {
  @Output() newAssignment = new EventEmitter<Assignment>();
  name: string = '';
  author: string = '';
  subject: string = '';
  subjects = ['Math', 'Physics', 'Chemistry', 'Biology', 'History'];
  submitDate?: Date;
  messageError: string = '';
  constructor(private assignmentService: AssignmentService) {}

  ngOnInit(): void {}

  onSubmit(event: any) {
    event.preventDefault();
    if (this.name === '') {
      this.messageError = 'Please enter a name';
      return;
    }
    if (this.submitDate === undefined) {
      this.messageError = 'Please enter a date';
      return;
    }
    this.messageError = '';
    this.assignmentService.addAssignment(
      new Assignment(this.name, this.submitDate)
    );
    this.reset();
  }

  reset() {
    this.name = '';
    this.submitDate = undefined;
  }
}
