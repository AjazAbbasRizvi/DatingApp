import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { User } from '../_model/User';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private baseUrl: string = 'https://localhost:7161/api/';
  private currentUserSource = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient) {}

  logIn(model: any) {
    const url = this.baseUrl + 'account/login';
    return this.http.post<User>(url, model).pipe(
      map((response: User) => {
        const user = response;
        localStorage.setItem('user', JSON.stringify(user));
        this.currentUserSource.next(user);
      })
    );
  }

  setCurrentUser(user: User) {
    this.currentUserSource.next(user);
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
  }

  registerUser(model: any) {
    const url = this.baseUrl + 'account/register';
    return this.http.post<User>(url, model).pipe(
      map((user) => {
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserSource.next(user);
          return user;
        }
      })
    );
  }
}
