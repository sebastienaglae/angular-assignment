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

  ngOnInit(): void {}

  onGen() {
    for (let i = 0; i < 10; i++) {
      let tmp = new Assignment();
      tmp.nom = 'Assignment';
      tmp.dateDeRendu = new Date();
      tmp.rendu = false;
      this.assignementService.addAssignment(tmp).subscribe((data) => {
        this.assignmentsAdded.push((data as any).message);
      });
    }
  }
}
