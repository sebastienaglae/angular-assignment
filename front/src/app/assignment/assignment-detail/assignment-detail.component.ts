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
import { SuccessRequest } from 'src/app/shared/api/success.model';
import { SizePipe } from 'src/app/shared/tools/SizePipe';

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
  ) { }

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
    this.handleFileSubmission();
    //todo : subject check
    if (assData.subjectId)
      this.subjectsService.get(assData.subjectId).subscribe((data) => {
        if (!data) return;
        this.targetSubject = data as any as Subject;
        //todo : get teacher img path
        //this.subjectImgPath = subjectResult.imgPath;
        this.isLoading = false;
      });
  }

  handleFileSubmission() {
    if (!this.assignmentTarget?.submission) return;
    this.file = Submission.getFile(this.assignmentTarget.submission);
    if (!this.file) {
      Utils.snackBarError(this._snackBar, 'Impossible de récupérer le fichier');
    }
  }

  isAdmin(): boolean {
    throw new Error('Method not implemented.');
  }

  teacherRedirect() {
    this.router.navigate(['/teacher', this.assignmentTarget?.teacherId]);
  }

  submitRedirect() {
    this.router.navigate(['/assignment', this.assignmentTarget?.id, 'submit']);
  }

  ratingRedirect() {
    this.router.navigate(['/assignment', this.assignmentTarget?.id, 'rate']);
  }

  editRedirect() {
    this.router.navigate(['/assignment', this.assignmentTarget?.id, 'edit']);
  }

  deleteRedirect() {
    if (!this.assignmentTarget) return;
    if (!this.assignmentTarget.id) return;
    this.assignementService.delete(this.assignmentTarget?.id).subscribe((data) => {
      this.handleDeleteAssignment(data);
    });

  }

  handleDeleteAssignment(data: ErrorRequest | SuccessRequest) {
    if (data instanceof ErrorRequest) {
      Utils.snackBarError(this._snackBar, data);
      return;
    }
    if (!data.success) {
      Utils.snackBarError(this._snackBar, 'Erreur lors de la suppression');
      return;
    }
    Utils.snackBarSuccess(this._snackBar, 'Suppression réussie');
  }


  downloadSubmission() {
    if (!this.assignmentTarget) return;
    if (!this.assignmentTarget.submission) return;
    Submission.downloadContentToUser(this.assignmentTarget);
  }
}
