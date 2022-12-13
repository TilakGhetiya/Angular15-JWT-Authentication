import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthService } from '../_services/auth.service';
import {forbiddenNameValidator} from '../_services/forbidden-name.directives';

@Component({ templateUrl: './login.component.html' })
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  submitted = false;
  returnUrl!: string;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthService
  ) {}

  ngOnInit() {
    this.loginForm = new FormGroup({ 
      // this.formBuilder.group({
      username: new FormControl('',[
        Validators.required,
        Validators.minLength(4),
        forbiddenNameValidator(/bob/i),
      ]),
      password: new FormControl('',[ Validators.required]),
    });

    // reset login status
    this.authenticationService.logout();

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    console.log(this.f);
    console.log(this.loginForm);
    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.authenticationService
      .login(this.loginForm.value.username, this.loginForm.value.password)
      .pipe(first())
      .subscribe(
        (data: any) => {
          this.router.navigate([this.returnUrl]);
        },
        (error: any) => {
          this.error = error;
          this.loading = false;
        }
      );
  }
}
