import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { AccountService } from '../_services/account.service';
import { ToastrService } from 'ngx-toastr';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit, OnDestroy {
  @Output() cancelRegister = new EventEmitter();

  public model: any = {};
  public registerClicked = false;
  public maxDate = new Date();

  public registerForm: FormGroup = new FormGroup({});

  constructor(
    private accountService: AccountService,
    private toast: ToastrService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnDestroy(): void {}

  ngOnInit(): void {
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
    this.initializeForm();
  }

  initializeForm() {
    this.registerForm = this.formBuilder.group({
      gender: ['male'],
      username: ['', Validators.required],
      knownAs: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      password: [
        '',
        [Validators.required, Validators.minLength(4), Validators.maxLength(8)],
      ],
      confirmPassword: [
        '',
        [Validators.required, this.matchValues('password')],
      ],
    });

    this.registerForm.controls['password'].valueChanges.subscribe({
      next: () => {
        this.registerForm.controls['confirmPassword'].updateValueAndValidity();
      },
    });
  }

  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control.value === control.parent?.get(matchTo)?.value
        ? null
        : { notMatching: true };
    };
  }

  register() {
    const dob = this.getDateOnly(
      this.registerForm.controls['dateOfBirth'].value
    );
    const values = { ...this.registerForm.value, dateOfBirth: dob };
    this.registerClicked = true;
    this.accountService.registerUser(values).subscribe({
      next: (response) => {
        this.cancel();
        this.router.navigateByUrl('/members');
      },
      error: (error) => {
        this.toast.error(error.error);
      },
    });
  }

  private getDateOnly(dob: string | undefined) {
    if (!dob) {
      return;
    } else {
      let theDob = new Date(dob);
      return new Date(
        theDob.setMinutes(theDob.getMinutes() - theDob.getTimezoneOffset())
      )
        .toISOString()
        .slice(0, 10);
    }
  }

  cancel() {
    this.cancelRegister.emit(false);
  }
}
