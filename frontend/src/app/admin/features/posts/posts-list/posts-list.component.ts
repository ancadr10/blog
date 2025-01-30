import { SelectionModel } from '@angular/cdk/collections';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIcon } from '@angular/material/icon';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import moment from 'moment';
import { lastValueFrom } from 'rxjs';
import { PostService } from '../../../../core/services/post.service';
import { IPost } from '../../../../core/interfaces/models/post.model.interface';

@Component({
  selector: 'app-posts-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIcon,
    RouterModule
  ],
  templateUrl: './posts-list.component.html',
  styleUrl: './posts-list.component.scss'
})
export class PostsListComponent {

  postService = inject(PostService);

  displayedColumns: string[] = ['select', 'id', 'title', 'totalComments', 'categoryId', 'createdAt', 'updatedAt', 'actions'];
  dataSource: MatTableDataSource<IPost> = new MatTableDataSource<IPost>([]);

  selection = new SelectionModel<IPost>(true, []);

  momentJs = moment;


  ngOnInit(): void {
    this.loadPosts();
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
  checkboxLabel(row?: IPost): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'}`;
  }

  onRowClicked(row: IPost) {
    console.log('clicked row ', row);
  }

  loadPosts() {
    this.postService.getPosts({}).subscribe({
      next: (data: IPost[]) => {
        this.dataSource.data = data;
      },
      error: (err) => {
        console.log(err);
      }
    });
  };

  deleteSelectedPosts() {
    const selectedPosts = this.selection.selected;
    const selectedPostsIds = selectedPosts.map((post: IPost) => post.id);

    let promises = selectedPostsIds.map(postId => {
      const ob$ = this.postService.deletePost(postId);
      //convert into promise
      return lastValueFrom(ob$!);
    });

    // Promise.all -> all or nothing -> if one of them fails then the others will not be processed either
    Promise.all(promises)
      .then(() => {
        console.log('All posts deleted successfully');
        this.loadPosts();
      })
      .catch(error => {
        console.error('Failed to delete posts', error);
      });
  }

}
