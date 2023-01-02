import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from 'src/app/base/base.component';
import { ErrorRequest } from 'src/app/shared/api/error.model';
import { Teacher } from 'src/app/shared/models/teacher.model';
import { LoadingService } from 'src/app/shared/services/loading/loading.service';
import { LoggingService } from 'src/app/shared/services/logging/logging.service';
import { TeacherService } from 'src/app/shared/services/teacher/teacher.service';

@Component({
  selector: 'app-teacher-detail',
  templateUrl: './teacher-detail.component.html',
  styleUrls: ['./teacher-detail.component.css'],
})
export class TeacherDetailComponent extends BaseComponent implements OnInit {
  teacherTarget?: Teacher;

  constructor(
    private _route: ActivatedRoute,
    private _teacherService: TeacherService,
    snackBar: MatSnackBar,
    loadingService: LoadingService,
    loggingService: LoggingService,
    dialog: MatDialog
  ) {
    super(loadingService, snackBar, loggingService, dialog);
    this.loadingState(true);
  }
  ngOnInit(): void {
    this.getTeacher();
  }

  // Fonction qui récupère le professeur
  getTeacher() {
    const id = this._route.snapshot.paramMap.get('id');
    if (id) {
      this._teacherService.get(id).subscribe((data) => {
        this.handleTeacher(data);
      });
    }
  }

  // Fonction qui gère la réponse de l'API
  handleTeacher(data: Teacher | ErrorRequest) {
    if (data instanceof ErrorRequest) {
      this.handleError(data);
      return;
    }

    this.teacherTarget = data;
    this.loadingState(false);
  }
}
