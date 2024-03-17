import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Member } from '../_model/member';
import { environment } from 'src/environments/environment';
import { map, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  private baseUrl = environment.apiUrl;
  public members: Member[] = [];

  constructor(private http: HttpClient) {}

  getMembers() {
    if (this.members.length > 0) {
      return of(this.members);
    }
    const url = this.baseUrl + 'User';
    return this.http.get<Member[]>(url).pipe(
      map((members) => {
        this.members = members;
        return members;
      })
    );
  }

  getMember(username: string) {
    if (this.members.length > 0) {
      const member = this.members.find((x) => x.userName === username);
      if (member) {
        return of(member);
      }
    }
    const url = this.baseUrl + 'User/' + username;
    return this.http.get<Member>(url);
  }

  updateMember(member: Member) {
    const url = this.baseUrl + 'User';
    return this.http.put(url, member).pipe(
      map(() => {
        const index = this.members.indexOf(member);
        this.members[index] = { ...this.members[index], ...member };
      })
    );
  }
}
