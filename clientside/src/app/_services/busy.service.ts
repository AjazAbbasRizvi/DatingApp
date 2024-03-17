import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root',
})
export class BusyService {
  private busyReqCount: number = 0;

  constructor(private spinnerService: NgxSpinnerService) {}

  busy() {
    this.busyReqCount++;
    this.spinnerService.show(undefined, {
      bdColor: 'rgba(255, 255, 255, 0)',
      color: '#333333',
    });
  }

  idle(){
    this.busyReqCount--;
    if (this.busyReqCount<=0) {
      this.busyReqCount = 0;
      this.spinnerService.hide();
    }
  }
}
