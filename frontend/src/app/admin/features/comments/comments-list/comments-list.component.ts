import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommentService } from '../../../../core/services/comment.service';
import { IComment } from '../../../../core/interfaces/models/comment.model.interface';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIcon } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';

import moment from 'moment';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-comments-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIcon,
    RouterModule
  ],
  templateUrl: './comments-list.component.html',
  styleUrl: './comments-list.component.scss'
})
export class CommentsListComponent {

  route = inject(ActivatedRoute);
  commentService = inject(CommentService);

  displayedColumns: string[] = ['select', 'id', 'content', 'createdAt', 'updatedAt'];
  dataSource: MatTableDataSource<IComment> = new MatTableDataSource<IComment>([]);

  selection = new SelectionModel<IComment>(true, []);
  postId?: number;

  momentJs = moment;


  ngOnInit() {
    this.route.params.subscribe(params => {
      this.postId = params['postId'];
      this.loadComments(this.postId!);
    })
  }

  loadComments(postId: number) {
    this.commentService.getComments(postId).subscribe({
      next: (res) => {
        this.dataSource.data = res;
      },
      error: (err) => {
        console.log(err);
      }
    });
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
  checkboxLabel(row?: IComment): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'}`;
  }


  deleteSelectedComments() {
    const selectedComments = this.selection.selected;
    const selectedCommentsIds = selectedComments.map((comment: IComment) => comment.id);

    let promises = selectedCommentsIds.map(commentId => {
      const ob$ = this.commentService.deleteComment(commentId);
      //convert into promise
      return lastValueFrom(ob$!);
    });

    // Promise.all -> all or nothing -> if one of them fails then the others will not be processed either
    Promise.all(promises)
      .then(() => {
        console.log('All comments deleted successfully');
        this.loadComments(this.postId!);
      })
      .catch(error => {
        console.error('Failed to delete comments', error);
      });
  }



}
