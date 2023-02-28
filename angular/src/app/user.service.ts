import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { User } from './interface/User';
import { Observable } from 'rxjs';
const GET_HEADERS = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  }),
  responseType: 'text' as 'json'
};

@Injectable({
  providedIn: 'root'
})
export class UserService {
  url = 'http://52.34.132.33:8081';
  constructor(private http: HttpClient) { }

  addUser(newUser: User): Observable<any> {
    return this.http.post<any>(this.url + `/user/addNewUser`, newUser, GET_HEADERS);
  }

  getUser(emailId: string): Observable<any> {
    return this.http.get<any>(this.url + '/user/getUser/' + emailId);
  }

  getAllUsers(): Observable<any> {
    console.log(this.url);
    return this.http.get<any>(this.url + '/user/getUsers');
  }

  deleteUser(userId: number): Observable<any> {
    return this.http.delete<any>(this.url + '/user/deleteUser/' + userId);
  }
  updateUser(user: User): Observable<any> {
    console.log(user);
    return this.http.put<any>(this.url + `/user/updateUser`, user, GET_HEADERS);
  }
}
