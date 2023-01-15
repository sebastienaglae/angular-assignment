import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from 'src/app/base/base.component';
import { ErrorRequest } from 'src/app/shared/api/error.model';
import { SuccessRequest } from 'src/app/shared/api/success.model';
import { Assignment } from 'src/app/shared/models/assignment.model';
import { Rating } from 'src/app/shared/models/rating.model';
import { Submission } from 'src/app/shared/models/submission.model';
import { AssignmentService } from 'src/app/shared/services/assignment/assignment.service';
import { LoadingService } from 'src/app/shared/services/loading/loading.service';
import { LoggingService } from 'src/app/shared/services/logging/logging.service';
import { Utils } from 'src/app/shared/utils/Utils';

@Component({
  selector: 'app-assignment-rate',
  templateUrl: './assignment-rate.component.html',
  styleUrls: ['./assignment-rate.component.css'],
})
export class AssignmentRateComponent extends BaseComponent implements OnInit {
  rateForm: RateFormGroup = new RateFormGroup();
  assignmentId!: string | undefined;
  assignmentTarget?: Assignment;

  constructor(
    private _assignmentService: AssignmentService,
    private _route: ActivatedRoute,
    snackBar: MatSnackBar,
    loadingService: LoadingService,
    loggingService: LoggingService,
    dialog: MatDialog
  ) {
    super(loadingService, snackBar, loggingService, dialog);
    this.loadingState(true);
  }

  ngOnInit(): void {
    this.getAssignment();
  }

  // Fonction qui récupère l'assignment
  getAssignment() {
    const id = this._route.snapshot.paramMap.get('id');
    if (id) {
      this._assignmentService.get(id).subscribe((data) => {
        this.handleAssignment(data);
      });
    }
  }

  // Fonction qui gère la réponse de l'API
  handleAssignment(assData: ErrorRequest | Assignment) {
    if (assData instanceof ErrorRequest) {
      this.handleError(assData);
      return;
    }

    this.assignmentId = assData.id;
    this.assignmentTarget = assData;
    this.loadingState(false);
  }

  // Fonction qui met à jour la note
  onUpdatingRate() {
    if (this.assignmentId === undefined) return;
    this._loggingService.event();
    this.loadingStateNoUpdate(true);
    let rating = Rating.createRating(
      this.rateForm.rateValue,
      this.rateForm.commentValue
    );

    this._assignmentService
      .updateRating(this.assignmentId, rating)
      .subscribe((res) => {
        this.handleRate(res);
      });
  }

  // Fonction qui gère la réponse de l'API
  handleRate(data: SuccessRequest | ErrorRequest) {
    if (data instanceof ErrorRequest) {
      this.handleError(data);
      return;
    }
    if (data.success) {
      this.loadingStateNoUpdate(false);
      Utils.snackBarSuccess(
        this._snackBar,
        'Votre note a bien été prise en compte'
      );
    } else {
      this.handleErrorSoft('Une erreur est survenue');
    }
  }

  // Redirections vers la liste des assignments
  downloadSubmission() {
    if (this.assignmentId == null) {
      this.handleErrorSoft("Impossible de télécharger le fichier");
      return;
    }

    this._assignmentService.downloadSubmission(this.assignmentId).subscribe(
      (data) => {
        this.handleDownloadSubmissionResponse(data);
      },
      (error) => {
        this.handleErrorSoft(error);
      }
    );
  }

  handleDownloadSubmissionResponse(data: ErrorRequest | Blob) {
    if (data instanceof ErrorRequest) {
      this.handleError(data);
      return;
    }
    if (this.assignmentTarget == null) {
      this.handleErrorSoft("Impossible de télécharger le fichier");
      return;
    }

    const blob = data as Blob;
    Utils.downloadContentToUser(blob, this.assignmentTarget.submission);
  }

  openDialogDetails() {
    if (!this.assignmentTarget) {
      this.handleErrorSoft("Impossible d'afficher les détails");
      return;
    }
    this.openDialog(
      'Plus de détails',
      Utils.formatAssignment(this.assignmentTarget),
      false
    );
  }
}

class RateFormGroup extends FormGroup {
  constructor() {
    super({
      rateCtrl: new FormControl('', Rating.getRatingValidators()),
      commentCtrl: new FormControl('', Rating.getCommentValidators()),
    });
  }

  get rateValue() {
    return this.get('rateCtrl')?.value;
  }

  get commentValue() {
    return this.get('commentCtrl')?.value;
  }

  set rateValue(value: number) {
    this.get('rateCtrl')?.setValue(value);
  }

  set commentValue(value: string) {
    this.get('commentCtrl')?.setValue(value);
  }
}
