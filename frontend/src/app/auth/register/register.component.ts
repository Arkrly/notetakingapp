import { Component, inject, ChangeDetectionStrategy, ChangeDetectorRef, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../../core/services/auth.service';
import { MotionService } from '../../core/services/motion.service';

export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  return password && confirmPassword && password.value === confirmPassword.value ? null : { passwordMismatch: true };
};

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private motion = inject(MotionService);
  private cdr = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);

  registerForm: FormGroup = this.fb.group({
    username: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9_]{3,50}$/)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required]
  }, { validators: passwordMatchValidator });

  hidePassword = true;
  hideConfirmPassword = true;
  isLoading = false;
  registerError = '';

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.registerError = '';
      const { username, email, password } = this.registerForm.value;
      
      this.authService.register(username, email, password).pipe(
        takeUntilDestroyed(this.destroyRef)
      ).subscribe({
        next: (res) => {
          this.isLoading = false;
          if (res.success) {
            this.router.navigate(['/notes']);
          } else {
            this.registerError = res.message || 'Registration failed';
            this.cdr.markForCheck();
          }
        },
error: (err) => {
        this.isLoading = false;
        if (err.status === 409) {
          const errorBody = err.error;
          if (errorBody?.message?.toLowerCase().includes('username')) {
            this.registerError = 'This username is already taken. Please choose another one.';
          } else if (errorBody?.message?.toLowerCase().includes('email')) {
            this.registerError = 'This email is already registered. Please use another email or login.';
          } else {
            this.registerError = 'An account with these details already exists.';
          }
} else {
            this.registerError = 'Could not create account at this time. Please try again.';
          }
          this.cdr.markForCheck();
      }
});
  }
}
}
