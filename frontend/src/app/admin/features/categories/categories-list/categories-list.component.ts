import { Component, inject, OnInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

import { lastValueFrom } from 'rxjs';
import moment from 'moment';

import { ICategory } from '../../../../core/interfaces/models/category.model.interface';
import { CategoryService } from '../../../../core/services/category.service';


@Component({
  selector: 'app-categories-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIcon,
    RouterModule
  ],
  templateUrl: './categories-list.component.html',
  styleUrl: './categories-list.component.scss'
})
export class CategoriesListComponent implements OnInit {

  categoryService = inject(CategoryService);

  displayedColumns: string[] = ['select', 'id', 'name', 'slug', 'createdAt', 'updatedAt', 'actions'];
  dataSource: MatTableDataSource<ICategory> = new MatTableDataSource<ICategory>([]);

  selection = new SelectionModel<ICategory>(true, []);

  momentJs = moment;


  ngOnInit(): void {
    this.loadCategories();
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: ICategory): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'}`;
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (data: ICategory[]) => {
        this.dataSource.data = data;
      },
      error: (err) => {

      }
    })
  };

  deleteSelectedCategories() {
    const selectedCategories = this.selection.selected;
    const selectedCategoriIds = selectedCategories.map((category: ICategory) => category.id);

    let promises = selectedCategoriIds.map(categoryId => {
      const ob$ = this.categoryService.deleteCategory(categoryId);
      //convert into promise
      return lastValueFrom(ob$!);
    });

    // Promise.all -> all or nothing -> if one of them fails then the others will not be processed either
    Promise.all(promises)
      .then(() => {
        console.log('All categories deleted successfully');
        this.loadCategories();
      })
      .catch(error => {
        console.error('Failed to delete categories', error);
      });
  }

}

