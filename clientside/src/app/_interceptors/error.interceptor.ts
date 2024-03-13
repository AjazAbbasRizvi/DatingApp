import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private router : Router, private toast : ToastrService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error : HttpErrorResponse)=>{
        if (error) {
          switch (error.status) {
            case 401:
             this.toast.error('UnAuthorized', error.status.toString());
             break;

            case 404:
              this.router.navigateByUrl('/not-found');
              break;
            
            case 500:
              // here in the navigation extras we are storing the error in router state and when we 
              // use this.router.navigatebyUrl we will send the error in the router state via navigationExtras
              // desired location.
              const navigationExtras : NavigationExtras = {state : {error : error.error}};
              this.router.navigateByUrl('/server-error', navigationExtras);
              break;

            case 400 :
              this.toast.error('Bad Request', error.error);
              break;
            default:
              this.toast.error('Something Went Wrong');
              console.log(error);
              break;
          }
        }
        throw error;
      })
    )
  }
}
