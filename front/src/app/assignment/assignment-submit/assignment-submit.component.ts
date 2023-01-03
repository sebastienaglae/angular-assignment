import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from 'src/app/base/base.component';
import { ErrorRequest } from 'src/app/shared/api/error.model';
import { SuccessRequest } from 'src/app/shared/api/success.model';
import { Assignment } from 'src/app/shared/models/assignment.model';
import { Subject } from 'src/app/shared/models/subject.model';
import { Submission } from 'src/app/shared/models/submission.model';
import { AssignmentService } from 'src/app/shared/services/assignment/assignment.service';
import { LoadingService } from 'src/app/shared/services/loading/loading.service';
import { LoggingService } from 'src/app/shared/services/logging/logging.service';
import { SubjectsService } from 'src/app/shared/services/subject/subjects.service';
import { Utils } from 'src/app/shared/utils/Utils';

@Component({
  selector: 'app-assignment-submit',
  templateUrl: './assignment-submit.component.html',
  styleUrls: ['./assignment-submit.component.css'],
})
export class AssignmentSubmitComponent extends BaseComponent implements OnInit {
  submitForm = new SubmitFormGroup();
  assignmentTarget?: Assignment;
  subjectTarget?: Subject;
  locked: boolean = false;

  constructor(
    private _route: ActivatedRoute,
    private _assignementService: AssignmentService,
    private _subjectsService: SubjectsService,
    snackBar: MatSnackBar,
    loadingService: LoadingService,
    loggingService: LoggingService,
    dialog: MatDialog
  ) {
    super(loadingService, snackBar, loggingService, dialog);
    this.loadingState(true);
  }

  ngOnInit() {
    this.getAssignment();
  }

  // Fonction qui permet de récupérer l'assignment
  getAssignment() {
    const id = this._route.snapshot.paramMap.get('id');
    this._loggingService.event(id ?? 'undefined');
    if (id) {
      this._assignementService.get(id).subscribe((data) => {
        this.handleAssignment(data);
      });
    }
  }

  // Fonction qui permet de récupérer le sujet de l'assignment
  handleAssignment(assData: Assignment | ErrorRequest) {
    if (assData instanceof ErrorRequest) {
      this.handleError(assData);
      return;
    }

    this.assignmentTarget = assData;
    if (assData.subjectId == null) return;
    this._subjectsService.get(assData.subjectId).subscribe((subData) => {
      this.handleSubject(subData);
    });
  }

  checkSubmission(): boolean {
    if (this.assignmentTarget == null) return false;
    if (this.assignmentTarget.rating) {
      this.openDialog(
        'Deja noté',
        'Ce devoir a déjà une note, vous ne pouvez plus faire de rendu'
      );
      return false;
    }

    if (Assignment.isTooLate(this.assignmentTarget)) {
      this.openDialog('Trop tard', 'La date de rendu du devoir a été dépassé');
      return false;
    }

    return true;
  }

  // Fonction qui permet de récupérer le sujet
  handleSubject(subData: Subject | ErrorRequest) {
    if (subData instanceof ErrorRequest) {
      this.handleError(subData);
      return;
    }

    this.subjectTarget = subData;

    if (!this.checkSubmission()) {
      this.locked = true;
      this.loadingState(false);
      return;
    }

    this.loadingState(false);
  }

  // Fonction qui permet de soumettre le rendu
  submit() {
    this._loggingService.event();
    const file = this.submitForm.file;
    if (file == null) return;
    this.loadingStateNoUpdate(true);
    Utils.fileToArrayBuffer(file, (buffer) =>
      this.handleSubmission(file, buffer)
    );
  }

  // Fonction qui permet de créer le rendu
  handleSubmission(file: File, buffer: Buffer) {
    if (this.assignmentTarget == null) return;

    const sub = Submission.createSubmission(file, buffer);

    this._assignementService
      .updateSubmission(this.assignmentTarget.id, sub, file)
      .subscribe((data) => {
        this.handleUpdate(data);
      });
  }

  // Fonction qui permet de gérer la réponse de la création du rendu
  handleUpdate(data: ErrorRequest | SuccessRequest) {
    if (data instanceof ErrorRequest) {
      this.handleErrorSoft(data);
      return;
    }
    if (!data.success) {
      this.handleErrorSoft('Erreur inconnue');
      return;
    }

    Utils.snackBarSuccess(this._snackBar, 'Votre devoir a bien été envoyé !');
    this.loadingStateNoUpdate(false);
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
