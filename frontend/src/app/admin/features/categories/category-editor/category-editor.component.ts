import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { CategoryService } from '../../../../core/services/category.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ICategory } from '../../../../core/interfaces/models/category.model.interface';

@Component({
  selector: 'app-category-editor',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule
  ],
  templateUrl: './category-editor.component.html',
  styleUrl: './category-editor.component.scss'
})
export class CategoryEditorComponent {

  fb = inject(FormBuilder);
  categoryService = inject(CategoryService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  category: ICategory | undefined;

  form = this.fb.group({
    name: ['', [Validators.required]],
    id: ['']
  });

  ngOnInit() {

    this.route.params.subscribe((data) => {
      const slug = data['slug'];
      if (slug) {

        this.categoryService.getCategoryBySlug(slug).subscribe((category) => {
          this.category = category;
          this.form.patchValue({
            id: category.id + '',
            name: category.name
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

    this.categoryService.addCategory({ name: this.form.value.name! }).subscribe({
      next: (res) => {
        this.router.navigate(['/admin/categories']);
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

    this.categoryService.updateCategory(payload).subscribe(() => {
      alert('Category updated');
    });
  }

}
