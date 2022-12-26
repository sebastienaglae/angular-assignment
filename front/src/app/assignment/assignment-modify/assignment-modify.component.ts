import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AssignmentService } from 'src/app/shared/services/assignment/assignment.service';
import { Assignment } from 'src/app/shared/assignment.model';

@Component({
  selector: 'app-assignment-modify',
  templateUrl: './assignment-modify.component.html',
  styleUrls: ['./assignment-modify.component.css'],
})
export class AssignmentModifyComponent implements OnInit {
  currentAssignment: Assignment | undefined = new Assignment();

  constructor(
    private route: ActivatedRoute,
    private assignementService: AssignmentService
  ) {
    this.getAssignment();
  }

  getAssignment() {
    const id = this.route.snapshot.paramMap.get('id');
    // if (id) {
    //   this.assignementService
    //     .getAssignment(id)
    //     .subscribe((data) => (this.currentAssignment = data));
    // }
    //todo: get assignment from id
  }

  ngOnInit(): void {}

  onEdit() {
    this.assignementService
      .updateAssignment(this.currentAssignment)
      .subscribe((message) => console.log(message));
  }
}
