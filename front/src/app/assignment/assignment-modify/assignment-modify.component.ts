import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AssignmentService } from 'src/app/shared/services/assignment/assignment.service';
import { Assignment } from 'src/app/shared/models/assignment.model';
import { Utils } from 'src/app/shared/tools/Utils';
import { ErrorRequest } from 'src/app/shared/api/error.model';
import { SubjectsService } from 'src/app/shared/services/subject/subjects.service';
import { Subject } from 'src/app/shared/models/subject.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoggingService } from 'src/app/shared/services/logging/logging.service';
import { Teacher } from 'src/app/shared/models/teacher.model';
import { Rating } from 'src/app/shared/models/rating.model';
import { SuccessRequest } from 'src/app/shared/api/success.model';
import { Submission } from 'src/app/shared/models/submission.model';

@Component({
  selector: 'app-assignment-modify',
  templateUrl: './assignment-modify.component.html',
  styleUrls: ['./assignment-modify.component.css'],
})
export class AssignmentModifyComponent implements OnInit {
  editForm = new EditFormGroup();
  editRatingForm = new EditRatingFormGroup();
  editSubmissionForm = new EditSubmissionFormGroup();
  assignmentTarget: Assignment = new Assignment();
  descriptionPreview: string = '';
  subjects: Subject[] = [];
  teachers: Teacher[] = [];
  selectedSubject!: Subject;
  selectedTeacher!: Teacher;
  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private subjectService: SubjectsService,
    private assignementService: AssignmentService,
    private _snackBar: MatSnackBar,
    private loggingService: LoggingService
  ) { }

  ngOnInit(): void {
    this.getAssignment();
    this.initSubject();
  }

  // Fonction qui permet de récupérer les matières
  initSubject() {
    this.loggingService.event('AssignmentModifyComponent', 'initSubject');
    this.subjectService.getAll().subscribe((res) => {
      if (res instanceof ErrorRequest) return;
      this.subjects = res;
      this.updateSelectedSubject();
    });
  }

  // Fonction qui permet de récupérer l'assignment
  getAssignment() {
    this.loggingService.event('AssignmentModifyComponent', 'getAssignment');
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.assignementService.get(id).subscribe((data) => {
        this.handleAssignment(data);
      });
    }
  }

  // Fonction qui permet de gérer l'assignment
  handleAssignment(assData: ErrorRequest | Assignment) {
    this.loggingService.event('AssignmentModifyComponent', 'handleAssignment');
    if (!assData) {
      Utils.snackBarError(this._snackBar, 'Erreur inconue');
      return;
    }
    if (assData instanceof ErrorRequest) {
      Utils.snackBarError(this._snackBar, assData);
      return;
    }

    this.assignmentTarget = assData;
    this.updateSelectedSubject();
  }

  // Fonction qui permet de modifier l'assignment
  updateSelectedSubject() {
    this.loggingService.event(
      'AssignmentModifyComponent',
      'updateSelectedSubject'
    );
    if (!this.assignmentTarget.subjectId) return;
    if (this.subjects.length === 0) return;

    const subject = this.subjects.find(
      (s) => s.id === this.assignmentTarget.subjectId
    );
    if (subject) {
      this.editForm.subjectValue = subject;
      this.selectedSubject = subject;
      this.isLoading = false;
    }
  }

  onUpdateAssignment() {
    if (this.assignmentTarget.id === undefined) return;
    this.assignmentTarget.teacherId = this.editForm.teacherValue.id;
    this.assignmentTarget.subjectId = this.editForm.subjectValue.id;
    this.assignementService.updateAssignment(this.assignmentTarget).subscribe(
      (data) => {
        this.handleUpdateAssignment(data)
      }
    )

  }

  handleUpdateAssignment(data: ErrorRequest | SuccessRequest) {
    if (data instanceof ErrorRequest) {
      Utils.snackBarError(this._snackBar, data);
      return;
    }
    if (!data.success) {
      Utils.snackBarError(this._snackBar, "Erreur inconnue");
      return;
    }
    Utils.snackBarSuccess(this._snackBar, 'Devoir modifié');
  }


  onUpdateRating() {
    if (this.assignmentTarget.id === undefined) return;
    let rating = Rating.createRating(this.editRatingForm.ratingValue, this.editRatingForm.commentValue);
    this.assignementService.updateRating(this.assignmentTarget.id, rating).subscribe(
      (data) => {
        this.handleUpdateRating(data)
      }
    )
  }

  handleUpdateRating(data: ErrorRequest | SuccessRequest) {
    if (data instanceof ErrorRequest) {
      Utils.snackBarError(this._snackBar, data);
      return;
    }
    if (!data.success) {
      Utils.snackBarError(this._snackBar, "Erreur inconnue");
      return;
    }
    Utils.snackBarSuccess(this._snackBar, 'Notation modifiée');
  }

  onUpdateSubmit() {
    const file = this.editSubmissionForm.fileValue;
    if (file == null) return;
    Utils.fileToArrayBuffer(file, (buffer) =>
      this.handleSubmissionFile(file, buffer)
    );
  }

  handleSubmissionFile(file: File, buffer: Buffer) {
    if (this.assignmentTarget === null) return;
    let sub = Submission.createSubmission(file, buffer);
    this.assignementService.updateSubmission(this.assignmentTarget.id, sub, file).subscribe(
      (data) => {
        this.handleUpdateSubmission(data)
      }
    )
  }

  handleUpdateSubmission(data: ErrorRequest | SuccessRequest) {
    if (data instanceof ErrorRequest) {
      Utils.snackBarError(this._snackBar, data);
      return;
    }
    if (!data.success) {
      Utils.snackBarError(this._snackBar, "Erreur inconnue");
      return;
    }
    Utils.snackBarSuccess(this._snackBar, 'Fichier modifié');
  }
}

class EditFormGroup extends FormGroup {
  constructor() {
    super({
      titleCtrl: new FormControl('', Assignment.getTitleValidators()),
      descriptionCtrl: new FormControl('', Assignment.getDescriptionValidators()),
      subjectCtrl: new FormControl('', [Validators.required]),
      dueDateCtrl: new FormControl('', Assignment.getDueDateValidators()),
      teacherCtrl: new FormControl('', [Validators.required]),
    });
  }

  isAllValid(): boolean {
    return this.valid;
  }

  get titleValue(): string {
    return this.get('titleCtrl')?.value;
  }

  get descriptionValue(): string {
    return this.get('descriptionCtrl')?.value;
  }

  get subjectValue(): Subject {
    return this.get('subjectCtrl')?.value;
  }

  get dueDateValue(): Date {
    return this.get('dueDateCtrl')?.value;
  }

  get teacherValue(): Teacher {
    return this.get('teacherCtrl')?.value;
  }

  set titleValue(value: string) {
    this.get('titleCtrl')?.setValue(value);
  }

  set descriptionValue(value: string) {
    this.get('descriptionCtrl')?.setValue(value);
  }

  set subjectValue(value: Subject) {
    this.get('subjectCtrl')?.setValue(value);
  }

  set dueDateValue(value: Date) {
    this.get('dueDateCtrl')?.setValue(value);
  }

  set teacherValue(value: Teacher) {
    this.get('teacherCtrl')?.setValue(value);
  }
}

class EditRatingFormGroup extends FormGroup {
  constructor() {
    super({
      ratingCtrl: new FormControl('', Rating.getRatingValidators()),
      commentCtrl: new FormControl('', Rating.getCommentValidators()),
    });
  }

  isAllValid(): boolean {
    return this.valid;
  }

  get ratingValue(): number {
    return this.get('ratingCtrl')?.value;
  }

  get commentValue(): string {
    return this.get('commentCtrl')?.value;
  }

  set ratingValue(value: number) {
    this.get('ratingCtrl')?.setValue(value);
  }

  set commentValue(value: string) {
    this.get('commentCtrl')?.setValue(value);
  }
}

class EditSubmissionFormGroup extends FormGroup {
  constructor() {
    super({
      fileCtrl: new FormControl('', [Validators.required]),
    });
  }

  get fileValue(): File {
    return this.get('fileCtrl')?.value;
  }

  set fileValue(value: File) {
    this.get('fileCtrl')?.setValue(value);
  }
}
