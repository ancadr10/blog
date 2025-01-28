import { HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslationObject } from '@ngx-translate/core';
import { catchError, forkJoin, map, Observable, of } from 'rxjs';


export class ModuleTranslateLoader implements TranslateLoader {

    constructor(
        private http: HttpClient,
        private modules: string[]
    ) {
        if (!modules || modules.length === 0) {
            throw new Error('Paths array is required for MultiTranslateLoader!');
          }
     }

    getTranslation(lang: string): Observable<TranslationObject> {
        const requests$ = this.modules.map((module) => {
            return this.http.get(`assets/i18n/${module}/${lang}.json`)
                .pipe(
                    catchError(() => of({}))
                );
        });

        return forkJoin(requests$).pipe(
            map((responses) =>
                responses.reduce(
                    (acc, currentTranslations) => ({ ...acc, ...currentTranslations }),
                    {}
                )
            )
        );
    }

}

export function createTranslateLoader(http: HttpClient, modules: string[]) {
    return new ModuleTranslateLoader(http, [
        'public'
    ]);
}