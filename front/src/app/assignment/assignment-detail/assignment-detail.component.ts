import { Component, OnInit } from '@angular/core';
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
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { LoadingService } from 'src/app/shared/services/loading/loading.service';
import { BaseComponent } from 'src/app/base/base.component';

@Component({
  selector: 'assignment-options.sheet',
  templateUrl: './assignment-options.sheet.html',
})
export class BottomSheetAssignmentOptions {
  constructor(private _bottomSheetRef: MatBottomSheetRef<AssignmentDetailComponent>) { }

  openLink(event: string): void {
    this._bottomSheetRef.dismiss(event);
  }
}

@Component({
  selector: 'app-assignment-detail',
  templateUrl: './assignment-detail.component.html',
  styleUrls: ['./assignment-detail.component.css'],
})
export class AssignmentDetailComponent extends BaseComponent {
  assignmentTarget?: Assignment;
  file: File | undefined;
  isAssignmentLate: boolean = false;
  assignmentTimeRemaining: string = '';
  targetSubject?: Subject;
  teacherImgPath!: string;
  subjectImgPath!: string;

  constructor(
    private _assignementService: AssignmentService,
    private _subjectsService: SubjectsService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _authService: AuthService,
    snackBar: MatSnackBar,
    private _bottomSheet: MatBottomSheet,
    loadingService: LoadingService
  ) {
    super(loadingService, snackBar);
    this.loadingState(true);
  }

  onInit(): void {
    this.getAssignment();
  }

  openBottomSheet(): void {
    this._bottomSheet.open(BottomSheetAssignmentOptions).afterDismissed().subscribe((data) => {
      const action = data as string;
      if (action === 'edit') this.editRedirect();
      if (action === 'delete') this.deleteRedirect();
      if (action === 'rate') this.ratingRedirect();
      if (action === 'submit') this.submitRedirect();
    }
    );
  }

  getAssignment() {
    const id = this._route.snapshot.paramMap.get('id');
    if (id) {
      this._assignementService.get(id).subscribe((data) => {
        this.handleAssignment(data);
      });
    }
  }

  handleAssignment(assData: ErrorRequest | Assignment) {
    if (!assData) {
      this.handleError('Erreur inconue');
      return;
    }
    if (assData instanceof ErrorRequest) {
      this.handleError(assData);
      return;
    }

    this.assignmentTarget = assData;
    this.isAssignmentLate = Assignment.isTooLate(assData);
    this.assignmentTimeRemaining = Assignment.getTimeRemaining(assData);
    this.handleFileSubmission();
    //todo : subject check
    if (assData.subjectId)
      this._subjectsService.get(assData.subjectId).subscribe((data) => {
        if (!data) return;
        this.targetSubject = data as any as Subject;
        //todo : get teacher img path
        //this.subjectImgPath = subjectResult.imgPath;
        this.loadingState(false);
      });
  }

  handleFileSubmission() {
    if (!this.assignmentTarget?.submission) return;
    this.file = Submission.getFile(this.assignmentTarget.submission);
    if (!this.file) {
      this.handleErrorSoft('Impossible de récupérer le fichier')
    }
  }

  isAdmin(): boolean {
    throw new Error('Method not implemented.');
  }

  teacherRedirect() {
    this._router.navigate(['/teacher', this.assignmentTarget?.teacherId]);
  }

  submitRedirect() {
    this._router.navigate(['/assignment', this.assignmentTarget?.id, 'submit']);
  }

  ratingRedirect() {
    this._router.navigate(['/assignment', this.assignmentTarget?.id, 'rate']);
  }

  editRedirect() {
    this._router.navigate(['/assignment', this.assignmentTarget?.id, 'edit']);
  }

  deleteRedirect() {
    if (!this.assignmentTarget) return;
    if (!this.assignmentTarget.id) return;
    this._assignementService.delete(this.assignmentTarget?.id).subscribe((data) => {
      this.handleDeleteAssignment(data);
    });

  }

  handleDeleteAssignment(data: ErrorRequest | SuccessRequest) {
    if (data instanceof ErrorRequest) {
      this.handleError(data);
      return;
    }
    if (!data.success) {
      this.handleErrorSoft('Erreur lors de la suppression');
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
