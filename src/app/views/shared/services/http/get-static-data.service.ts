import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { Category } from '../../models/search-category.interface';


@Injectable({
  providedIn: 'root'
})
export class GetStaticDataService {

  private http = inject(HttpClient);

  getClearCategoryIcons() {
    return this.http.get<Category[]>('/assets/data/clear-icons.json');
  }

}
