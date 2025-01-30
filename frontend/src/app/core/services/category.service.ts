import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ICategory } from '../interfaces/models/category.model.interface';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  baseUrl = environment.BACKEND_API_URL + '/api/categories';

  httpClient = inject(HttpClient);
  authService = inject(AuthService);

  constructor() { }

  getCategoryBySlug(slug: string) {
    return this.httpClient.get<ICategory>(`${this.baseUrl}/slug/${slug}`);
  }

  getCategories() {
    return this.httpClient.get<ICategory[]>(this.baseUrl);
  }

  getCategoriesPaginated(searchRequest: any) {
    return this.httpClient.post<any>(`${this.baseUrl}/categories-paginated`, searchRequest);
  }

  addCategory({ name }: { name: string }) {
    return this.httpClient.post<ICategory>(this.baseUrl, { name });
  }

  updateCategory({ id, name }: { id: number, name: string }) {
    return this.httpClient.put<ICategory>(this.baseUrl, { id, name });
  }

  deleteCategory(id: number) {
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
