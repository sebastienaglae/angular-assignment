import { Component, OnInit, ViewChild } from '@angular/core';
import { AssignmentService } from '../assignment.service';
import { Assignment } from '../shared/assignment.model';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { Utils } from '../shared/tools/Utils';
import { MatSort, Sort } from '@angular/material/sort';
import { merge, Observable, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { SearchAssignment } from '../shared/api/assignment/search.model';
@Component({
  selector: 'app-assignment',
  templateUrl: './assignment.component.html',
  styleUrls: ['./assignment.component.css'],
})
export class AssignmentComponent implements OnInit {
  assignments: Assignment[] = [];
  searchText: string = '';
  filterRendu: string = 'all';
  //@ts-ignore
  @ViewChild('paginator') paginator: MatPaginator;
  //@ts-ignore
  @ViewChild(MatSort) sort: MatSort;
  //@ts-ignore
  datasource: MatTableDataSource<Assignment>;
  displayedColumns: string[] = ['nom', 'dateDeRendu', 'actions'];

  constructor(private assignementService: AssignmentService) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          return this.assignementService.getAssignments();
        }),
        map((data) => {
          console.log(data);
          if (!(data instanceof SearchAssignment)) return;
          this.assignments = data.items;
          this.datasource = new MatTableDataSource(data.items);
          this.datasource.filterPredicate = this.getFilterPredicate();
          this.datasource.paginator = this.paginator;
          this.datasource.sort = this.sort;
          // filter on the nom column only using the searchText
          return data;
        }),
        catchError(() => {
          return observableOf([]);
        })
      )
      .subscribe((data) => {
        console.log(data);
        //check if the data is SearchAssignment
        if (!(data instanceof SearchAssignment)) return;

        this.assignments = data.items;
        this.datasource = new MatTableDataSource(data.items as Assignment[]);
        this.datasource.filterPredicate = this.getFilterPredicate();
        this.datasource.paginator = this.paginator;
        this.datasource.sort = this.sort;
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
        renduFilter === '' || data.rendu === (renduFilter === 'true');
      return nomMatch && renduMatch;
    };
  }
}
