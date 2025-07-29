import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

interface RegisterUser{
  username: String, 
  email: String, 
  password: String
}


@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent implements OnInit {
  registrationForm!: FormGroup;
  submitted = false;

  registerPayload!: RegisterUser

  constructor(private formBuilder: FormBuilder, private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.registrationForm = this.formBuilder.group({
      username: ['', [
        Validators.required,
        this.lowercaseValidator,
        Validators.pattern(/^[a-z0-9_]+$/)
      ]],
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        this.strongPasswordValidator
      ]],
      acceptTerms: [false, Validators.requiredTrue]
    });

    // Convert username to lowercase on input
    this.registrationForm.get('username')?.valueChanges.subscribe(value => {
      if (value && typeof value === 'string') {
        const lowercaseValue = value.toLowerCase();
        if (value !== lowercaseValue) {
          this.registrationForm.get('username')?.setValue(lowercaseValue, { emitEvent: false });
        }
      }
    });
  }

  // Custom validator for lowercase username
  lowercaseValidator(control: AbstractControl): { [key: string]: any } | null {
    if (control.value && control.value !== control.value.toLowerCase()) {
      return { 'notLowercase': { value: control.value } };
    }
    return null;
  }

  // Custom validator for strong password
  strongPasswordValidator(control: AbstractControl): { [key: string]: any } | null {
    const value = control.value;
    if (!value) {
      return null;
    }

    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumeric = /[0-9]/.test(value);
    const hasSpecialChar = /[@$!%*?&]/.test(value);

    const passwordValid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecialChar;

    if (!passwordValid) {
      return { 'strongPassword': true };
    }
    return null;
  }

  // Getter for easy access to form controls
  get f() { 
    return this.registrationForm.controls; 
  }

  // Check if field has error and is touched
  hasError(fieldName: string, errorType?: string): boolean {
    const field = this.registrationForm.get(fieldName);
    if (errorType) {
      return !!(field?.hasError(errorType) && (field?.dirty || field?.touched || this.submitted));
    }
    return !!(field?.invalid && (field?.dirty || field?.touched || this.submitted));
  }

  // Get error message for field
  getErrorMessage(fieldName: string): string {
    const field = this.registrationForm.get(fieldName);
    
    if (field?.hasError('required')) {
      return `${this.getFieldDisplayName(fieldName)} is required`;
    }
    
    if (fieldName === 'username') {
      if (field?.hasError('pattern')) {
        return 'Username must contain only lowercase letters, numbers, and underscores';
      }
    }
    
    if (fieldName === 'email') {
      if (field?.hasError('email') || field?.hasError('pattern')) {
        return 'Please enter a valid email address';
      }
    }
    
    if (fieldName === 'password') {
      if (field?.hasError('minlength')) {
        return 'Password must be at least 8 characters long';
      }
      if (field?.hasError('strongPassword')) {
        return 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character';
      }
    }
    
    if (fieldName === 'acceptTerms') {
      if (field?.hasError('required')) {
        return 'You must accept the terms and conditions';
      }
    }
    
    return '';
  }

  private getFieldDisplayName(fieldName: string): string {
    switch (fieldName) {
      case 'username': return 'Username';
      case 'email': return 'Email';
      case 'password': return 'Password';
      case 'acceptTerms': return 'Terms acceptance';
      default: return fieldName;
    }
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.registrationForm.valid) {
      console.log('Form submitted successfully!', this.registrationForm.value);
      this.registerPayload = this.registrationForm.value
console.log(`reigsterPyload:`, this.registerPayload)
      this.userService.registerUser(this.registerPayload).subscribe(
        (res: any) => {
          console.log(`aThis is response`, res)
          console.log('User Registered Succesfully')
          this.router.navigate(['/homepage'])
        },
        (error: any) => {
          console.log(`Failed to register user`)
        }
      )
      
      this.registrationForm.reset();
      this.submitted = false;
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.registrationForm.controls).forEach(key => {
        this.registrationForm.get(key)?.markAsTouched();
      });
    }

   
  }}