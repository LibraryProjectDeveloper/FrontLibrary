import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private url = "http://localhost:8080/api/LIBRARIAN/books/categories";
  constructor(private http:HttpClient) { }
  getCategories(){
    return this.http.get<String[]>(this.url);
  }
}
