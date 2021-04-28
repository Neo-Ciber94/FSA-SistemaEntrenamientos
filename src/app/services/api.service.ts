import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(
    readonly client: HttpClient,
    @Inject('API_URL') readonly apiUrl: string
  ) {}

  post<T, R>(
    url: string,
    body?: T,
    params?: Record<string, string>
  ): Observable<R> {
    return this.client.post<R>(`${this.apiUrl}/${url}`, body, { params });
  }

  put<T, R>(
    url: string,
    body?: T,
    params?: Record<string, string>
  ): Observable<R> {
    return this.client.put<R>(`${this.apiUrl}/${url}`, body, { params });
  }

  delete<T>(url: string, params?: Record<string, string>): Observable<T> {
    return this.client.delete<T>(`${this.apiUrl}/${url}`, { params });
  }

  get<T>(url: string, params?: Record<string, string>): Observable<T> {
    return this.client.get<T>(`${this.apiUrl}/${url}`, { params });
  }
}
