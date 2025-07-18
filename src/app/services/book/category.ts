import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private url = environment.apiUrl+"/LIBRARIAN/books/categories";
  constructor(private http:HttpClient) { }
  getCategories(){
    return this.http.get<String[]>(this.url);
  }
}
