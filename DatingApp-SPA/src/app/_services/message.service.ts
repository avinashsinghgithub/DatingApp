import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../_models/user';
import { PaginatedResult } from '../_models/Pagination';
import { map } from 'rxjs/operators';
import { Message } from '../_models/message';
@Injectable({
    providedIn: 'root'
  })
export class MessageSerice {
    
    baseUrl = environment.apiUrl;
    constructor(private http: HttpClient) { }
    getMessages(id: number, page?, itemPerPage?, messageContainer?){
        const paginatedResult: PaginatedResult<Message[]> =
        new PaginatedResult<Message[]>();
        let params = new HttpParams();
        params = params.append('MessageContainer', messageContainer);
        if (page != null && itemPerPage != null) {
          params = params.append('pageNumber', page);
          params = params.append('pageSize', itemPerPage);
        }
        return this.http.get<Message[]>(this.baseUrl + 'users/' + id + '/messages', {observe: 'response',
            params}).pipe(map(response => {
              paginatedResult.result = response.body;
              if (response.headers.get('Pagination') != null) {
                paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
              }
    
              return paginatedResult;
      }));
    }
    getMessageThread(id: number, recipientId: number ){
      return this.http.get<Message[]>(this.baseUrl + 'users/' + id + '/messages/thread/' + recipientId);
    }
    sendMessage(id: number,recipientId: number, content: string){
      return this.http.post<Message>(this.baseUrl + 'users/' + id + '/messages',{recipientId: recipientId, content})
    }
}