import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
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
export class AssignmentRateComponent {
  rateForm: RateFormGroup = new RateFormGroup();
  loading: boolean = false;
  assignmentId!: string | null;
  assignmentTarget?: Assignment;

  constructor(
    private loggingService: LoggingService,
    private assignmentService: AssignmentService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private loadingService: LoadingService,
    private _snackBar: MatSnackBar,
  ) {
    this.loading = this.loadingService.changeLoadingState(true);
  }

  ngOnInit(): void {
    this.getAssignment();
  }

  getAssignment() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.assignmentService.get(id).subscribe((data) => {
        this.handleAssignment(data);
      });
    }
  }

  handleAssignment(assData: ErrorRequest | Assignment) {
    if (assData instanceof ErrorRequest) {
      Utils.frontError(this._snackBar, assData, this.loadingService);
      return;
    }

    this.assignmentTarget = assData;
    this.loading = this.loadingService.changeLoadingState(false);
  }

  onUpdatingRate() {
    if (this.assignmentId === null) return;
    let rating = Rating.createRating(this.rateForm.rateValue, this.rateForm.commentValue);
    this.assignmentService.updateRating(
      this.assignmentId,
      rating,
    ).subscribe((res) => {
      this.handleRate(res)
    });
  }

  handleRate(data: SuccessRequest | ErrorRequest) {
    if (data instanceof ErrorRequest) {
      Utils.frontError(this.snackBar, data, this.loadingService);
      return;
    }
    if (data.success) {
      Utils.snackBarSuccess(this.snackBar, "Votre note a bien été prise en compte");
    }
    else {
      Utils.frontError(this.snackBar, "Une erreur est survenue", this.loadingService);
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
