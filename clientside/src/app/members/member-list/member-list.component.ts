import { Component, OnInit } from '@angular/core';
import { Observable, take } from 'rxjs';
import { User } from 'src/app/_model/User';
import { Member } from 'src/app/_model/member';
import { Pagination } from 'src/app/_model/pagination';
import { UserParams } from 'src/app/_model/userParams';
import { AccountService } from 'src/app/_services/account.service';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css'],
})
export class MemberListComponent implements OnInit {
  // public members$ : Observable<Member[]> | undefined;
  public members: Member[] = [];
  public pagination: Pagination | undefined;
  public userParams: UserParams | undefined;
  public user: User | undefined;
  public genderList = [
    { value: 'male', display: 'Males' },
    { value: 'female', display: 'Females' },
  ];

  constructor(private memberService: MembersService) {
    this.userParams = this.memberService.getUserParams();
  }

  ngOnInit() {
    this.loadMembers();
  }

  loadMembers() {
    if (this.userParams) {
      this.memberService.setUserParams(this.userParams);
      this.memberService.getMembers(this.userParams).subscribe({
        next: (response) => {
          if (response.result && response.pagination) {
            this.members = response.result;
            this.pagination = response.pagination;
          }
        },
      });
    }
  }

  pageChanged(event: any) {
    if (this.userParams !== event.page) {
      this.userParams.pageNumber = event.page;
      this.memberService.setUserParams(this.userParams);
      this.loadMembers();
    }
  }

  resetFilter() {
    this.userParams = this.memberService.resetUserParams();
    this.loadMembers();
  }
}
