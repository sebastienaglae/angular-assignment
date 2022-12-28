import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Assignment } from 'src/app/shared/models/assignment.model';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { AssignmentService } from 'src/app/shared/services/assignment/assignment.service';
import { SubjectsService } from 'src/app/shared/services/subject/subjects.service';
import { Subject } from 'src/app/shared/models/subject.model';
import { Submission } from 'src/app/shared/models/submission.model';
import { Utils } from 'src/app/shared/tools/Utils';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorRequest } from 'src/app/shared/api/error.model';

@Component({
  selector: 'app-assignment-detail',
  templateUrl: './assignment-detail.component.html',
  styleUrls: ['./assignment-detail.component.css'],
})
export class AssignmentDetailComponent implements OnInit {
  @Output() deleteAssignement = new EventEmitter<Assignment>();
  assignmentTarget?: Assignment;
  isLoading: boolean = true;
  file: File | undefined;
  isAssignmentLate: boolean = false;
  assignmentTimeRemaining: string = '';

  targetSubject?: Subject;
  teacherImgPath!: string;
  subjectImgPath!: string;

  constructor(
    private assignementService: AssignmentService,
    private subjectsService: SubjectsService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getAssignment();
  }

  getAssignment() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.assignementService.get(id).subscribe((data) => {
        this.handleAssignment(data);
      });
    }
  }

  handleAssignment(assData: ErrorRequest | Assignment) {
    if (!assData) {
      Utils.snackBarError(this._snackBar, 'Erreur inconue');
      return;
    }
    if (assData instanceof ErrorRequest) {
      Utils.snackBarError(this._snackBar, assData);
      return;
    }

    this.assignmentTarget = assData;
    this.isAssignmentLate = Assignment.isTooLate(assData);
    this.assignmentTimeRemaining = Assignment.getTimeRemaining(assData);
    this.file = Submission.getFile(assData.submission);
    if (!this.file) {
      Utils.snackBarError(this._snackBar, 'Impossible de récupérer le fichier');
    }
    this.subjectsService.get(assData.subjectId).subscribe((data) => {
      if (!data) return;
      this.targetSubject = data as any as Subject;
      //todo : get teacher img path
      //this.subjectImgPath = subjectResult.imgPath;
      this.isLoading = false;
    });
  }

  isAdmin(): boolean {
    throw new Error('Method not implemented.');
  }

  onSubmit() {
    this.router.navigate(['/assignment', this.assignmentTarget?.id, 'submit']);
  }

  onEdit() {
    this.router.navigate(['/assignment', this.assignmentTarget?.id, 'edit']);
  }

  downloadSubmission() {
    if (!this.assignmentTarget) return;
    if (!this.assignmentTarget.submission) return;
    Submission.downloadContentToUser(this.assignmentTarget);
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
