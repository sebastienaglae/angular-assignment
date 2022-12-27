import { Component, OnInit, ViewChild } from '@angular/core';
import { AssignmentService } from '../shared/services/assignment/assignment.service';
import { Assignment } from '../shared/models/assignment.model';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { merge, Observable, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { SearchAssignment } from '../shared/api/assignment/search.assignment.model';
import { ErrorRequest } from '../shared/api/error.model';
import { LoggingService } from '../shared/services/logging/logging.service';
@Component({
  selector: 'app-assignment',
  templateUrl: './assignment.component.html',
  styleUrls: ['./assignment.component.css'],
})
export class AssignmentComponent implements OnInit {
  searchAssignment!: SearchAssignment;
  datasource: MatTableDataSource<Assignment> = new MatTableDataSource();

  filterOptions: FilterOptions = new FilterOptions();

  //@ts-ignore
  @ViewChild('paginator') paginator: MatPaginator;
  //@ts-ignore
  @ViewChild(MatSort) sort: MatSort;
  //@ts-ignore
  displayedColumns: string[] = ['title', 'dueDate', 'submission', 'actions'];

  constructor(
    private assignementService: AssignmentService,
    private loggingService: LoggingService
  ) {}

  ngOnInit(): void {
    this.datasource.sort = this.sort;
    this.datasource.paginator = this.paginator;
  }

  // Fonction qui permet de filtrer les données
  ngAfterViewInit(): void {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    this.datasource.filterPredicate = this.getFilterPredicate();
    this.loadAssignments();
  }

  // Fonction qui permet de filtrer les données
  loadAssignments(): void {
    this.loggingService.event('AssignmentComponent', 'loadAssignments');
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          return this.assignementService.search({
            page: this.paginator.pageIndex,
            pageSize: this.paginator.pageSize,
            pageOffset: 1,
          });
        }),
        map((data) => {
          if (data instanceof ErrorRequest) {
            this.paginator.length = 0;
            return [];
          }
          this.paginator.length = data.totalItems;
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
  applyFilter() {
    this.loggingService.event('AssignmentComponent', 'applyFilter');
    const nomFilter = this.filterOptions.getSearchFilter();
    const submitFilter = this.filterOptions.submitFilter;
    let submitFilterResult = '';
    if (submitFilter === 'all') {
      submitFilterResult = '';
    } else if (submitFilter === 'submit') {
      submitFilterResult = 'true';
    } else {
      submitFilterResult = 'false';
    }

    this.datasource.filter = nomFilter + '$' + submitFilterResult;
  }

  // Fonction qui permet de filtrer les données
  getFilterPredicate() {
    return (data: Assignment, filter: string) => {
      const nomFilter = filter.split('$')[0];
      const renduFilter = filter.split('$')[1];
      const nomMatch = data.title.toLowerCase().includes(nomFilter);
      // TODO : Faire le renduFilter
      // return nomMatch && renduMatch;
      return nomMatch;
    };
  }
}

class FilterOptions {
  searchText: string = '';
  submitFilter: string = 'all';

  getSearchFilter(): string {
    return this.searchText.trim().toLowerCase();
  }
}
