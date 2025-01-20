import { SelectionModel } from '@angular/cdk/collections';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIcon } from '@angular/material/icon';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { RouterModule } from '@angular/router';

import moment from 'moment';
import { lastValueFrom } from 'rxjs';

import { ICategory } from '../../../../core/interfaces/models/category.model.interface';
import { ITag } from '../../../../core/interfaces/models/tag.model.interface';
import { TagService } from '../../../../core/services/tag.service';

@Component({
  selector: 'app-tags-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIcon,
    RouterModule
  ],
  templateUrl: './tags-list.component.html',
  styleUrl: './tags-list.component.scss'
})
export class TagsListComponent {


  tagService = inject(TagService);

  displayedColumns: string[] = ['select', 'id', 'name', 'createdAt', 'updatedAt', 'actions'];
  dataSource: MatTableDataSource<ITag> = new MatTableDataSource<ITag>([]);

  selection = new SelectionModel<ITag>(true, []);

  momentJs = moment;


  ngOnInit(): void {
    this.loadTags();
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
  checkboxLabel(row?: ITag): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'}`;
  }

  loadTags() {
    this.tagService.getTags().subscribe({
      next: (data: ITag[]) => {
        this.dataSource.data = data;
      },
      error: (err) => {
        console.log(err);
      }
    })
  };

  deleteSelectedTags() {
    const selectedTags = this.selection.selected;
    const selectedTagsIds = selectedTags.map((tag: ITag) => tag.id);

    let promises = selectedTagsIds.map(tagId => {
      const ob$ = this.tagService.deleteTag(tagId);
      //convert into promise
      return lastValueFrom(ob$!);
    });

    // Promise.all -> all or nothing -> if one of them fails then the others will not be processed either
    Promise.all(promises)
      .then(() => {
        console.log('All tags deleted successfully');
        this.loadTags();
      })
      .catch(error => {
        console.error('Failed to delete tags', error);
      });
  }

}
