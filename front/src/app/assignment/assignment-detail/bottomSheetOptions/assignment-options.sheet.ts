import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Assignment } from 'src/app/shared/models/assignment.model';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import {
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { LoggingService } from 'src/app/shared/services/logging/logging.service';
import { AssignmentDetailComponent } from '../assignment-detail.component';
import { ConfigService } from 'src/app/shared/services/config/config.service';

@Component({
  selector: 'assignment-options.sheet',
  templateUrl: './assignment-options.sheet.html',
})
export class BottomSheetAssignmentOptions implements OnInit {
  teacherEnabled: boolean = false;
  submitEnabled: boolean = false;
  rateEnabled: boolean = false;
  editEnabled: boolean = false;
  deleteEnabled: boolean = false;
  assignmentTarget?: Assignment;

  constructor(
    private _bottomSheetRef: MatBottomSheetRef<AssignmentDetailComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) private data: any,
    private _authService: AuthService,
    private _router: Router,
    private _loggingService: LoggingService,
    private _config: ConfigService
  ) {}

  ngOnInit(): void {
    this.assignmentTarget = this.data.assignmentTarget;
    this.teacherEnabled = this._authService.hasPermission(
      this._config.getPermsPath().getTeacher.path
    );
    this.submitEnabled = this._authService.hasPermission(
      this._config.getPermsPath().submitAss.path
    );
    this.rateEnabled = this._authService.hasPermission(
      this._config.getPermsPath().rateAss.path
    );
    this.editEnabled = this._authService.hasPermission(
      this._config.getPermsPath().editAss.path
    );
    this.deleteEnabled = this._authService.hasPermission(
      this._config.getPermsPath().deleteAss.path
    );
  }

  openLink(event: string): void {
    switch (event) {
      case 'teacher':
        this.teacherRedirect();
        break;
      case 'submit':
        this.submitRedirect();
        break;
      case 'rate':
        this.ratingRedirect();
        break;
      case 'edit':
        this.editRedirect();
        break;
    }
    this._bottomSheetRef.dismiss(event);
  }

  // Redirections vers le profile de l'enseignant
  teacherRedirect() {
    this._loggingService.event();
    this._router.navigate(['/teacher', this.assignmentTarget?.teacherId]);
  }

  // Redirections vers le rendu
  submitRedirect() {
    this._loggingService.event();
    this._router.navigate(['/assignment', this.assignmentTarget?.id, 'submit']);
  }

  // Redirections vers la notation
  ratingRedirect() {
    this._loggingService.event();
    this._router.navigate(['/assignment', this.assignmentTarget?.id, 'rate']);
  }

  // Redirections vers l'edition
  editRedirect() {
    this._loggingService.event();
    this._router.navigate(['/assignment', this.assignmentTarget?.id, 'edit']);
  }
}
