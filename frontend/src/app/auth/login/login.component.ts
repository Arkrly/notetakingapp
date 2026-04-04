import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);

  loginForm: FormGroup = this.fb.group({
    username: ['', [Validators.required]],
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
      
      const credentials = this.loginForm.value;
      this.authService.login(credentials.username, credentials.password).subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/notes']);
        },
        error: (err) => {
          this.isLoading = false;
          this.loginError = err.error?.message || 'Invalid credentials';
        }
      });
    }
  }

  togglePassword() {
    this.hidePassword = !this.hidePassword;
  }

  setActiveDot(index: number) {
    this.activeDot = index;
  }
}
