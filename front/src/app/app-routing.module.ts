import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { ConnexionComponent } from './connexion/connexion.component';
import { RegisterComponent } from './register/register.component';
import { AssignmentModifyComponent } from './assignment/assignment-modify/assignment-modify.component';
import { AssignmentListComponent } from './assignment/assignment-list/assignment-list.component';
import { AssignmentAddComponent } from './assignment/assignment-add/assignment-add.component';
import { AssignmentComponent } from './assignment/assignment.component';
import { AssignmentDetailComponent } from './assignment/assignment-detail/assignment-detail.component';
import { AuthGuard } from './shared/auth.guard';
import { AssignmentGenComponent } from './assignment/assignment-gen/assignment-gen.component';

const routes: Routes = [
  { path: '', component: AssignmentComponent },
  { path: 'home', component: AssignmentComponent },
  {
    path: 'add',
    component: AssignmentAddComponent,
  },
  { path: 'assignment/:id', component: AssignmentDetailComponent },
  { path: 'gen', component: AssignmentGenComponent },
  { path: 'list', component: AssignmentListComponent },
  {
    path: 'assignment/:id/edit',
    component: AssignmentModifyComponent,
    canActivate: [AuthGuard],
  },
  { path: 'connection', component: ConnexionComponent },
  { path: 'register', component: RegisterComponent },
];

@NgModule({
  imports: [BrowserModule, RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
