import { ThisReceiver } from '@angular/compiler';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { ErrorRequest } from 'src/app/shared/api/error.model';
import { SuccessRequest } from 'src/app/shared/api/success.model';
import { Assignment } from 'src/app/shared/models/assignment.model';
import { Subject } from 'src/app/shared/models/subject.model';
import { Submission } from 'src/app/shared/models/submission.model';
import { AssignmentService } from 'src/app/shared/services/assignment/assignment.service';
import { LoggingService } from 'src/app/shared/services/logging/logging.service';
import { SubjectsService } from 'src/app/shared/services/subject/subjects.service';
import { Utils } from 'src/app/shared/tools/Utils';

@Component({
  selector: 'app-assignment-submit',
  templateUrl: './assignment-submit.component.html',
  styleUrls: ['./assignment-submit.component.css'],
})
export class AssignmentSubmitComponent {
  submitForm = new SubmitFormGroup();
  assignmentTarget?: Assignment;
  subjectTarget?: Subject;
  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private assignementService: AssignmentService,
    private loggingService: LoggingService,
    private subjectsService: SubjectsService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit() {
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

  handleAssignment(assData: Assignment | ErrorRequest) {
    if (!assData) return;
    if (assData instanceof ErrorRequest) {
      Utils.snackBarError(this._snackBar, assData);
      return;
    }

    this.assignmentTarget = assData;
    this.subjectsService.get(assData.subjectId).subscribe((subData) => {
      this.handleSubject(subData);
    });
  }

  handleSubject(subData: Subject | ErrorRequest) {
    if (!subData) {
      Utils.snackBarError(this._snackBar, 'Erreur inconue');
      return;
    }
    if (subData instanceof ErrorRequest) {
      Utils.snackBarError(this._snackBar, subData);
      return;
    }

    this.subjectTarget = subData;
    this.isLoading = false;
  }

  submit() {
    this.loggingService.event('AssignmentSubmitComponent', 'submit');
    const file = this.submitForm.file;
    if (file == null) return;
    Utils.fileToArrayBuffer(file, (buffer) =>
      this.handleSubmission(file.type, buffer)
    );
  }

  handleSubmission(type: string, buffer: Buffer) {
    this.loggingService.event('AssignmentSubmitComponent', 'handleSubmission');
    if (this.assignmentTarget == null) return;

    Assignment.createSubmission(this.assignmentTarget, type, buffer);

    this.assignementService
      .updateAssignment(this.assignmentTarget)
      .subscribe((data) => {
        this.handleUpdate(data);
      });
  }

  handleUpdate(data: ErrorRequest | SuccessRequest) {
    console.log(data);
    if (data instanceof ErrorRequest) {
      this.loggingService.event(
        'AssignmentSubmitComponent',
        'handleUpdateError'
      );
      Utils.snackBarError(this._snackBar, data);
      return;
    }
    this.loggingService.event(
      'AssignmentSubmitComponent',
      'handleUpdateSuccess'
    );
    Utils.snackBarSuccess(this._snackBar, 'Votre devoir a bien été envoyé !');
  }
}

class SubmitFormGroup extends FormGroup {
  constructor() {
    super({
      fileCtrl: new FormControl('', [
        Validators.required,
        Validators.nullValidator,
      ]),
    });
  }

  get file(): File {
    return this.get('fileCtrl')?.value;
  }

  set file(value: File) {
    this.get('fileCtrl')?.setValue(value);
  }
}
