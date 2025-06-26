import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {AuthorModel} from '../model/Author';

@Injectable({
  providedIn: 'root'
})
export class Author {
  author: AuthorModel[] = [];
  url = 'http://localhost:8080/api/author/';
  constructor(private http: HttpClient) { }

  getAuthor(name:string,lastName:string){
    return this.http.get<AuthorModel[]>(`${this.url}buscar?names=${name}&lastname=${lastName}`);
  }
}
