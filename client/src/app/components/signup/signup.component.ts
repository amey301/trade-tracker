import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

import {  ViewChildren, QueryList, ElementRef } from '@angular/core';
// import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';


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
  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef>;

  registrationForm!: FormGroup;
  showPassword: boolean = false;
  showOtpSection: boolean = false;
  isLoading: boolean = false;
  isOtpLoading: boolean = false;
  currentStep: number = 1;
  otpValues: string[] = ['', '', '', ''];

  constructor(private fb: FormBuilder) {
    this.initializeForm();
  }

  ngOnInit(): void {}

  private initializeForm(): void {
    this.registrationForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      phone: ['', [Validators.required, this.phoneValidator]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // Custom phone validator
  private phoneValidator(control: AbstractControl): { [key: string]: any } | null {
    const phoneRegex = /^\+?[\d\s\(\)-]{10,}$/;
    if (control.value && !phoneRegex.test(control.value)) {
      return { invalidPhone: true };
    }
    return null;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onPhoneInput(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    
    if (value.length >= 1) {
      value = '+' + value;
    }
    if (value.length >= 4 && value.length <= 15) {
      const formatted = this.formatPhoneNumber(value);
      this.registrationForm.patchValue({ phone: formatted });
    }
  }

  private formatPhoneNumber(value: string): string {
    // Remove the + for processing
    const digits = value.slice(1);
    
    if (digits.length <= 3) {
      return '+' + digits;
    } else if (digits.length <= 6) {
      return `+${digits.slice(0, 1)} (${digits.slice(1, 4)}) ${digits.slice(4)}`;
    } else if (digits.length <= 10) {
      return `+${digits.slice(0, 1)} (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
    } else {
      return `+${digits.slice(0, 1)} (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 11)}`;
    }
  }

  sendOtp(): void {
    const phoneControl = this.registrationForm.get('phone');
    
    if (!phoneControl?.value || phoneControl.invalid) {
      phoneControl?.markAsTouched();
      return;
    }

    this.isOtpLoading = true;

    // Simulate OTP sending
    setTimeout(() => {
      this.showOtpSection = true;
      this.currentStep = 2;
      this.isOtpLoading = false;
      
      // Focus first OTP input after a small delay
      setTimeout(() => {
        if (this.otpInputs.first) {
          this.otpInputs.first.nativeElement.focus();
        }
      }, 100);
    }, 1500);
  }

  onOtpInput(event: any, index: number): void {
    const value = event.target.value;
    
    // Only allow single digit
    if (value.length > 1) {
      event.target.value = value.slice(-1);
    }

    this.otpValues[index] = event.target.value;

    // Move to next input if current input is filled and not the last input
    if (value && index < this.otpValues.length - 1) {
      const nextInput = this.otpInputs.toArray()[index + 1];
      if (nextInput) {
        nextInput.nativeElement.focus();
      }
    }

    // Check if all OTP fields are filled
    if (this.otpValues.every(val => val.length === 1)) {
      this.currentStep = 3;
    }
  }

  onOtpKeydown(event: KeyboardEvent, index: number): void {
    // Handle backspace
    if (event.key === 'Backspace' && !this.otpValues[index] && index > 0) {
      const prevInput = this.otpInputs.toArray()[index - 1];
      if (prevInput) {
        prevInput.nativeElement.focus();
      }
    }
  }

  onOtpKeypress(event: KeyboardEvent): void {
    // Only allow numbers
    const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Enter'];
    if (!/\d/.test(event.key) && !allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }

  onSubmit(): void {
    if (this.registrationForm.valid && this.isOtpComplete()) {
      this.isLoading = true;

      const formData = {
        ...this.registrationForm.value,
        otp: this.otpValues.join('')
      };

      // Simulate form submission
      setTimeout(() => {
        console.log('Registration data:', formData);
        alert('Account created successfully!');
        this.isLoading = false;
        
        // Optional: Reset form
        // this.resetForm();
      }, 2000);
    } else {
      // Mark all fields as touched to show validation errors
      this.registrationForm.markAllAsTouched();
      
      if (!this.isOtpComplete()) {
        // Focus first empty OTP input
        const firstEmptyIndex = this.otpValues.findIndex(val => !val);
        if (firstEmptyIndex !== -1) {
          const input = this.otpInputs.toArray()[firstEmptyIndex];
          if (input) {
            input.nativeElement.focus();
          }
        }
      }
    }
  }

  private isOtpComplete(): boolean {
    return this.showOtpSection ? this.otpValues.every(val => val.length === 1) : true;
  }

  private resetForm(): void {
    this.registrationForm.reset();
    this.otpValues = ['', '', '', ''];
    this.showOtpSection = false;
    this.showPassword = false;
    this.currentStep = 1;
  }

  // Getter methods for template
  get usernameControl() { return this.registrationForm.get('username'); }
  get phoneControl() { return this.registrationForm.get('phone'); }
  get passwordControl() { return this.registrationForm.get('password'); }

  get progressWidth(): string {
    return `${(this.currentStep / 3) * 100}%`;
  }

  get sendOtpButtonText(): string {
    if (this.isOtpLoading) return 'Sending...';
    if (this.showOtpSection) return 'Resend OTP';
    return 'Send OTP';
  }

  get submitButtonText(): string {
    return this.isLoading ? 'Creating Account...' : 'Create Account';
  }

  // Helper method to get form control error
  getFieldError(fieldName: string): string {
    const control = this.registrationForm.get(fieldName);
    if (control?.errors && control.touched) {
      if (control.errors['required']) return `${fieldName} is required`;
      if (control.errors['minlength']) {
        const requiredLength = control.errors['minlength'].requiredLength;
        return `${fieldName} must be at least ${requiredLength} characters`;
      }
      if (control.errors['invalidPhone']) return 'Please enter a valid phone number';
    }
    return '';
  }

  hasFieldError(fieldName: string): boolean {
    const control = this.registrationForm.get(fieldName);
    return !!(control?.errors && control.touched);
  }
}