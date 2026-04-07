import { Component, inject, ChangeDetectionStrategy, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { MotionService } from '../../core/services/motion.service';

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
export class LoginComponent implements AfterViewInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);
  private motion = inject(MotionService);
  private cdr = inject(ChangeDetectorRef);

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
        const errorMessage = err.error?.message || err.message || 'Invalid username or password';
        this.loginError = errorMessage;
        this.cdr.markForCheck();
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

  ngAfterViewInit() {
    setTimeout(() => {
      this.motion.heroReveal('.login-page .main-heading .line');
      this.motion.fadeIn('.login-page .form-panel', 0.2);
    }, 100);
  }
}
