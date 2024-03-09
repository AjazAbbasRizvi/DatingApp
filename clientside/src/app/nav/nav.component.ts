import { Component, OnInit } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from '../_model/User';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit {
  user : User;
  model: any = {};
  isLoggedIn: boolean = false;
  logInClicked: boolean = false;

  constructor(private accountService: AccountService, 
    private router : Router,
    private toast : ToastrService) {}

  ngOnInit(): void {
    this.getCurrentUser();
  }

  getCurrentUser() {
    this.accountService.currentUser$.subscribe({
      next: (response) => {
        if (response != null) {
          this.user = response;
          this.isLoggedIn = true;
        }
        else{
          this.isLoggedIn = false;
        }
      },
      error: () => {
        this.isLoggedIn = false;
      },
    });
  }

  login() {
    this.logInClicked = true;
    this.accountService.logIn(this.model).subscribe({
      next: () => {
        this.isLoggedIn = true;
        this.router.navigateByUrl('/members');
        this.logInClicked = false;
      },
      error: (error) => {
        this.isLoggedIn = false;
        this.toast.error(error.error);
        this.logInClicked = false;
      },
    });
  }

  logout() {
    this.accountService.logout();
    this.isLoggedIn = false;
    this.router.navigateByUrl('/');
  }
}
