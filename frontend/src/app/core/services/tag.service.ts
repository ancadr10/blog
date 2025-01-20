import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { IPostTag } from '../interfaces/models/post-tag.model.interface';
import { ITag } from '../interfaces/models/tag.model.interface';

@Injectable({
  providedIn: 'root'
})
export class TagService {

  baseUrl = environment.BACKEND_API_URL + '/api/tags';

  httpClient = inject(HttpClient);


  constructor() { }

  getPostTags(postId: number) {
    return this.httpClient.get<IPostTag[]>(`${this.baseUrl}/getPostTagRelations/${postId}`);
  }


  getTagBySlug(slug: string) {
    console.log('xxx = ', this.baseUrl);
    return this.httpClient.get<ITag>(`${this.baseUrl}/getTagBySlug/${slug}`);
  }

  getTags() {
    return this.httpClient.get<ITag[]>(this.baseUrl);
  }

  addTag({ name }: { name?: string }) {
    return this.httpClient.post<ITag>(this.baseUrl, { name });
  }

  updateTag({ id, name }: { id: number, name: string }) {
    return this.httpClient.put<ITag>(this.baseUrl, { id, name });
  }

  deleteTag(id: number) {
    return this.httpClient.delete(`${this.baseUrl}`, { body: { id } });
  }

  //// => interceptor
  // deleteCategory(id: number) {
  //   const ob$ = this.httpClient.delete(`${this.baseUrl}`, { body: { id } })
  //     .pipe(share());

  //   ob$.subscribe({
  //     error: (err) => {
  //       //check the unauthorized status
  //       if (err.status === 401) {
  //         this.authService.logout();
  //       }
  //     }
  //   })

  //   return ob$;
  // }
}
