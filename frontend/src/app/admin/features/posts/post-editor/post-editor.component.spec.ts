import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { PostEditorComponent } from './post-editor.component';
import { CategoryService } from '../../../../core/services/category.service';
import { PostService } from '../../../../core/services/post.service';
import { TagService } from '../../../../core/services/tag.service';

import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { PostsListComponent } from '../posts-list/posts-list.component';
import { BehaviorSubject, of } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { FormArray, ReactiveFormsModule } from '@angular/forms';

const mockPost = {
  id: 1,
  title: 'Test Post',
  content: 'Test Content',
  categoryId: 2,
  slug: 'test-post',
  userId: 1,
  user: {},
  category: {},
  createdAt: '',
  updatedAt: ''
};

const categoriesMock = [
  { id: 1, name: 'Category 1', slug: 'category-1', createdAt: '2025-01-01', updatedAt: '2025-01-01' }
];

const tagsMock = [
  { id: 1, name: 'Tag 1', slug: 'tag-1', userId: 1, createdAt: '2025-01-01', updatedAt: '2025-01-01' }
];


describe('PostEditorComponent', () => {
  let component: PostEditorComponent;
  let fixture: ComponentFixture<PostEditorComponent>;
  let router: Router;

  const mockRouteParams = new BehaviorSubject({ slug: 'test-slug' });

  const postServiceSpy = {
    getPostBySlug: jest.fn(() => of(mockPost)),
    addPost: jest.fn(() => of({})),
    updatePost: jest.fn(() => { }),
  };

  const categoryServiceSpy = {
    getCategories: jest.fn(() => of(categoriesMock)),
  };

  const tagServiceSpy = {
    getTags: jest.fn(() => of(tagsMock))
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostEditorComponent, BrowserAnimationsModule, ReactiveFormsModule],
      providers: [
        { provide: CategoryService, useValue: categoryServiceSpy },
        { provide: PostService, useValue: postServiceSpy },
        { provide: TagService, useValue: tagServiceSpy },
        provideRouter([
          { path: 'admin/posts', component: PostsListComponent }
        ]),
        {
          provide: ActivatedRoute,
          useValue: {
            params: mockRouteParams.asObservable(),
          },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();

    fixture = TestBed.createComponent(PostEditorComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);

  });

  it('should create', () => {
    expect(component).toBeTruthy();
    fixture.detectChanges();
  });

  it('should load categories - on init', () => {
    const loadCategoriesSpy = jest.spyOn(component, 'loadCategories');
    fixture.detectChanges();
    expect(loadCategoriesSpy).toHaveBeenCalled();
  });


  it('should load tags - on init', () => {
    const loadTagsSpy = jest.spyOn(component, 'loadTags');
    fixture.detectChanges();
    expect(loadTagsSpy).toHaveBeenCalled();
  });

  it('should populate the form when a slug is present', () => {
    fixture.detectChanges();

    expect(postServiceSpy.getPostBySlug).toHaveBeenCalled();

    expect(component.form.value.id).toEqual('1');
    expect(component.form.value.title).toEqual('Test Post');
    expect(component.form.value.content).toEqual('Test Content');
  });


  it('should create post', fakeAsync(() => {
    fixture.detectChanges();  // ensure form is initialized
    tick();

    component.form.controls['id'].setValue('');
    component.form.controls['title'].setValue('Test Post');
    component.form.controls['content'].setValue('Test Content');
    component.form.controls['categoryId'].setValue(1);

    const tagIds = component.form.get('tagIds') as FormArray;
    tagIds.push(component.fb.control(1));

    const createSpy = jest.spyOn(component, 'create');
    const routerSpy = jest.spyOn(router, 'navigate');
    const debugElement = fixture.debugElement.query(By.css('form'));
    debugElement.triggerEventHandler('submit', null);
    tick();
    fixture.detectChanges();

    expect(createSpy).toHaveBeenCalled();
    expect(routerSpy).toHaveBeenCalledWith(['/admin/posts']);
  }));




});


