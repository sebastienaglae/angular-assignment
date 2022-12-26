import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Assignment } from 'src/app/shared/assignment.model';
import { AuthService } from 'src/app/shared/auth.service';
import { AssignmentService } from 'src/app/assignment.service';

@Component({
  selector: 'app-assignment-detail',
  templateUrl: './assignment-detail.component.html',
  styleUrls: ['./assignment-detail.component.css'],
})
export class AssignmentDetailComponent implements OnInit {
  @Input() assignmentTarget: Assignment | undefined;
  @Output() deleteAssignement = new EventEmitter<Assignment>();

  isAssignmentLate: boolean = false;
  assignmentTimeRemaining: string = '';

  teacherImgPath!: string;
  subjectImgPath!: string;

  constructor(
    private assignementService: AssignmentService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.getAssignment();
  }

  getAssignment() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.assignementService.getAssignment(id).subscribe((data) => {
        if (data) {
          //Todo in case of error
          this.assignmentTarget = data.result;
          this.isAssignmentLate = Assignment.isTooLate(data.result);
          this.assignmentTimeRemaining = Assignment.getTimeRemaining(
            data.result
          );
        }
      });
    }
  }

  onChange(event: any) {
    let checkbox = event.target as HTMLInputElement;
    // clone assignement
    let tmp = this.assignmentTarget;
    if (tmp) {
      tmp.rendu = checkbox.checked;
      this.assignementService
        .updateAssignment(tmp)
        .subscribe((message) => console.log(message));
    }
  }

  isAdmin(): boolean {
    return this.authService.loggedIn;
  }

  onEdit() {
    this.router.navigate(['/assignment', this.assignmentTarget?._id, 'edit'], {
      queryParams: { name: this.assignmentTarget?.title },
      fragment: 'edition',
    });
  }

  onDelete() {
    if (!this.assignmentTarget) return;
    this.assignementService
      .deleteAssignment(this.assignmentTarget)
      .subscribe((data) => {
        console.log(data);
      });
    this.assignmentTarget = undefined;
  }
}
