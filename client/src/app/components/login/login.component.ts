import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

interface LoginUser{
  username: String, 
  password: String
}

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
 loginForm: FormGroup;
  showPassword = false;
  rememberMe = false;
  loginPayload!: LoginUser

  constructor(private fb: FormBuilder, private userService: UserService, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      console.log('Form submitted:', this.loginForm.value);
      this.loginPayload = this.loginForm.value

      this.userService.loginUser(this.loginPayload).subscribe(
        (res:any) => {
          console.log(`Logged in successfully`)
          this.router.navigate(['/homepage'])
        },
        (error: any) => {
          console.error(error)
        }
      )
      // Handle login logic here
    }
  }

  signInWithGoogle() {
    console.log('Sign in with Google clicked');
    // Handle Google sign-in logic here
  }

  navigateToSignUp() {
    console.log('Navigate to sign up');
    // Handle navigation to sign up page
  }

  forgotPassword() {
    console.log('Forgot password clicked');
    // Handle forgot password logic
  }
}
