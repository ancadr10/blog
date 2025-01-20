import { Component, inject, Input } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { PostService } from '../../../../core/services/post.service';
import { IPost } from '../../../../core/interfaces/models/post.model.interface';
import { BehaviorSubject, combineLatest, distinctUntilChanged, switchMap } from 'rxjs';

@Component({
  selector: 'app-posts-list',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './posts-list.component.html',
  styleUrl: './posts-list.component.scss'
})
export class PostsListComponent {

  @Input() set categoryId(value: number | undefined) {
    this.categoryId$.next(value);    // emit new value when `categoryId` changes
  }
  @Input() set tagId(value: number | undefined) {
    this.tagId$.next(value);        // emit new value when `tagId` changes
  }

  private categoryId$ = new BehaviorSubject<number | undefined>(undefined);
  private tagId$ = new BehaviorSubject<number | undefined>(undefined);

  posts: IPost[] = [];
  postService = inject(PostService);

  constructor() {
    combineLatest([this.categoryId$, this.tagId$])  // when one source obs. emits, emit the latest values from each source as an array
      .pipe(
        distinctUntilChanged(), // Avoid duplicate emissions
        switchMap(([categoryId, tagId]) => {
          // Pass both filters to the service
          return this.postService.getPosts({ categoryId, tagId });
        })
      )
      .subscribe({
        next: (data) => {
          this.posts = data;
        },
        error: (err) => {
          console.error('Failed to load posts:', err);
          this.posts = [];
        },
      });
  }
}

