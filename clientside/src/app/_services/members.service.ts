import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Member } from '../_model/member';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  private baseUrl = environment.apiUrl;
   
  constructor(private http : HttpClient) { }

  getMembers(){
    const url = this.baseUrl + 'User';
    return this.http.get<Member[]>(url);
  }

  getMember(username : string){
    const url = this.baseUrl + 'User/' + username;
    return this.http.get<Member>(url);
  }

}
