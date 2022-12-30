import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { ConnexionComponent } from './connexion/connexion.component';
import { RegisterComponent } from './register/register.component';
import { AssignmentModifyComponent } from './assignment/assignment-modify/assignment-modify.component';
import { AssignmentAddComponent } from './assignment/assignment-add/assignment-add.component';
import { AssignmentComponent } from './assignment/assignment.component';
import { AssignmentDetailComponent } from './assignment/assignment-detail/assignment-detail.component';
import { AuthGuard } from './shared/services/auth/auth.guard';
import { AssignmentGenComponent } from './assignment/assignment-gen/assignment-gen.component';
import { AssignmentSubmitComponent } from './assignment/assignment-submit/assignment-submit.component';
import { AssignmentRateComponent } from './assignment/assignment-rate/assignment-rate.component';
import { TeacherDetailComponent } from './teacher/teacher-detail/teacher-detail.component';

const routes: Routes = [
  { path: '', component: AssignmentComponent },
  { path: 'home', component: AssignmentComponent },
  {
    path: 'add',
    component: AssignmentAddComponent,
  },
  { path: 'assignment/:id', component: AssignmentDetailComponent },
  { path: 'gen', component: AssignmentGenComponent },
  {
    path: 'assignment/:id/edit',
    component: AssignmentModifyComponent,
  },
  {
    path: 'assignment/:id/submit',
    component: AssignmentSubmitComponent,
  },
  {
    path: 'assignment/:id/rate',
    component: AssignmentRateComponent,
  },
  { path: 'connection', component: ConnexionComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'teacher/:id', component: TeacherDetailComponent,
  }
];

@NgModule({
  imports: [BrowserModule, RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
