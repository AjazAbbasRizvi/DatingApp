import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { AccountService } from '../_services/account.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit, OnDestroy {
  @Output() cancelRegister = new EventEmitter();

  model: any = {};
  registerClicked = false;

  constructor(private accountService: AccountService,
    private toast : ToastrService) {}

  ngOnDestroy(): void {}

  ngOnInit(): void {}

  register() {
    this.registerClicked = true;
    this.accountService.registerUser(this.model).subscribe({
      next: (response) => {
        console.log(response);
        this.registerClicked = false;
        this.cancel();
      },
      error: (error) => {
        this.registerClicked = false;
        this.toast.error(error.error);
        console.log(error);
      },
    });
  }

  cancel() {
    this.cancelRegister.emit(false);
  }
}
