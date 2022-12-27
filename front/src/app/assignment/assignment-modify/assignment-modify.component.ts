import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AssignmentService } from 'src/app/shared/services/assignment/assignment.service';
import { Assignment } from 'src/app/shared/models/assignment.model';
import { Utils } from 'src/app/shared/tools/Utils';
import { ErrorRequest } from 'src/app/shared/api/error.model';
import { SubjectsService } from 'src/app/shared/services/subject/subjects.service';
import { Subject } from 'src/app/shared/models/subject.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-assignment-modify',
  templateUrl: './assignment-modify.component.html',
  styleUrls: ['./assignment-modify.component.css'],
})
export class AssignmentModifyComponent implements OnInit {
  editForm = new EditFormGroup();
  assignment: Assignment = new Assignment();
  descriptionPreview: string = '';
  subjects: Subject[] = [];
  selectedSubject!: Subject;

  constructor(
    private route: ActivatedRoute,
    private subjectService: SubjectsService,
    private assignementService: AssignmentService
  ) {
    this.getAssignment();
    this.initSubject();
  }
  initSubject() {
    this.subjectService.getAll().subscribe((res) => {
      if (res instanceof ErrorRequest) return;
      this.subjects = res;
      this.updateSelectedSubject();
    });
  }

  getAssignment() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.assignementService.get(id).subscribe((data) => {
        // TODO MANAGE ERROR
        if (!data) return;

        const assResult = data as any as Assignment;
        const subject = this.subjects.find((s) => s.id === assResult.subjectId);
        if (subject) {
          this.editForm.subjectValue = subject;
        }
        this.assignment = assResult;
        this.descriptionPreview = Utils.textPreview(assResult.description, 20);
        this.updateSelectedSubject();
      });
    }
  }

  updateSelectedSubject() {
    if (!this.assignment.subjectId) return;
    if (this.subjects.length === 0) return;

    const subject = this.subjects.find(
      (s) => s.id === this.assignment.subjectId
    );
    if (subject) {
      this.editForm.subjectValue = subject;
      this.selectedSubject = subject;
    }
  }

  ngOnInit(): void {}
}

class EditFormGroup extends FormGroup {
  constructor() {
    super({
      titleCtrl: new FormControl('', [Validators.required]),
      descriptionCtrl: new FormControl('', [Validators.required]),
      subjectCtrl: new FormControl('', [Validators.required]),
      dueDateCtrl: new FormControl('', [Validators.required]),
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
}
