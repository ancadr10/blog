import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router, ActivatedRoute } from '@angular/router';
import { MatChipsModule } from '@angular/material/chips';

import { ICategory } from '../../../../core/interfaces/models/category.model.interface';
import { IPost } from '../../../../core/interfaces/models/post.model.interface';
import { ITag } from '../../../../core/interfaces/models/tag.model.interface';
import { CategoryService } from '../../../../core/services/category.service';
import { PostService } from '../../../../core/services/post.service';
import { TagService } from '../../../../core/services/tag.service';

@Component({
  selector: 'app-post-editor',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatSelectModule,
    MatChipsModule,
    MatIconModule
  ],
  templateUrl: './post-editor.component.html',
  styleUrl: './post-editor.component.scss'
})
export class PostEditorComponent {
  fb = inject(FormBuilder);
  postService = inject(PostService);
  categoryService = inject(CategoryService);
  tagService = inject(TagService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  post: IPost | undefined;
  categories: ICategory[] = [];
  tags: ITag[] = [];

  showTagsDropdown = false;

  form = this.fb.group({
    title: ['', Validators.required],
    id: [''],
    content: ['', Validators.required],
    categoryId: [null, Validators.required],
    tagIds: this.fb.array([]),
  });

  get selectedTags() {
    return this.tags.filter((tag) => {
      return this.form.value.tagIds?.includes(tag.id);
    });
  }

  ngOnInit() {
    this.loadCategories();
    this.loadTags();

    this.route.params.subscribe((data) => {
      const slug = data['slug'];
      if (slug) {
        this.postService.getPostBySlug(slug).subscribe((post) => {
          this.post = post;

          this.form.patchValue({
            id: post.id + '',
            title: post.title,
            content: post.content,
            categoryId: post.categoryId as any,
          });


          this.form.updateValueAndValidity();

          this.tagService.getPostTags(post.id).subscribe((tags) => {
            const tagIds = tags.map(tag => tag.tagId);

            const tagIdsFormArray = this.form.get('tagIds') as FormArray;

            tagIds.forEach((tagId) => {
              tagIdsFormArray.push(this.fb.control(tagId));
            });
          });

        });
      }

    });
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe((categories) => {
      this.categories = categories;
    })
  }

  loadTags() {
    this.tagService.getTags().subscribe((tags) => {
      this.tags = tags;
    });
  }

  create() {
    if (this.form.invalid) {
      return;
    }

    const payload = {
      title: this.form.value.title!,
      content: this.form.value.content!,
      categoryId: this.form.value.categoryId!,
      tagIds: this.form.value.tagIds as any[]
    };
    this.postService.addPost(payload).subscribe(() => {
      this.router.navigate(['/admin/posts'])
    });
  }

  update() {
    if (this.form.invalid) return;

    const payload = {
      id: parseInt(this.form.value.id!),
      title: this.form.value.title!,
      content: this.form.value.content!,
      categoryId: this.form.value.categoryId!,
      tagIds: this.form.value.tagIds as any[]
    };

    this.postService.updatePost(payload).subscribe(() => {
      alert('Post updated');
    });
  }

  addTag(tagId: number) {
    const tagIdsFormArray = this.form.get('tagIds') as FormArray;
    tagIdsFormArray.push(this.fb.control(tagId));

    // hide tags dropdown
    this.showTagsDropdown = false;
  }


  removeTag(tagId: number) {
    const tagIdsFormArray = this.form.get('tagIds') as FormArray;
    const index = tagIdsFormArray.controls.findIndex((control) => {
      return control.value === tagId;
    });

    tagIdsFormArray.removeAt(index);
  }

}
