import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from 'src/app/base/base.component';
import { ErrorRequest } from 'src/app/shared/api/error.model';
import { Teacher } from 'src/app/shared/models/teacher.model';
import { LoadingService } from 'src/app/shared/services/loading/loading.service';
import { TeacherService } from 'src/app/shared/services/teacher/teacher.service';
import { Utils } from 'src/app/shared/tools/Utils';

@Component({
  selector: 'app-teacher-detail',
  templateUrl: './teacher-detail.component.html',
  styleUrls: ['./teacher-detail.component.css']
})
export class TeacherDetailComponent extends BaseComponent {
  teacherTarget?: Teacher;

  constructor(
    private route: ActivatedRoute,
    private teacherService: TeacherService,
    private snackBar: MatSnackBar,
    private loadingService: LoadingService
  ) {
    loadingService.getLoadingState().subscribe((state) => {
      this.loading = state.enabled;
    });
    super(loadingService, snackBar);
    this.loadingState(true)
  }
  onInit(): void {
    this.getTeacher();
  }

  getTeacher() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.teacherService.get(id).subscribe((data) => {
        this.handleTeacher(data);
      });
    }
  }

  handleTeacher(data: Teacher | ErrorRequest) {
    if (data instanceof ErrorRequest) {
      this.handleError(data)
      return;
    }

    this.teacherTarget = data;
    this.loadingState(false);
  }
}
