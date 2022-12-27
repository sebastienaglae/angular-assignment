import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Assignment } from 'src/app/shared/models/assignment.model';
import { Router } from '@angular/router';
import { AssignmentService } from 'src/app/shared/services/assignment/assignment.service';
import { Utils } from 'src/app/shared/tools/Utils';
import { FormBuilder, Validators } from '@angular/forms';
import { SubjectsService } from 'src/app/shared/services/subject/subjects.service';
import { Subject } from 'src/app/shared/models/subject.model';
import { ErrorRequest } from 'src/app/shared/api/error.model';

@Component({
  selector: 'app-assignment-add',
  templateUrl: './assignment-add.component.html',
  styleUrls: ['./assignment-add.component.css'],
})
export class AssignmentAddComponent implements OnInit {
  @Output() newAssignment = new EventEmitter<Assignment>();
  // Pamametres de redirection
  timeBeforeRedirect: number = 5;

  // Chemins des images du professeur et de la matière
  teacherImgPath!: string;
  subjectImgPath!: string;

  // Form groups et form controls pour le stepper
  formGroups = new StepperAssignmentFromGroup(this._formBuilder);

  // Formulaire
  // newAssignmentItem: Assignment = new Assignment();

  subjects: Subject[] = [];

  // Informations sur le stepper
  submitButtonText: string = 'Ajouter le devoir';

  @ViewChild('picker') picker: any;

  constructor(
    private assignmentService: AssignmentService,
    private subjectService: SubjectsService,
    private _formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    // fill the form with the url parameters
    this.initSubject();
    this.fillForm();
  }

  initSubject() {
    this.subjectService.getAll().subscribe((res) => {
      if (res instanceof ErrorRequest) return;
      this.subjects = res;
      const subjectId = Utils.getParam(Utils.getParams(), 'subject');
      if (subjectId) {
        this.formGroups.subjectValue = this.subjects.find(
          (subject) => subject.id === subjectId
        );
      }
    });
  }

  // Rempli le formulaire avec les paramètres de l'url
  fillForm() {
    let params = Utils.getParams();
    //todo : See matiere
    if (params) {
      this.formGroups.titleValue = Utils.getParam(params, 'title');
      this.formGroups.dueDateValue = new Date(
        Utils.getParam(params, 'dueDate')
      );
      this.formGroups.descriptionValue = Utils.getParam(params, 'description');
    }
  }

  // Met à jour l'url avec les paramètres
  updateUrl(param: string, value: string) {
    Utils.updateParam(param, value);
  }

  parseDate(date: string) {
    return Date.parse(date).toString();
  }

  // Met à jour la photo de la matière et du professeur
  subjectChange() {
    // TODO : Add the professor and the imange subject
    console.log('Subject change');
    // this.teacherImgPath =
    // this.subjectImgPath =
  }

  // Valide le formulaire et ajoute le devoir
  submitNewAssignment() {
    if (!this.formGroups.isAllValid()) return;
    const newAssignment = new Assignment();
    newAssignment.title = this.formGroups.titleValue;
    newAssignment.dueDate = this.formGroups.dueDateValue;
    console.log(this.formGroups.dueDateValue.toUTCString());
    // newAssignment.author = this.formGroups.authorValue;
    // newAssignment.subject = this.formGroups.subjectValue;
  }

  // Redirige l'utilisateur vers la page d'accueil dans 5 secondes
  handleSubmission() {
    let i = this.timeBeforeRedirect;
    let interval = setInterval(() => {
      this.submitButtonText = `Redirection dans ${i} secondes`;
      i--;
      if (i < 0) {
        clearInterval(interval);
        this.router.navigate(['/home']);
      }
    }, 1000);
  }

  // Réinitialise le formulaire
  reset() {
    // this.newAssignmentItem = new Assignment();
  }
}

class StepperAssignmentFromGroup {
  constructor(private _formBuilder: FormBuilder) {}
  titleFormGroup = this._formBuilder.group({
    titleCtrl: ['', Validators.required],
  });
  dueDateFormGroup = this._formBuilder.group({
    dueDateCtrl: ['', Validators.required],
  });
  descriptionFormGroup = this._formBuilder.group({
    descriptionCtrl: ['', Validators.required],
  });
  subjectFormGroup = this._formBuilder.group({
    subjectCtrl: ['', Validators.required],
  });

  isAllValid() {
    return (
      this.titleFormGroup.valid &&
      this.dueDateFormGroup.valid &&
      this.descriptionFormGroup.valid &&
      this.subjectFormGroup.valid
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
}
