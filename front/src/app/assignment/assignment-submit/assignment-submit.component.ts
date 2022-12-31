import { ThisReceiver } from '@angular/compiler';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
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
import { Utils } from 'src/app/shared/tools/Utils';

@Component({
  selector: 'app-assignment-submit',
  templateUrl: './assignment-submit.component.html',
  styleUrls: ['./assignment-submit.component.css'],
})
export class AssignmentSubmitComponent extends BaseComponent {
  submitForm = new SubmitFormGroup();
  assignmentTarget?: Assignment;
  subjectTarget?: Subject;

  constructor(
    private route: ActivatedRoute,
    private assignementService: AssignmentService,
    private loggingService: LoggingService,
    private subjectsService: SubjectsService,
    snackBar: MatSnackBar,
    loadingService: LoadingService
  ) {
    super(loadingService, snackBar);
    this.loadingState(true);
  }

  onInit() {
    this.getAssignment();
  }

  // Fonction qui permet de récupérer l'assignment
  getAssignment() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.assignementService.get(id).subscribe((data) => {
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
    //todo : check if assignment is not already submitted
    if (assData.subjectId == null) return;
    this.subjectsService.get(assData.subjectId).subscribe((subData) => {
      this.handleSubject(subData);
    });
  }

  // Fonction qui permet de récupérer le sujet
  handleSubject(subData: Subject | ErrorRequest) {
    if (subData instanceof ErrorRequest) {
      this.handleError(subData);
      return;
    }

    this.subjectTarget = subData;
    this.loadingState(false)
  }

  // Fonction qui permet de soumettre le rendu
  submit() {
    this.loggingService.event('AssignmentSubmitComponent', 'submit');
    const file = this.submitForm.file;
    if (file == null) return;
    Utils.fileToArrayBuffer(file, (buffer) =>
      this.handleSubmission(file, buffer)
    );
  }

  // Fonction qui permet de créer le rendu
  handleSubmission(file: File, buffer: Buffer) {
    this.loggingService.event('AssignmentSubmitComponent', 'handleSubmission');
    if (this.assignmentTarget == null) return;
    this.loadingState(true)

    const sub = Submission.createSubmission(file, buffer);

    this.assignementService
      .updateSubmission(this.assignmentTarget.id, sub, file)
      .subscribe((data) => {
        this.handleUpdate(data);
      });
  }

  // Fonction qui permet de gérer la réponse de la création du rendu
  handleUpdate(data: ErrorRequest | SuccessRequest) {
    if (data instanceof ErrorRequest) {
      this.loggingService.event(
        'AssignmentSubmitComponent',
        'handleUpdateError'
      );
      this.handleErrorSoft(data);
      return;
    }
    if (!data.success) {
      this.handleErrorSoft('Erreur inconnue');
      return;
    }

    Utils.snackBarSuccess(this._snackBar, 'Votre devoir a bien été envoyé !');
    this.loadingState(false)
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
