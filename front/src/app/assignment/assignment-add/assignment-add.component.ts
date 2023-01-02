import { Component, OnInit, ViewChild } from '@angular/core';
import { Assignment } from 'src/app/shared/models/assignment.model';
import { Router } from '@angular/router';
import { AssignmentService } from 'src/app/shared/services/assignment/assignment.service';
import { Utils } from 'src/app/shared/utils/Utils';
import { FormBuilder, Validators } from '@angular/forms';
import { SubjectsService } from 'src/app/shared/services/subject/subjects.service';
import { Subject } from 'src/app/shared/models/subject.model';
import { ErrorRequest } from 'src/app/shared/api/error.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoggingService } from 'src/app/shared/services/logging/logging.service';
import { Teacher } from 'src/app/shared/models/teacher.model';
import { LoadingService } from 'src/app/shared/services/loading/loading.service';
import { BaseComponent } from 'src/app/base/base.component';
import { TeacherService } from 'src/app/shared/services/teacher/teacher.service';
import { SuccessRequest } from 'src/app/shared/api/success.model';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-assignment-add',
  templateUrl: './assignment-add.component.html',
  styleUrls: ['./assignment-add.component.css'],
})
export class AssignmentAddComponent extends BaseComponent implements OnInit {
  // Pamametres de redirection
  timeBeforeRedirect: number = 5;

  // Form groups et form controls pour le stepper
  formGroups = new StepperAssignmentFromGroup(this._formBuilder);

  // Informations sur le stepper
  submitButtonText: string = 'Ajouter le devoir';

  // Toutes les matières et tous les professeurs
  subjects: Subject[] = [];
  teachers: Teacher[] = [];

  // Datepicker
  @ViewChild('picker') picker: any;

  finishLoadCount: number = 0;

  constructor(
    private _assignmentService: AssignmentService,
    private _subjectService: SubjectsService,
    private _teacherService: TeacherService,
    private _router: Router,
    private _formBuilder: FormBuilder,

    loadingService: LoadingService,
    snackBar: MatSnackBar,
    loggingService: LoggingService,
    dialog: MatDialog
  ) {
    super(loadingService, snackBar, loggingService, dialog);
    this.loadingState(true);
  }

  ngOnInit(): void {
    this.initSubjectTeacher();
    this.fillForm();
  }

  // Rempli la liste des matières
  initSubjectTeacher() {
    this._loggingService.event();
    this._subjectService.getAll().subscribe((res) => {
      this.handleSubjectResponse(res);
    });
    this._teacherService.getAll().subscribe((res) => {
      this.handleTeacherResponse(res);
    });
  }

  // Gère la réponse de l'api pour les matières
  handleSubjectResponse(res: Subject[] | ErrorRequest) {
    if (res instanceof ErrorRequest) {
      this.handleError(res);
      return;
    }
    this.subjects = res;
    const subjectId = Utils.getParam(Utils.getParams(), 'subject');
    if (subjectId) {
      this.formGroups.subjectValue = this.subjects.find(
        (subject) => subject.id === subjectId
      );
    }

    this.isFinishLoad();
  }

  // Gère la réponse de l'api pour les professeurs
  handleTeacherResponse(res: Teacher[] | ErrorRequest) {
    if (res instanceof ErrorRequest) {
      this.handleError(res);
      return;
    }
    this.teachers = res;
    const teacherId = Utils.getParam(Utils.getParams(), 'teacher');
    if (teacherId) {
      this.formGroups.teacherValue = this.teachers.find(
        (teacher) => teacher.id === teacherId
      );
    }

    this.isFinishLoad();
  }

  isFinishLoad() {
    this.finishLoadCount++;
    if (this.finishLoadCount === 2) {
      this.loadingState(false);
    }
  }

  // Rempli le formulaire avec les paramètres de l'url
  fillForm() {
    this._loggingService.event();
    let params = Utils.getParams();
    if (params) {
      this.formGroups.titleValue = Utils.getParam(params, 'title') ?? '';
      this.formGroups.dueDateValue = new Date(
        Utils.getParam(params, 'dueDate') ?? ''
      );
      this.formGroups.descriptionValue =
        Utils.getParam(params, 'description') ?? '';
    }
  }

  // Met à jour l'url avec les paramètres
  updateUrl(param: string, value: string) {
    Utils.updateParam(param, value);
  }

  // Valide le formulaire et ajoute le devoir
  submitNewAssignment() {
    this._loggingService.event();
    this.loadingStateNoUpdate(true);
    const newAssignment = new Assignment();
    newAssignment.title = this.formGroups.titleValue;
    newAssignment.dueDate = this.formGroups.dueDateValue;
    newAssignment.description = this.formGroups.descriptionValue;
    newAssignment.subjectId = this.formGroups.subjectValue?.id;
    newAssignment.teacherId = this.formGroups.teacherValue?.id;
    this._assignmentService.updateAssignment(newAssignment).subscribe((res) => {
      this.handleSubmissionResponse(res);
    });
  }

  // Redirige l'utilisateur vers la page d'accueil dans 5 secondes
  handleSubmissionResponse(data: ErrorRequest | SuccessRequest) {
    if (data instanceof ErrorRequest) {
      this.handleError(data);
      return;
    }
    if (!data.success) {
      this.handleError("Une erreur s'est produite");
      return;
    }
    this.loadingStateNoUpdate(false);
    Utils.snackBarSuccess(this._snackBar, 'Le devoir a été ajouté avec succès');
    let i = this.timeBeforeRedirect;
    let interval = setInterval(() => {
      this.submitButtonText = `Redirection dans ${i} secondes`;
      i--;
      if (i < 0) {
        clearInterval(interval);
        this._router.navigate(['/home']);
      }
    }, 1000);
  }
}

class StepperAssignmentFromGroup {
  constructor(private _formBuilder: FormBuilder) {}
  titleFormGroup = this._formBuilder.group({
    titleCtrl: ['', Assignment.getTitleValidators()],
  });
  dueDateFormGroup = this._formBuilder.group({
    dueDateCtrl: ['', Assignment.getDueDateValidators()],
  });
  descriptionFormGroup = this._formBuilder.group({
    descriptionCtrl: ['', Assignment.getDescriptionValidators()],
  });
  subjectFormGroup = this._formBuilder.group({
    subjectCtrl: ['', Validators.required],
  });
  teacherFormGroup = this._formBuilder.group({
    teacherCtrl: ['', Validators.required],
  });

  isAllValid() {
    return (
      this.titleFormGroup.valid &&
      this.dueDateFormGroup.valid &&
      this.descriptionFormGroup.valid &&
      this.subjectFormGroup.valid &&
      this.teacherFormGroup.valid
    );
  }

  get titleValue() {
    return this.titleFormGroup.get('titleCtrl')?.value ?? '';
  }

  get dueDateValue() {
    return (
      new Date(this.dueDateFormGroup.get('dueDateCtrl')?.value as any) ??
      (new Date() as any)
    );
  }

  get descriptionValue() {
    return this.descriptionFormGroup.get('descriptionCtrl')?.value ?? '';
  }

  get subjectValue(): Subject | undefined {
    return this.subjectFormGroup.get('subjectCtrl')?.value as any;
  }

  get teacherValue(): Teacher | undefined {
    return this.teacherFormGroup.get('teacherCtrl')?.value as any;
  }

  set titleValue(value: string) {
    this.titleFormGroup.get('titleCtrl')?.setValue(value);
  }

  set dueDateValue(value: Date) {
    this.dueDateFormGroup.get('dueDateCtrl')?.setValue(value as any);
  }

  set descriptionValue(value: string) {
    this.descriptionFormGroup.get('descriptionCtrl')?.setValue(value);
  }

  set subjectValue(value: Subject | undefined) {
    this.subjectFormGroup.get('subjectCtrl')?.setValue(value as any);
  }

  set teacherValue(value: Teacher | undefined) {
    this.teacherFormGroup.get('teacherCtrl')?.setValue(value as any as never);
  }
}
