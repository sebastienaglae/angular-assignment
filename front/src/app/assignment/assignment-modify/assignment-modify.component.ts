import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AssignmentService } from 'src/app/shared/services/assignment/assignment.service';
import { Assignment } from 'src/app/shared/models/assignment.model';
import { Utils } from 'src/app/shared/utils/Utils';
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
import { LoadingService } from 'src/app/shared/services/loading/loading.service';
import { BaseComponent } from 'src/app/base/base.component';
import { MatDialog } from '@angular/material/dialog';
import { TeacherService } from 'src/app/shared/services/teacher/teacher.service';

@Component({
  selector: 'app-assignment-modify',
  templateUrl: './assignment-modify.component.html',
  styleUrls: ['./assignment-modify.component.css'],
})
export class AssignmentModifyComponent extends BaseComponent implements OnInit {
  editForm = new EditFormGroup();
  editRatingForm = new EditRatingFormGroup();
  editSubmissionForm = new EditSubmissionFormGroup();
  assignmentTarget: Assignment = new Assignment();
  descriptionPreview: string = '';
  subjects!: Subject[];
  teachers!: Teacher[];
  selectedSubject!: Subject;
  selectedTeacher!: Teacher;
  finishLoadCount: number = 0;

  constructor(
    private _route: ActivatedRoute,
    private _subjectService: SubjectsService,
    private _teacherService: TeacherService,
    private _assignementService: AssignmentService,
    snackBar: MatSnackBar,
    loggingService: LoggingService,
    loadingService: LoadingService,
    dialog: MatDialog
  ) {
    super(loadingService, snackBar, loggingService, dialog);
    this.loadingState(true);
  }

  ngOnInit(): void {
    this.getAssignment();
    this.initSubjects();
    this.initTeachers();
  }

  // Fonction qui permet de récupérer les matières
  initSubjects() {
    this._loggingService.event();
    this._subjectService.getAll().subscribe((res) => {
      if (res instanceof ErrorRequest) return;
      this.subjects = res;
      this.updateSelectedSubject();
    });
  }

  // Fonction qui permet de récupérer les professeurs
  initTeachers() {
    this._loggingService.event();
    this._teacherService.getAll().subscribe((res) => {
      if (res instanceof ErrorRequest) return;
      this.teachers = res;
      this.updateSelectedTeacher();
    });
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

  // Fonction qui permet de gérer l'assignment
  handleAssignment(assData: ErrorRequest | Assignment) {
    this._loggingService.event();
    if (assData instanceof ErrorRequest) {
      this.handleError(assData);
      return;
    }

    this.assignmentTarget = assData;
    this.updateSelectedSubject();
    this.updateSelectedTeacher();
  }

  // Fonction qui permet de modifier l'assignment
  updateSelectedSubject() {
    this._loggingService.event();
    if (!this.assignmentTarget.subjectId) return;
    if (this.subjects === undefined) return;

    const subject = this.subjects.find(
      (s) => s.id === this.assignmentTarget.subjectId
    );
    if (subject) {
      this.editForm.subjectValue = subject;
      this.selectedSubject = subject;
      this.isFinishLoad();
    }
  }

  updateSelectedTeacher() {
    this._loggingService.event();
    if (!this.assignmentTarget.teacherId) return;
    if (this.teachers === undefined) return;

    const teacher = this.teachers.find(
      (s) => s.id === this.assignmentTarget.teacherId
    );
    if (teacher) {
      this.editForm.teacherValue = teacher;
      this.selectedTeacher = teacher;
      this.isFinishLoad();
    }
  }

  isFinishLoad() {
    this.finishLoadCount++;
    if (this.finishLoadCount === 2) {
      this.loadingState(false);
    }
  }

  onUpdateAssignment() {
    if (this.assignmentTarget.id === undefined) return;
    this.loadingStateNoUpdate(true);
    this.assignmentTarget.teacherId = this.editForm.teacherValue.id;
    this.assignmentTarget.subjectId = this.editForm.subjectValue.id;
    this._assignementService
      .updateAssignment(this.assignmentTarget)
      .subscribe((data) => {
        this.handleUpdateAssignment(data);
      });
  }

  handleUpdateAssignment(data: ErrorRequest | SuccessRequest) {
    if (data instanceof ErrorRequest) {
      this.handleErrorSoft(data);
      return;
    }
    if (!data.success) {
      this.handleErrorSoft('Erreur inconnue');
      return;
    }
    Utils.snackBarSuccess(this._snackBar, 'Devoir modifié');
    this.loadingStateNoUpdate(false);
  }

  onUpdateRating() {
    if (this.assignmentTarget.id === undefined) return;
    this.loadingStateNoUpdate(true);
    let rating = Rating.createRating(
      this.editRatingForm.ratingValue,
      this.editRatingForm.commentValue
    );
    this._assignementService
      .updateRating(this.assignmentTarget.id, rating)
      .subscribe((data) => {
        this.handleUpdateRating(data);
      });
  }

  handleUpdateRating(data: ErrorRequest | SuccessRequest) {
    if (data instanceof ErrorRequest) {
      this.handleErrorSoft(data);
      return;
    }
    if (!data.success) {
      this.handleErrorSoft('Erreur inconnue');
      return;
    }
    Utils.snackBarSuccess(this._snackBar, 'Notation modifiée');
    this.loadingStateNoUpdate(false);
  }

  onUpdateSubmit() {
    const file = this.editSubmissionForm.fileValue;
    if (file == null) return;
    this.loadingStateNoUpdate(true);
    Utils.fileToArrayBuffer(file, (buffer) =>
      this.handleSubmissionFile(file, buffer)
    );
  }

  handleSubmissionFile(file: File, buffer: Buffer) {
    if (this.assignmentTarget === null) return;
    let sub = Submission.createSubmission(file, buffer);
    this._assignementService
      .updateSubmission(this.assignmentTarget.id, sub, file)
      .subscribe((data) => {
        this.handleUpdateSubmission(data);
      });
  }

  handleUpdateSubmission(data: ErrorRequest | SuccessRequest) {
    if (data instanceof ErrorRequest) {
      this.handleErrorSoft(data);
      return;
    }
    if (!data.success) {
      this.handleErrorSoft('Erreur inconnue');
      return;
    }
    Utils.snackBarSuccess(this._snackBar, 'Fichier modifié');
    this.loadingStateNoUpdate(false);
  }
}

class EditFormGroup extends FormGroup {
  constructor() {
    super({
      titleCtrl: new FormControl('', Assignment.getTitleValidators()),
      descriptionCtrl: new FormControl(
        '',
        Assignment.getDescriptionValidators()
      ),
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
