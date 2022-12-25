import { Component, OnInit } from '@angular/core';
import { AssignmentService } from 'src/app/assignment.service';
import { Assignment } from 'src/app/shared/assignment.model';

@Component({
  selector: 'app-assignment-gen',
  templateUrl: './assignment-gen.component.html',
  styleUrls: ['./assignment-gen.component.css'],
})
export class AssignmentGenComponent implements OnInit {
  constructor(private assignementService: AssignmentService) {}
  assignmentsAdded: string[] = [];
  agtCount: number = 10;

  ngOnInit(): void {}

  onGen() {
    for (let i = 0; i < this.agtCount; i++) {
      this.assignementService
        .addAssignment(Assignment.random())
        .subscribe((data) => {
          this.assignmentsAdded.push((data as any).message);
        });
    }
  }

  deleteAll() {
    this.assignementService.deleteAll();
  }
}
