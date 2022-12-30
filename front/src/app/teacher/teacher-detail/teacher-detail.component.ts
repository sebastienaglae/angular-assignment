import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { ErrorRequest } from 'src/app/shared/api/error.model';
import { Teacher } from 'src/app/shared/models/teacher.model';
import { TeacherService } from 'src/app/shared/services/teacher/teacher.service';
import { Utils } from 'src/app/shared/tools/Utils';

@Component({
  selector: 'app-teacher-detail',
  templateUrl: './teacher-detail.component.html',
  styleUrls: ['./teacher-detail.component.css']
})
export class TeacherDetailComponent {
  teacherTarget?: Teacher;
  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private teacherService: TeacherService,
    private snackBar: MatSnackBar
  ) { }
  ngOnInit(): void {
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
      Utils.snackBarError(this.snackBar, data);
      return;
    }

    this.teacherTarget = data;
    this.isLoading = false;
  }
}
