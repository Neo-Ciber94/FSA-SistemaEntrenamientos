import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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

  request<T>(callback: (url: string, client: HttpClient) => T) {
    return callback(this.apiUrl, this.client);
  }

  post<T, R>(url: string, body?: T, options?: PostOptions): Observable<R> {
    return this.client.post<R>(`${this.apiUrl}/${url}`, body, options);
  }

  put<T, R>(url: string, body?: T, options?: PutOptions): Observable<R> {
    return this.client.put<R>(`${this.apiUrl}/${url}`, body, options);
  }

  delete<T>(url: string, options?: DeleteOptions): Observable<T> {
    return this.client.delete<T>(`${this.apiUrl}/${url}`, options);
  }

  get<T>(url: string, options?: GetOptions): Observable<T> {
    return this.client.get<T>(`${this.apiUrl}/${url}`, options);
  }
}

type PostOptions = {
  headers?:
    | HttpHeaders
    | {
        [header: string]: string | string[];
      };
  observe?: 'body';
  params?:
    | HttpParams
    | {
        [param: string]: string | string[];
      };
  reportProgress?: boolean;
  responseType?: 'json';
  withCredentials?: boolean;
};

type PutOptions = {
  headers?:
    | HttpHeaders
    | {
        [header: string]: string | string[];
      };
  observe?: 'body';
  params?:
    | HttpParams
    | {
        [param: string]: string | string[];
      };
  reportProgress?: boolean;
  responseType?: 'json';
  withCredentials?: boolean;
};

type DeleteOptions = {
  headers?:
    | HttpHeaders
    | {
        [header: string]: string | string[];
      };
  observe?: 'body';
  params?:
    | HttpParams
    | {
        [param: string]: string | string[];
      };
  reportProgress?: boolean;
  responseType?: 'json';
  withCredentials?: boolean;
};

type GetOptions = {
  headers?:
    | HttpHeaders
    | {
        [header: string]: string | string[];
      };
  observe?: 'body';
  params?:
    | HttpParams
    | {
        [param: string]: string | string[];
      };
  reportProgress?: boolean;
  responseType?: 'json';
  withCredentials?: boolean;
};
