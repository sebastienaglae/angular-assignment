import { Component, OnInit, ViewChild } from '@angular/core';
import { AssignmentService } from '../shared/services/assignment/assignment.service';
import { Assignment } from '../shared/models/assignment.model';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { merge, Observable, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { SearchAssignment } from '../shared/api/assignment/search.assignment.model';
@Component({
  selector: 'app-assignment',
  templateUrl: './assignment.component.html',
  styleUrls: ['./assignment.component.css'],
})
export class AssignmentComponent implements OnInit {
  searchAssignment!: SearchAssignment;
  datasource: MatTableDataSource<Assignment> = new MatTableDataSource();

  searchText: string = '';
  filterRendu: string = 'all';
  //@ts-ignore
  @ViewChild('paginator') paginator: MatPaginator;
  //@ts-ignore
  @ViewChild(MatSort) sort: MatSort;
  //@ts-ignore
  displayedColumns: string[] = ['title', 'dueDate', 'submission', 'actions'];

  constructor(private assignementService: AssignmentService) {}

  ngOnInit(): void {
    this.datasource.sort = this.sort;
    this.datasource.paginator = this.paginator;
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    this.datasource.filterPredicate = this.getFilterPredicate();
    this.loadAssignments();
  }

  loadAssignments() {
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

  onSearch() {
    this.datasource.filter = this.searchText.trim().toLowerCase();
  }

  onFilter() {
    if (this.filterRendu === 'all') {
      this.datasource.filter = '';
    } else if (this.filterRendu === 'rendu') {
      this.datasource.filter = 'true';
    } else {
      this.datasource.filter = 'false';
    }
  }

  applyFilter() {
    const nomFilter = this.searchText.trim().toLowerCase();
    let renduFilter = '';
    if (this.filterRendu === 'all') {
      renduFilter = '';
    } else if (this.filterRendu === 'rendu') {
      renduFilter = 'true';
    } else {
      renduFilter = 'false';
    }

    this.datasource.filter = nomFilter + '$' + renduFilter;
  }

  getFilterPredicate() {
    return (data: Assignment, filter: string) => {
      const nomFilter = filter.split('$')[0];
      const renduFilter = filter.split('$')[1];
      const nomMatch = data.title.toLowerCase().includes(nomFilter);
      const renduMatch =
        renduFilter === '' || data.submission === (renduFilter === 'true');
      return nomMatch && renduMatch;
    };
  }
}
