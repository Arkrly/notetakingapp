import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    RouterModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    remember: [false]
  });

  hidePassword = true;
  isLoading = false;
  loginError = '';

  carouselDots = [0, 1, 2, 3];
  activeDot = 0;

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.loginError = '';
      
      setTimeout(() => {
        this.isLoading = false;
        this.router.navigate(['/notes']);
      }, 1000);
    }
  }

  togglePassword() {
    this.hidePassword = !this.hidePassword;
  }

  setActiveDot(index: number) {
    this.activeDot = index;
  }
}
