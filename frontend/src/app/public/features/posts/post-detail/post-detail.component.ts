import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PostService } from '../../../../core/services/post.service';
import { IPost } from '../../../../core/interfaces/models/post.model.interface';
import moment from 'moment';
import { IPostTag } from '../../../../core/interfaces/models/post-tag.model.interface';
import { TagService } from '../../../../core/services/tag.service';
import { IComment } from '../../../../core/interfaces/models/comment.model.interface';
import { CommentService } from '../../../../core/services/comment.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { MessageNotificationService } from '../../../../core/services/message-notification.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    TranslateModule
  ],
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.scss'
})
export class PostDetailComponent {

  route = inject(ActivatedRoute);
  postService = inject(PostService);
  tagService = inject(TagService);
  commentService = inject(CommentService);
  authService = inject(AuthService);
  messageNotificationService = inject(MessageNotificationService);

  post?: IPost;
  postTags: IPostTag[] = [];
  comments: IComment[] = [];

  momentJs = moment;

  fb = inject(FormBuilder);

  form = this.fb.group({
    content: ['']
  });

  constructor() { }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.loadPost(params['slug']);
    });
  }

  private loadPost(slug: string) {
    this.postService.getPostBySlug(slug).subscribe({
      next: (data: any) => {
        this.post = data;

        this.loadPostTags();
        this.loadComments();
      }
    });
  }

  private loadPostTags() {
    if (this.post) {
      this.tagService.getPostTags(this.post.id).subscribe((data) => {
        this.postTags = data;
      });
    }
  }

  private loadComments() {
    if (this.post) {
      this.commentService.getComments(this.post.id).subscribe((data) => {
        this.comments = data;
      })
    }
  }

  submitComment() {
    this.commentService.createComment(this.form.value.content!, this.post!.id).subscribe({
      next: () => {
        this.loadComments();
        this.form.reset();
        this.messageNotificationService.setMessage('Category was updated sucecssfully', 'success');
      },
      error: (err) => {
        if (err && err.error && err.error.message) {
          this.messageNotificationService.setMessage(err.error.message, 'error');
        }
        console.error(err);
      }
    });
  }
}
