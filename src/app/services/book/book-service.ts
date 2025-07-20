import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthorModel } from '../../model/Author';
import { environment } from '../../../environment/environment';

export interface Book {
  codeBook: number;
  title: string;
  isbn: string;
  publicationDate: string;
  publisher: string;
  category: string;
  stockTotal: number;
  state: string;
  author: AuthorModel[];
}

export interface BookResponse {
  codeBook: number;
  title: string;
  isbn: string;
  publicationDate: string;
  publisher: string;
  category: string;
  stockTotal: number;
  state: string;
}
export interface BookReport {
  codeBook: number;
  isbn: string;
  title: string;
  category: string;
  publicationDate: string;
  publisher: string;
  quantity: number;
}
export interface BookReportRequest {
  dateStart: string;
  dateEnd: string;
  category: string;
}
export interface CountBookByCategory {
  category: string;
  count: number;
}
@Injectable({
  providedIn: 'root',
})
export class BookService {
  private url = environment.apiUrl + '/LIBRARIAN/books';
  constructor(private http: HttpClient) {}
  getBooks() {
    return this.http.get<Book[]>(this.url + '/state/ACTIVO');
  }

  getBookCategory(category: string): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.url}/categoria/${category}`);
  }

  searchCategory(category: string): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.url}/book-info/category/${category}`);
  }

  getBookState(state: string): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.url}/state/${state}`);
  }

  getBookYear(year: number): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.url}/year/${year}`);
  }

  CountBookByCategory(): Observable<CountBookByCategory[]> {
    return this.http.get<CountBookByCategory[]>(
      `${this.url}/countBooksLoanedByCategory`
    );
  }

  addBook(book: Book) {
    return this.http.post<Book>(`${this.url}/add`, book);
  }

  putBook(book: Book, id: number) {
    return this.http.put<Book>(`${this.url}/update/${id}`, book);
  }
  getBuscarTitle(title: string): Observable<Book[]> {
    return this.http.get<Book[]>(
      `${this.url}/book-info/searchTitle?title=${title}`
    );
  }

  getBuscarCategory(category: string): Observable<Book[]> {
    return this.http.get<Book[]>(
      `${this.url}/searchCategory?category=${category}`
    );
  }
  getReport(
    dateStart: string,
    dateEnd: string,
    category: string
  ): Observable<BookReport[]> {
    return this.http.get<BookReport[]>(`${this.url}/report`, {
      params: { dateStart, dateEnd, category },
    });
  }
  getReportExcel(request: BookReportRequest): Observable<HttpResponse<Blob>> {
    return this.http.post<Blob>(`${this.url}/download-report`, request, {
      responseType: 'blob' as 'json',
      observe: 'response',
    });
  }
  deleteBook(id: number) {
    return this.http.delete<Book>(`${this.url}/delete/${id}`);
  }

  getBookAvailable(): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.url}/book-info/available`);
  }

  searchAutor(authorName: string): Observable<Book[]> {
    return this.http.get<Book[]>(
      `${this.url}/book-info/searchAuthor?authorName=${authorName}`
    );
  }
}
