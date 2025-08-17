import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  @ViewChild('navbar', { static: true }) navbar!: ElementRef;
  @ViewChild('mobileMenu', { static: true }) mobileMenu!: ElementRef;
  @ViewChild('mobileMenuBtn', { static: true }) mobileMenuBtn!: ElementRef;

  isScrolled = false;
  isMobileMenuOpen = false;
  particles: any[] = [];

  ngOnInit(): void {
    this.createParticles();
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(): void {
    this.isScrolled = window.scrollY > 50;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    const mobileMenu = this.mobileMenu.nativeElement;
    const mobileMenuBtn = this.mobileMenuBtn.nativeElement;

    if (!mobileMenu.contains(target) && !mobileMenuBtn.contains(target)) {
      this.isMobileMenuOpen = false;
    }
  }

  createParticles(): void {
    for (let i = 0; i < 20; i++) {
      const particle = {
        id: i,
        left: Math.random() * 100,
        size: Math.random() * 6 + 2,
        animationDelay: Math.random() * 20,
        animationDuration: Math.random() * 10 + 15
      };
      this.particles.push(particle);
    }
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  onSignOut(event: MouseEvent): void {
    this.createRippleEffect(event);
    // Add your sign out logic here
    console.log('Sign out clicked');
    // Example: this.authService.signOut();
  }

  createRippleEffect(event: MouseEvent): void {
    const button = event.target as HTMLElement;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');

    button.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);
  }

  onNavLinkClick(section: string): void {
    console.log(`Navigating to: ${section}`);
    // Add your navigation logic here
    // Example: this.router.navigate([`/${section}`]);
  }
}