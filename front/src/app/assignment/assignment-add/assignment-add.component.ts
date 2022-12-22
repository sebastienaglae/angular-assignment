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
  submitDate: Date = new Date();
  constructor(private assignmentService: AssignmentService) {}

  ngOnInit(): void {}

  onSubmit(event: any) {
    let tmp = new Assignment();
    tmp.nom = this.name;
    tmp.dateDeRendu = this.submitDate;
    tmp.rendu = false;

    this.assignmentService.addAssignment(tmp);
  }
}
