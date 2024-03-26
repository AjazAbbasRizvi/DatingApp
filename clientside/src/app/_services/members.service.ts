import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Member } from '../_model/member';
import { environment } from 'src/environments/environment';
import { map, of, take } from 'rxjs';
import { PaginatedResult } from '../_model/pagination';
import { UserParams } from '../_model/userParams';
import { AccountService } from './account.service';
import { User } from '../_model/User';

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  private baseUrl = environment.apiUrl;
  public members: Member[] = [];
  public memberCache = new Map();
  public user: User | undefined;
  public userParams: UserParams | undefined;

  constructor(
    private http: HttpClient,
    private accountService: AccountService
  ) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: (response) => {
        if (response) {
          this.userParams = new UserParams(response);
          this.user = response;
        }
      },
    });
  }

  getUserParams() {
    return this.userParams;
  }

  setUserParams(params: UserParams) {
    this.userParams = params;
  }

  resetUserParams() {
    if (this.user) {
      this.userParams = new UserParams(this.user);
      return this.userParams;
    }
  }

  getMembers(userParams: UserParams) {
    // if (this.members.length > 0) {
    //   return of(this.members);
    // }
    // const url = this.baseUrl + 'User';
    // return this.http.get<Member[]>(url).pipe(
    //   map((members) => {
    //     this.members = members;
    //     return members;
    //   })
    // );

    const url = this.baseUrl + 'User';

    const response = this.memberCache.get(Object.values(userParams).join('-'));

    if (response) {
      return of(response);
    }

    let params = this.getPaginationHeader(
      userParams.pageNumber,
      userParams.pageSize
    );

    params = params.append('MinAge', userParams.minAge);
    params = params.append('MaxAge', userParams.maxAge);
    params = params.append('Gender', userParams.gender);
    params = params.append('OrderBy', userParams.orderBy);

    return this.getPaginatedResult<Member[]>(url, params).pipe(
      map((response) => {
        this.memberCache.set(Object.values(userParams).join('-'), response);
        return response;
      })
    );
  }

  getMember(username: string) {
    const member: any[] = [...this.memberCache.values()].reduce(
      (arr: any[], elem) => arr.concat(elem.result),
      []
    );
    const getrequired: Member = member.find((member: Member) => {
      return member.userName === username;
    });

    if (getrequired) {
      return of(getrequired);
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

  setMainPhoto(photoId: number) {
    const url = this.baseUrl + 'user/set-main-photo/' + photoId;
    return this.http.put(url, {});
  }

  deletePhoto(photoId: number) {
    const url = this.baseUrl + 'user/delete-photo/' + photoId;
    return this.http.delete(url);
  }

  private getPaginationHeader(pageNumber: number, pageSize: number) {
    let params = new HttpParams();
    params = params.append('pageNumber', pageNumber);
    params = params.append('pageSize', pageSize);
    return params;
  }

  private getPaginatedResult<T>(url: string, params: HttpParams) {
    const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>();
    return this.http.get<T>(url, { observe: 'response', params }).pipe(
      map((response) => {
        if (response.body) {
          paginatedResult.result = response.body;
        }
        const pagination = response.headers.get('Pagination');
        if (pagination) {
          paginatedResult.pagination = JSON.parse(pagination);
        }
        return paginatedResult;
      })
    );
  }
}
