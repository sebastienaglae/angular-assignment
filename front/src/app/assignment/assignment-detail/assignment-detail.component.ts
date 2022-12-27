import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Assignment } from 'src/app/shared/models/assignment.model';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { AssignmentService } from 'src/app/shared/services/assignment/assignment.service';
import { ResultAssignment } from 'src/app/shared/api/assignment/result.assignment.model';
import { SubjectsService } from 'src/app/shared/services/subject/subjects.service';
import { Subject } from 'src/app/shared/models/subject.model';

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

  subject!: Subject;
  teacherImgPath!: string;
  subjectImgPath!: string;

  constructor(
    private assignementService: AssignmentService,
    private subjectsService: SubjectsService,
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
      this.assignementService.get(id).subscribe((data) => {
        if (!data) return;
        if (data.error) return;
        const assResult = data as any as Assignment;
        this.assignmentTarget = assResult;
        this.isAssignmentLate = Assignment.isTooLate(assResult);
        this.assignmentTimeRemaining = Assignment.getTimeRemaining(assResult);
        this.subjectsService.get(assResult.subjectId).subscribe((data) => {
          if (!data) return;
          if (data.error) return;
          this.subject = data as any as Subject;
          //todo : get teacher img path
          //this.subjectImgPath = subjectResult.imgPath;
        });
      });
    }
  }

  onChange(event: any) {
    let checkbox = event.target as HTMLInputElement;
    // clone assignement
    let tmp = this.assignmentTarget;
    if (tmp) {
      tmp.submission = checkbox.checked;
      this.assignementService
        .updateAssignment(tmp)
        .subscribe((message) => console.log(message));
    }
  }

  isAdmin(): boolean {
    throw new Error('Method not implemented.');
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
      .delete(this.assignmentTarget._id)
      .subscribe((data) => {
        console.log(data);
      });
    this.assignmentTarget = undefined;
  }
}
