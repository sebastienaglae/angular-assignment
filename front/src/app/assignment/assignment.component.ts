import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AssignmentService } from '../shared/services/assignment/assignment.service';
import { Assignment } from '../shared/models/assignment.model';
import { MatSort, Sort, SortDirection } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { merge, Observable, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { SearchAssignment } from '../shared/api/assignment/search.assignment.model';
import { ErrorRequest } from '../shared/api/error.model';
import { LoggingService } from '../shared/services/logging/logging.service';
import { Utils } from '../shared/tools/Utils';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AssignmentSearch } from '../shared/models/assignment.search.model';
import { SuccessRequest } from '../shared/api/success.model';
import { LoadingService } from '../shared/services/loading/loading.service';
@Component({
  selector: 'app-assignment',
  templateUrl: './assignment.component.html',
  styleUrls: ['./assignment.component.css'],
})
export class AssignmentComponent implements OnInit {
  searchAssignment!: SearchAssignment;
  datasource: MatTableDataSource<AssignmentSearch> = new MatTableDataSource();

  filterOptions: FilterOptions = new FilterOptions();

  //@ts-ignore
  @ViewChild('paginator') paginator: MatPaginator;
  //@ts-ignore
  @ViewChild(MatSort) sort: MatSort;
  //@ts-ignore
  displayedColumns: string[] = ['title', 'dueDate', 'hasSubmission', 'hasRating', 'actions'];

  // Add ref of AppComponent to use it in the template
  constructor(
    private assignementService: AssignmentService,
    private loggingService: LoggingService,
    private snackBar: MatSnackBar,
    private loadingService: LoadingService,
  ) {
    this.loadingService.changeLoadingState(true);
  }


  ngOnInit(): void {
    this.datasource.paginator = this.paginator;
    this.datasource.sort = this.sort;
  }

  ngAfterViewInit() {
    this.loadAssignments();
  }

  // Fonction qui permet de supprimer une devoir
  onDeleteAssignment(id: string) {
    this.loggingService.event('AssignmentComponent', 'onDeleteAssignment');
    this.assignementService.delete(id).subscribe((data) => {
      this.handleDeleteAssignment(data);
    });
  }

  handleDeleteAssignment(data: SuccessRequest | ErrorRequest) {
    if (data instanceof ErrorRequest) {
      Utils.frontError(this.snackBar, data, this.loadingService)
      return;
    }
    if (!data.success) {
      Utils.frontError(this.snackBar, 'Une erreur est survenue', this.loadingService);
      return;
    }

    Utils.snackBarSuccess(this.snackBar, 'Devoir supprimé avec succès');
    this.loadAssignments();
  }

  loadAssignments(): void {
    this.loggingService.event('AssignmentComponent', 'loadAssignments');
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.loadingService.changeLoadingState(true);
          return this.assignementService.search(this.getFilter(), this.getOrder(), {
            page: this.paginator.pageIndex,
            limit: this.paginator.pageSize,
          });
        }),
        map((data) => {
          if (data instanceof ErrorRequest) {
            this.paginator.length = 0;
            Utils.frontError(this.snackBar, data, this.loadingService)
            return [];
          }
          this.paginator.length = data.totalItems;
          this.loadingService.changeLoadingState(false);
          return data.items;
        }),
        catchError(() => {
          return observableOf([]);
        })
      )
      .subscribe((data) => {
        this.datasource.data = data;
      });
  }

  // Fonction qui permet de filtrer les données
  getOrder() {
    if (this.sort.direction === '') {
      return null;
    }

    const column = this.sort.active;
    const direction = this.sort.direction === 'asc' ? 1 : -1;

    return { [column]: direction };
  }

  // Fonction qui permet de filtrer les données
  getFilter() {
    let json = {}
    if (this.filterOptions.searchText !== '') {
      json = { ...json, ...{ title: this.filterOptions.searchText } }
    }
    if (this.filterOptions.submitFilter !== undefined) {
      json = { ...json, ...{ submission: this.filterOptions.submitFilter === 'submit' ? null : false } }
    }
    if (this.filterOptions.ratingFilter !== undefined) {
      json = { ...json, ...{ rating: this.filterOptions.ratingFilter === 'rated' ? null : false } }
    }
    // todo check if it's right
    if (this.filterOptions.yearFilter !== undefined) {
      json = { ...json, ...{ year: this.filterOptions.yearFilter } }
    }
    if (this.filterOptions.monthFilter !== undefined) {
      json = { ...json, ...{ month: this.filterOptions.monthFilter } }
    }

    return json;
  }
}

class FilterOptions {
  searchText: string = '';
  submitFilter: string | undefined = undefined;
  ratingFilter: string | undefined = undefined;
  yearFilter: number | undefined = undefined;
  monthFilter: number | undefined = undefined;

  getSearchFilter(): string {
    return this.searchText.trim().toLowerCase();
  }
}
