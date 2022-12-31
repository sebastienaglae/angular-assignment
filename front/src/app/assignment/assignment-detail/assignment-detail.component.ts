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
export class AssignmentDetailComponent implements OnInit {
  assignmentTarget?: Assignment;
  file: File | undefined;
  isAssignmentLate: boolean = false;
  assignmentTimeRemaining: string = '';
  loading: boolean = true;

  targetSubject?: Subject;
  teacherImgPath!: string;
  subjectImgPath!: string;

  constructor(
    private assignementService: AssignmentService,
    private subjectsService: SubjectsService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private _snackBar: MatSnackBar,
    private _bottomSheet: MatBottomSheet,
    private loadingService: LoadingService
  ) {
    this.loading = this.loadingService.changeLoadingState(true);
  }

  ngOnInit(): void {
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
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.assignementService.get(id).subscribe((data) => {
        this.handleAssignment(data);
      });
    }
  }

  handleAssignment(assData: ErrorRequest | Assignment) {
    if (!assData) {
      Utils.frontError(this._snackBar, 'Erreur inconue', this.loadingService);
      return;
    }
    if (assData instanceof ErrorRequest) {
      Utils.frontError(this._snackBar, assData, this.loadingService);
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
        this.loading = this.loadingService.changeLoadingState(false);
      });
  }

  handleFileSubmission() {
    if (!this.assignmentTarget?.submission) return;
    this.file = Submission.getFile(this.assignmentTarget.submission);
    if (!this.file) {
      Utils.frontError(this._snackBar, 'Impossible de récupérer le fichier', this.loadingService);
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
      Utils.frontError(this._snackBar, data, this.loadingService);
      return;
    }
    if (!data.success) {
      Utils.frontError(this._snackBar, 'Erreur lors de la suppression', this.loadingService);
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
