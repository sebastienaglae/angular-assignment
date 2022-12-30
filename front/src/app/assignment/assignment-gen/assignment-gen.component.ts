import { Component, OnInit } from '@angular/core';
import { AssignmentService } from 'src/app/shared/services/assignment/assignment.service';
import { Assignment } from 'src/app/shared/models/assignment.model';

@Component({
  selector: 'app-assignment-gen',
  templateUrl: './assignment-gen.component.html',
  styleUrls: ['./assignment-gen.component.css'],
})
export class AssignmentGenComponent implements OnInit {
  constructor(private assignementService: AssignmentService) { }
  assignmentsAdded: string[] = [];
  agtCount: number = 10;

  ngOnInit(): void { }

  onGen() {
    for (let i = 0; i < this.agtCount; i++) {
      this.assignementService.create(Assignment.random()).subscribe((data) => {
        this.assignmentsAdded.push((data as any).message);
      });
    }
  }

  deleteAll() {
    this.assignementService.deleteAll();
  }
}
