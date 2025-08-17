import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  showPassword = false;
  showOtpSection = false;
  otpValues = ['', '', '', ''];

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
