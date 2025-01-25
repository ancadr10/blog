import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostEditorComponent } from './post-editor.component';
import { CategoryService } from '../../../../core/services/category.service';
import { PostService } from '../../../../core/services/post.service';
import { TagService } from '../../../../core/services/tag.service';

import { provideRouter } from '@angular/router';
import { PostsListComponent } from '../posts-list/posts-list.component';
import { of } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

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

  const postServiceSpy = {
    getPostBySlug: jest.fn(() => { }),
    addPost: jest.fn(() => { }),
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
      imports: [PostEditorComponent, BrowserAnimationsModule],
      providers: [
        { provide: CategoryService, useValue: categoryServiceSpy },
        { provide: PostService, useValue: postServiceSpy },
        { provide: TagService, useValue: tagServiceSpy },
        provideRouter([
          { path: 'admin/posts', component: PostsListComponent }
        ])
      ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();

    fixture = TestBed.createComponent(PostEditorComponent);
    component = fixture.componentInstance;

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

  it('should load tags - on', () => {
    const loadTagsSpy = jest.spyOn(component, 'loadTags');
    fixture.detectChanges();
    expect(loadTagsSpy).toHaveBeenCalled();
  });

});


