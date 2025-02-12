import { SelectionModel } from '@angular/cdk/collections';
import { Component, inject, resolveForwardRef } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIcon } from '@angular/material/icon';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { Router, RouterModule } from '@angular/router';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

import moment from 'moment';
import { lastValueFrom } from 'rxjs';

import { ITag } from '../../../../core/interfaces/models/tag.model.interface';
import { TagService } from '../../../../core/services/tag.service';
import { TableComponent } from '../../../../core/components/table/table.component';
import { TagsTableDefinition } from './models/tags-list.definition';
import { Column } from '../../../../core/interfaces/models/table-column.model.interface';

@Component({
  selector: 'app-tags-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIcon,
    RouterModule,
    TableComponent,
    MatPaginatorModule
  ],
  templateUrl: './tags-list.component.html',
  styleUrl: './tags-list.component.scss'
})
export class TagsListComponent {


  tagService = inject(TagService);
  router = inject(Router);

  momentJs = moment;

  tableCols: Column[] = [];
  pageIndex = 0;
  pageSize = 5;
  totalResults = 0;
  dataSource: MatTableDataSource<ITag> = new MatTableDataSource<ITag>([]);
  defaultSortField = 'name';
  selection = new SelectionModel<ITag>(true, []);
  selectedTagsIds = new Set<number>;


  ngOnInit(): void {
    this.tableCols = JSON.parse(JSON.stringify(TagsTableDefinition));
    this.getTags(0, 5).subscribe(response => {
      this.dataSource.data = response.partialElements;
      this.totalResults = response.total;
    })
  }

  getTags(pageIndex: number, pageSize: number) {
    return this.tagService.getTagsPaginated(this.buildSearchRequest(pageIndex, pageSize));
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getTags(this.pageIndex, this.pageSize).subscribe({
      next: (response) => {
        this.dataSource.data = response.partialElements || [];
        this.totalResults = response.total || 0;
        this.reapplySelection();
      },
      error: (err) => {

      }
    })
  }

  onBodyCheckboxClicked(event: any) {
    if (event.checked) {
      this.selectedTagsIds.add(event.element.id);
      this.selection.select(event.element);
    } else {
      this.selectedTagsIds.delete(event.element.id);
      this.selection.deselect(event.element);
    }
  }

  onHeaderCheckboxClicked(event: any) {
    if (!event.checked) {
      this.dataSource.data.forEach(tag => this.selectedTagsIds.delete(tag.id));
      this.selection.clear();
    } else {
      this.dataSource.data.forEach(tag => {
        this.selectedTagsIds.add(tag.id);
        this.selection.select(tag);
      });
    }
  }

  onEditCategory(event: any) {
    this.router.navigate(['/admin/tags/edit', event.slug]);
  }

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
        // this.loadTags();
        const searchRequest = this.buildSearchRequest(this.pageIndex, this.pageSize);
        this.tagService.getTagsPaginated(searchRequest).subscribe({
          next: (response) => {
            this.dataSource.data = response.partialElements || [];
            this.totalResults = response.total || 0;
            this.reapplySelection();
          },
          error: (err) => {

          }
        });
      })
      .catch(error => {
        console.error('Failed to delete tags', error);
      });
  }

  reapplySelection() {
    this.selection.clear();
    this.dataSource.data.forEach(tag => {
      if (this.selectedTagsIds.has(tag.id)) {
        this.selection.select(tag);
      }
    });
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

}
