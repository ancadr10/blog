import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, ActivatedRoute } from '@angular/router';
import { TagService } from '../../../../core/services/tag.service';
import { ITag } from '../../../../core/interfaces/models/tag.model.interface';

@Component({
  selector: 'app-tag-editor',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule
  ],
  templateUrl: './tag-editor.component.html',
  styleUrl: './tag-editor.component.scss'
})
export class TagEditorComponent {

  fb = inject(FormBuilder);
  tagService = inject(TagService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  tag: ITag | undefined;

  form = this.fb.group({
    name: ['', [Validators.required]],
    id: ['']
  });

  ngOnInit() {

    this.route.params.subscribe((data) => {
      console.log('555555555555555555555555');
      const slug = data['slug'];
      if (slug) {

        this.tagService.getTagBySlug(slug).subscribe((tag) => {
          this.tag = tag;
          this.form.patchValue({
            id: tag.id + '',
            name: tag.name
          })
          this.form.updateValueAndValidity();
        });
      }
    });

  }

  create() {
    if (this.form.invalid) {
      return;
    }

    this.tagService.addTag({ name: this.form.value.name! }).subscribe({
      next: (res) => {
        this.router.navigate(['/admin/tags']);
      },
      error: (err) => {

      }
    });
  }

  update() {
    if (this.form.invalid) {
      return;
    }

    const payload = {
      id: parseInt(this.form.value.id!),
      name: this.form.value.name!
    };

    this.tagService.updateTag(payload).subscribe(() => {
      alert('Tag updated');
    });
  }


}
