import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

import { catchError, lastValueFrom, map, of, startWith, switchMap } from 'rxjs';
import moment from 'moment';

import { ICategory } from '../../../../core/interfaces/models/category.model.interface';
import { CategoryService } from '../../../../core/services/category.service';
import { MessageNotificationService } from '../../../../core/services/message-notification.service';


@Component({
  selector: 'app-categories-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIcon,
    MatPaginatorModule,
    RouterModule
  ],
  templateUrl: './categories-list.component.html',
  styleUrl: './categories-list.component.scss'
})
export class CategoriesListComponent implements OnInit, AfterViewInit {

  categoryService = inject(CategoryService);
  messageNotificationService = inject(MessageNotificationService);

  displayedColumns: string[] = ['select', 'id', 'name', 'slug', 'createdAt', 'updatedAt', 'actions'];
  dataSource: MatTableDataSource<ICategory> = new MatTableDataSource<ICategory>([]);

  selection = new SelectionModel<ICategory>(true, []);

  momentJs = moment;

  totalResults = 0;
  pageSize = 5;
  defaultSortField = 'name';

  selectedIds = new Set<number>;

  @ViewChild(MatPaginator) paginator?: MatPaginator;


  ngOnInit() { }

  ngAfterViewInit() {
    this.paginator?.page
      .pipe(
        startWith({ pageIndex: 0, pageSize: 5 }),
        switchMap(({ pageIndex, pageSize }) =>
          this.getCategories(pageIndex, pageSize)
        ),
        catchError(() => {
          this.messageNotificationService.setMessage('Failed to load categories', 'error');
          return of({});
        })
      )
      .subscribe(response => {
        this.dataSource.data = response.partialElements || [];
        this.totalResults = response.total || 0;
        this.reapplySelection();
      });
  }

  private getCategories(pageIndex: number, pageSize: number) {
    return this.categoryService.getCategoriesPaginated(this.buildSearchRequest(pageIndex, pageSize));
  }

  private buildSearchRequest(pageIndex: number, pageSize: number) {
    return {
      page: pageIndex,
      size: pageSize,
      sortField: this.defaultSortField,
      sortOrder: "ASC",
      filters: {}
    };
  }

  isAllSelected() {
    return this.selection.selected.length === this.dataSource.data.length;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.dataSource.data.forEach(row => this.selectedIds.delete(row.id));
      this.selection.clear();
    } else {
      this.dataSource.data.forEach(row => {
        this.selectedIds.add(row.id);
        this.selection.select(row);
      });
    }
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: ICategory): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'}`;
  }

  deleteSelectedCategories() {
    const selectedCategories = this.selection.selected;
    const idsToBeDeleted = selectedCategories.map((category: ICategory) => category.id);

    let promises = idsToBeDeleted.map(categoryId => {
      const ob$ = this.categoryService.deleteCategory(categoryId);
      //convert into promise
      return lastValueFrom(ob$!);
    });

    // Promise.all -> all or nothing -> if one of them fails then the others will not be processed either
    Promise.all(promises)
      .then(() => {
        this.messageNotificationService.setMessage('All categories deleted successfully', 'success');
        if (this.paginator) {
          this.getCategories(this.paginator.pageIndex, this.paginator.pageSize).subscribe((response) => {
            this.dataSource.data = response.partialElements;
            this.totalResults = response.total;

            idsToBeDeleted.forEach(id => {
              if (this.selectedIds.has(id)) {
                this.selectedIds.delete(id);
              }
            });
            this.reapplySelection();
          });
        }
      })
      .catch(error => {
        this.messageNotificationService.setMessage('Failed to delete categories', 'error');
        console.error('Failed to delete categories', error);
      });
  }

  toggleSelection(category: ICategory) {
    if (this.selection.isSelected(category)) {
      this.selectedIds.delete(category.id);
      this.selection.deselect(category);
    } else {
      this.selectedIds.add(category.id);
      this.selection.select(category);
    }
  }

  reapplySelection() {
    this.selection.clear();
    this.dataSource.data.forEach(category => {
      if (this.selectedIds.has(category.id)) {
        this.selection.select(category);
      }
    });
  }

}

