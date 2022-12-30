import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { ErrorRequest } from 'src/app/shared/api/error.model';
import { SuccessRequest } from 'src/app/shared/api/success.model';
import { Rating } from 'src/app/shared/models/rating.model';
import { AssignmentService } from 'src/app/shared/services/assignment/assignment.service';
import { LoggingService } from 'src/app/shared/services/logging/logging.service';
import { Utils } from 'src/app/shared/tools/Utils';

@Component({
  selector: 'app-assignment-rate',
  templateUrl: './assignment-rate.component.html',
  styleUrls: ['./assignment-rate.component.css'],
})
export class AssignmentRateComponent {
  rateForm: RateFormGroup = new RateFormGroup();
  isLoading: boolean = false;
  assignmentId!: string | null;

  constructor(
    private loggingService: LoggingService,
    private assignmentService: AssignmentService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.assignmentId = this.route.snapshot.paramMap.get('id')
  }

  onRate() {
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
      Utils.snackBarError(this.snackBar, data);
      return;
    }
    if (data.success) {
      Utils.snackBarSuccess(this.snackBar, "Votre note a bien été prise en compte");
    }
    else {
      Utils.snackBarError(this.snackBar, "Une erreur est survenue");
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
