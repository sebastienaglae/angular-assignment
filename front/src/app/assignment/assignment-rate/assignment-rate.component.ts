import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from 'src/app/base/base.component';
import { ErrorRequest } from 'src/app/shared/api/error.model';
import { SuccessRequest } from 'src/app/shared/api/success.model';
import { Assignment } from 'src/app/shared/models/assignment.model';
import { Rating } from 'src/app/shared/models/rating.model';
import { AssignmentService } from 'src/app/shared/services/assignment/assignment.service';
import { LoadingService } from 'src/app/shared/services/loading/loading.service';
import { LoggingService } from 'src/app/shared/services/logging/logging.service';
import { Utils } from 'src/app/shared/tools/Utils';

@Component({
  selector: 'app-assignment-rate',
  templateUrl: './assignment-rate.component.html',
  styleUrls: ['./assignment-rate.component.css'],
})
export class AssignmentRateComponent extends BaseComponent {
  rateForm: RateFormGroup = new RateFormGroup();
  assignmentId!: string | null;
  assignmentTarget?: Assignment;

  constructor(
    private _loggingService: LoggingService,
    private _assignmentService: AssignmentService,
    private _route: ActivatedRoute,
    snackBar: MatSnackBar,
    loadingService: LoadingService,
  ) {
    super(loadingService, snackBar);
    this.loadingState(true);
  }

  onInit(): void {
    this.getAssignment();
  }

  getAssignment() {
    const id = this._route.snapshot.paramMap.get('id');
    if (id) {
      this._assignmentService.get(id).subscribe((data) => {
        this.handleAssignment(data);
      });
    }
  }

  handleAssignment(assData: ErrorRequest | Assignment) {
    if (assData instanceof ErrorRequest) {
      this.handleError(assData)
      return;
    }

    this.assignmentTarget = assData;
    this.loadingState(false);
  }

  onUpdatingRate() {
    if (this.assignmentId === null) return;
    let rating = Rating.createRating(this.rateForm.rateValue, this.rateForm.commentValue);
    this._assignmentService.updateRating(
      this.assignmentId,
      rating,
    ).subscribe((res) => {
      this.handleRate(res)
    });
  }

  handleRate(data: SuccessRequest | ErrorRequest) {
    if (data instanceof ErrorRequest) {
      this.handleError(data);
      return;
    }
    if (data.success) {
      Utils.snackBarSuccess(this._snackBar, "Votre note a bien été prise en compte");
    }
    else {
      this.handleErrorSoft("Une erreur est survenue")
    }
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
