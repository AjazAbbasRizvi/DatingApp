import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-test-error',
  templateUrl: './test-error.component.html',
  styleUrls: ['./test-error.component.css'],
})
export class TestErrorComponent implements OnInit {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getNotAuth() {
    const url = this.baseUrl + 'Buggy/auth';

    this.http.get(url).subscribe({
      next: (response) => console.log(response),
      error: (error) => console.log(error),
    });
  }

  getNotFound() {
    const url = this.baseUrl + 'Buggy/not-found';

    this.http.get(url).subscribe({
      next: (response) => console.log(response),
      error: (error) => console.log(error),
    });
  }

  getServerError() {
    const url = this.baseUrl + 'Buggy/server-error';

    this.http.get(url).subscribe({
      next: (response) => console.log(response),
      error: (error) => console.log(error),
    });
  }

  getBadReq() {
    const url = this.baseUrl + 'Buggy/bad-request';

    this.http.get(url).subscribe({
      next: (response) => console.log(response),
      error: (error) => console.log(error),
    });
  }

  ngOnInit(): void {}
}
