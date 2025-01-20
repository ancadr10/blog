import { Component, inject } from '@angular/core';
import { PostDetailComponent } from '../../posts/post-detail/post-detail.component';
import { PostsListComponent } from '../../posts/posts-list/posts-list.component';
import { ActivatedRoute } from '@angular/router';
import { TagService } from '../../../../core/services/tag.service';
import { ITag } from '../../../../core/interfaces/models/tag.model.interface';

@Component({
  selector: 'app-tag-detail',
  standalone: true,
  imports: [
    PostsListComponent
  ],
  templateUrl: './tag-detail.component.html',
  styleUrl: './tag-detail.component.scss'
})
export class TagDetailComponent {

  route = inject(ActivatedRoute);
  tagService = inject(TagService);

  tag?: ITag;

  constructor() {
    this.route.params.subscribe(params => {
      const slug = params['tag'];

      this.loadTag(slug);
    });
  }

  private loadTag(slug: string) {
    this.tagService.getTagBySlug(slug).subscribe((data) => {
      this.tag = data;
    })
  }

}
