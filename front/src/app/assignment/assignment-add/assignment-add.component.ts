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

  // Informations sur le stepper
  submitButtonText: string = 'Ajouter le devoir';

  @ViewChild('picker') picker: any;

  subjects = ['Math', 'Physics', 'Chemistry', 'Biology', 'History'];
  constructor(
    private assignmentService: AssignmentService,
    private _formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    // fill the form with the url parameters
    this.fillForm();
  }

  // Rempli le formulaire avec les paramètres de l'url
  fillForm() {
    let params = Utils.getParams();
    //todo : See matiere
    if (params) {
      this.formGroups.nameValue = Utils.getParam(params, 'name');
      this.formGroups.authorValue = Utils.getParam(params, 'author');
      this.formGroups.dateValue = new Date(Utils.getParam(params, 'date'));
    }
  }

  // Met à jour l'url avec les paramètres
  updateUrl(param: string, value: string) {
    Utils.updateParam(param, value);
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
    // this.assignmentService
    //   .addAssignment(this.newAssignmentItem)
    //   .subscribe((data) => {
    //     this.handleSubmission();
    //   });
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
  nameFormGroup = this._formBuilder.group({
    nameCtrl: ['', Validators.required],
  });
  dateFormGroup = this._formBuilder.group({
    dateCtrl: ['', Validators.required],
  });
  authorFormGroup = this._formBuilder.group({
    authorCtrl: ['', Validators.required],
  });
  subjectFormGroup = this._formBuilder.group({
    subjectCtrl: ['', Validators.required],
  });

  isAllValid() {
    return (
      this.nameFormGroup.valid &&
      this.dateFormGroup.valid &&
      this.authorFormGroup.valid &&
      this.subjectFormGroup.valid
    );
  }
  get nameValue() {
    return this.nameFormGroup.get('nameCtrl')?.value ?? '';
  }

  get dateValue() {
    return (
      new Date(this.dateFormGroup.get('dateCtrl')?.value as any) ??
      (new Date() as any)
    );
  }

  get authorValue() {
    return this.authorFormGroup.get('authorCtrl')?.value ?? '';
  }

  get subjectValue() {
    return this.subjectFormGroup.get('subjectCtrl')?.value ?? '';
  }

  set nameValue(value: string) {
    this.nameFormGroup.get('nameCtrl')?.setValue(value);
  }

  set dateValue(value: Date) {
    this.dateFormGroup.get('dateCtrl')?.setValue(value as any);
  }

  set authorValue(value: string) {
    this.authorFormGroup.get('authorCtrl')?.setValue(value);
  }

  set subjectValue(value: string) {
    this.subjectFormGroup.get('subjectCtrl')?.setValue(value);
  }
}
