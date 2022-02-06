import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse,HttpBackend  } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  private rootPath = 'http://jovuko.pythonanywhere.com';
  private localPath = 'http://127.0.0.1:5000';

  constructor(private _http: HttpClient, private _httpb: HttpBackend) { }

  getMFCC(file: File, params?: HttpParams): Observable<Blob> {
    let fd = new FormData();
    fd.append('file', file);
    return this._http.post(`${this.rootPath}/audio`, fd, { responseType: 'blob', params});
  }

  /*getMFcc(params?: HttpParams): Observable<Blob>  {
    return this._http.get(`${this.rootPath}/mfcc`,{  responseType: 'blob', params })
  }*/

  /*chooseDir(): Promise<{ f_path: string }> {
    return this._http.get<any>(`${this.rootPath}/choosedir`).toPromise().catch(() => ({ f_path: null }));
  }

  chooseFile(): Promise<{ f_path: string, f_name: string }> {
    return this._http.get<any>(`${this.rootPath}/choosefile`).toPromise().catch(() => ({ f_path: null, f_name: null }));
  }

  upload(file: File, params?: HttpParams): Observable<HttpResponse<{ filename: string }>> {
    let fd = new FormData();
    fd.append('file', file);
    return this._http.post<any>(`${this.rootPath}/upload`, fd, { observe: 'response', params });
  }

  open(params?: HttpParams) {
    return this._http.get(`${this.rootPath}/open`,{  observe: 'response', params })
  }

  checkDMS(){
    let httpClient = new HttpClient(this._httpb);
    return httpClient.get(`${this.rootPath}`,{  responseType: 'text' })    
  }*/


}
