import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
export class LoginComponent implements OnInit, AfterViewInit {
  @ViewChild('usernameInput') usernameInput!: ElementRef;

  loginForm!: FormGroup;
  showPassword: boolean = false;
  isLoading: boolean = false;
  isSuccess: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    // Auto-focus on username input after a delay
    setTimeout(() => {
      if (this.usernameInput) {
        this.usernameInput.nativeElement.focus();
      }
    }, 500);
  }

  private initializeForm(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      
      this.isLoading = true;

      // Simulate login API call
      setTimeout(() => {
        // Simulate successful login
        this.isLoading = false;
        this.isSuccess = true;

        setTimeout(() => {
          alert(`Welcome back, ${username}!`);
          this.isSuccess = false;
          
          // Navigate to dashboard or desired route
          // this.router.navigate(['/dashboard']);
          
          // Optional: Reset form
          // this.loginForm.reset();
        }, 1000);
      }, 1500);
    } else {
      // Mark all fields as touched to show validation errors
      this.loginForm.markAllAsTouched();
    }
  }

  onForgotPassword(): void {
    // Handle forgot password logic
    alert('Forgot password functionality would be implemented here.');
    
    // Example: Navigate to forgot password page
    // this.router.navigate(['/forgot-password']);
  }

  onSignUp(): void {
    // Handle navigation to signup page
    alert('Redirect to signup page would happen here.');
    
    // Example: Navigate to signup page
    // this.router.navigate(['/register']);
  }

  // Getter methods for template
  get usernameControl() { 
    return this.loginForm.get('username'); 
  }
  
  get passwordControl() { 
    return this.loginForm.get('password'); 
  }

  get loginButtonText(): string {
    if (this.isLoading) return 'Signing In...';
    if (this.isSuccess) return 'Welcome Back!';
    return 'Sign In';
  }

  // Helper method to get form control error
  getFieldError(fieldName: string): string {
    const control = this.loginForm.get(fieldName);
    if (control?.errors && control.touched) {
      if (control.errors['required']) {
        return `${this.capitalizeFirst(fieldName)} is required`;
      }
      if (control.errors['minlength']) {
        const requiredLength = control.errors['minlength'].requiredLength;
        return `${this.capitalizeFirst(fieldName)} must be at least ${requiredLength} characters`;
      }
    }
    return '';
  }

  hasFieldError(fieldName: string): boolean {
    const control = this.loginForm.get(fieldName);
    return !!(control?.errors && control.touched);
  }

  private capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // Handle input focus/blur for enhanced animations
  onInputFocus(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.parentElement?.classList.add('focused');
  }

  onInputBlur(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.parentElement?.classList.remove('focused');
  }

  // Handle keyboard navigation for password toggle
  onPasswordToggleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.togglePasswordVisibility();
    }
  }
}