import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { PostService } from './post.service';
import { provideHttpClient } from '@angular/common/http';
import { IPost } from '../interfaces/models/post.model.interface';
import { IUser } from '../interfaces/models/user.model.interface';
import { ICategory } from '../interfaces/models/category.model.interface';

const mockPost = {
  id: 1,
  title: 'Test Post',
  content: 'Test Content',
  categoryId: 2,
  slug: 'test-post',
  userId: 1,
  user: {} as IUser,
  category: {} as ICategory,
  createdAt: '',
  updatedAt: ''
};

describe('PostService', () => {
  let service: PostService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PostService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    httpTesting = TestBed.inject(HttpTestingController);
    service = TestBed.inject(PostService);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get posts', () => {
    let posts: IPost[] = [];
    service.getPosts({ categoryId: 1, tagId: 2 }).subscribe((response) => {
      posts = response;
    });

    const req = httpTesting.expectOne('http://localhost:3000/api/posts?categoryId=1&tagId=2');
    req.flush([mockPost]);

    expect(req.request.method).toBe('GET');
    expect(posts).toEqual([mockPost]);
    expect(posts[0].id).toBe(mockPost.id);
  });
});
