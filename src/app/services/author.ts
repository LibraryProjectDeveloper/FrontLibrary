import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {AuthorModel} from '../model/Author';
import {environment} from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class Author {
  author: AuthorModel[] = [];
  url = environment.apiUrl+'/author/';
  constructor(private http: HttpClient) { }

  getAuthor(name:string,lastName:string){
    return this.http.get<AuthorModel[]>(`${this.url}buscar?names=${name}&lastname=${lastName}`);
  }
}
