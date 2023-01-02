import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Assignment } from 'src/app/shared/models/assignment.model';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { AssignmentService } from 'src/app/shared/services/assignment/assignment.service';
import { SubjectsService } from 'src/app/shared/services/subject/subjects.service';
import { Subject } from 'src/app/shared/models/subject.model';
import { Submission } from 'src/app/shared/models/submission.model';
import { Utils } from 'src/app/shared/utils/Utils';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorRequest } from 'src/app/shared/api/error.model';
import { SuccessRequest } from 'src/app/shared/api/success.model';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { LoadingService } from 'src/app/shared/services/loading/loading.service';
import { BaseComponent } from 'src/app/base/base.component';
import { Teacher } from 'src/app/shared/models/teacher.model';
import { TeacherService } from 'src/app/shared/services/teacher/teacher.service';
import { LoggingService } from 'src/app/shared/services/logging/logging.service';
import { MatDialog } from '@angular/material/dialog';
import { BottomSheetAssignmentOptions } from './bottomSheetOptions/assignment-options.sheet';

@Component({
  selector: 'app-assignment-detail',
  templateUrl: './assignment-detail.component.html',
  styleUrls: ['./assignment-detail.component.css'],
})
export class AssignmentDetailComponent extends BaseComponent implements OnInit {
  // Informations sur l'assignment
  assignmentTarget?: Assignment;
  isAssignmentLate: boolean = false;
  assignmentTimeRemaining: string = '';
  finishLoadCount: number = 0;

  // Fichier de l'assignment
  file: File | undefined;

  targetSubject?: Subject;
  targetTeacher?: Teacher;

  constructor(
    private _assignementService: AssignmentService,
    private _subjectsService: SubjectsService,
    private _route: ActivatedRoute,
    private _teacherService: TeacherService,
    private _bottomSheet: MatBottomSheet,
    loadingService: LoadingService,
    snackBar: MatSnackBar,
    loggingService: LoggingService,
    dialog: MatDialog
  ) {
    super(loadingService, snackBar, loggingService, dialog);
    this.loadingState(true);
  }

  ngOnInit(): void {
    this.getAssignment();
  }

  // Ouvre le bottom sheet pour les options de l'assignment
  openBottomSheet(): void {
    this._loggingService.event();
    this._bottomSheet
      .open(BottomSheetAssignmentOptions, {
        data: {
          assignmentTarget: this.assignmentTarget,
        },
      })
      .afterDismissed()
      .subscribe((data) => {
        const action = data as string;
        if (action === 'delete') this.deleteRedirect();
        this._loggingService.event(action);
      });
  }

  // Recupere l'assignment
  getAssignment() {
    const id = this._route.snapshot.paramMap.get('id');
    this._loggingService.event(id ?? 'undefined');
    if (!id) {
      this.handleError("L'identifiant de l'assignment n'est pas valide ! ");
      return;
    }
    this._assignementService.get(id).subscribe((data) => {
      this.handleAssignmentResponse(data);
    });
  }

  isFinishLoad() {
    this.finishLoadCount++;
    if (this.finishLoadCount === 2) {
      this.loadingState(false);
    }
  }

  // Gere la reponse de l'api pour les assignments & les rendus & les matieres
  handleAssignmentResponse(assData: ErrorRequest | Assignment) {
    if (assData instanceof ErrorRequest) {
      this.handleError(assData);
      return;
    }

    this.assignmentTarget = assData;
    this.isAssignmentLate = Assignment.isTooLate(assData);
    this.assignmentTimeRemaining = Assignment.getTimeRemaining(assData);
    this.handleFileSubmission();
    if (assData.subjectId)
      this._subjectsService.get(assData.subjectId).subscribe((data) => {
        this.handleSubjectResponse(data);
      });

    if (assData.teacherId) {
      this._teacherService.get(assData.teacherId).subscribe((data) => {
        this.handleTeacherResponse(data);
      });
    }
  }

  // Obtient le fichier de l'assignment
  handleFileSubmission() {
    if (!this.assignmentTarget?.submission) return;
    this.file = Submission.getFile(this.assignmentTarget.submission);
    if (!this.file) {
      this.handleErrorSoft('Impossible de récupérer le fichier');
    }
  }

  // Gere la reponse de l'api pour les matieres
  handleSubjectResponse(subjectData: ErrorRequest | Subject) {
    if (subjectData instanceof ErrorRequest) {
      this.handleError(subjectData);
      return;
    }

    this.targetSubject = subjectData;
    this.isFinishLoad();
  }

  // Gere la reponse de l'api pour les enseignants
  handleTeacherResponse(teacherData: ErrorRequest | Teacher) {
    if (teacherData instanceof ErrorRequest) {
      this.handleError(teacherData);
      return;
    }

    this.targetTeacher = teacherData;
    this.isFinishLoad();
  }

  // Supprime l'assignment
  deleteRedirect() {
    this._loggingService.event();
    if (!this.assignmentTarget || !this.assignmentTarget.id) {
      this.handleErrorSoft("Impossible de supprimer l'assignment");
      return;
    }
    this._assignementService
      .delete(this.assignmentTarget?.id)
      .subscribe((data) => {
        this.handleDeleteAssignmentResponse(data);
      });
  }

  // Gestion de la suppression
  handleDeleteAssignmentResponse(data: ErrorRequest | SuccessRequest) {
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

  // Redirections vers la liste des assignments
  downloadSubmission() {
    if (!this.assignmentTarget || !this.assignmentTarget.submission) {
      this.handleErrorSoft('Impossible de télécharger le fichier');
      return;
    }
    Submission.downloadContentToUser(this.assignmentTarget);
  }
}
