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

  post<T, R>(
    url: string,
    body?: T,
    options: HttpOptions = {
      responseType: 'json',
      contentType: 'json',
      observe: 'body',
    }
  ): Observable<R> {
    setHeaders(options);

    // prettier-ignore
    return this.client.post<R>(`${this.apiUrl}/${url}`, body, options as any) as unknown as Observable<R>;
  }

  put<T, R>(
    url: string,
    body?: T,
    options: HttpOptions = {
      responseType: 'json',
      contentType: 'json',
      observe: 'body',
    }
  ): Observable<R> {
    setHeaders(options);
    // prettier-ignore
    return this.client.put<R>(`${this.apiUrl}/${url}`, body, options as any) as unknown as Observable<R>;
  }

  delete<T>(
    url: string,
    options: HttpOptions = {
      responseType: 'json',
      contentType: 'json',
      observe: 'body',
    }
  ): Observable<T> {
    setHeaders(options);
    // prettier-ignore
    return this.client.delete<T>(`${this.apiUrl}/${url}`, options as any)  as unknown as Observable<T>;
  }

  get<T>(
    url: string,
    options: HttpOptions = {
      responseType: 'json',
      contentType: 'json',
      observe: 'body',
    }
  ): Observable<T> {
    setHeaders(options);
    // prettier-ignore
    return this.client.get<T>(`${this.apiUrl}/${url}`, options as any)  as unknown as Observable<T>;
  }
}

type ContentType = 'json' | 'text' | undefined;
type Observe = 'body' | 'events' | 'response';
type ResponseType = 'arraybuffer' | 'blob' | 'json' | 'text';

type HttpOptions = {
  headers?:
    | HttpHeaders
    | {
        [header: string]: string | string[];
      };
  observe?: Observe;
  params?:
    | HttpParams
    | {
        [param: string]: string | string[];
      };
  reportProgress?: boolean;
  responseType?: ResponseType;
  contentType?: ContentType;
  rawContentType?: string;
  withCredentials?: boolean;
};

function setHeaders(options: HttpOptions) {
  let contentType: string | undefined;

  switch (options.contentType || 'json') {
    case 'json':
      contentType = 'application/json';
      break;
    case 'text':
      contentType = 'text/plain';
      break;
    default:
      contentType = options.rawContentType;
      break;
  }

  if (contentType) {
    options.headers = {
      'content-type': contentType,
      ...options.headers,
    };
  }
}
