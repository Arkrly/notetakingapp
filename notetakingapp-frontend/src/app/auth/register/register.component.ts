import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../core/services/auth.service';

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
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  registerForm: FormGroup = this.fb.group({
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required]
  }, { validators: passwordMatchValidator });

  hidePassword = true;
  hideConfirmPassword = true;
  isLoading = false;
  registerError = '';
  
  passwordStrength = 0;
  strengthConfig = { width: '0%', color: 'bg-gray-300', label: 'None' };

  constructor() {
    this.registerForm.get('password')?.valueChanges.subscribe(val => {
      this.calculateStrength(val);
    });
  }

  calculateStrength(val: string) {
    if (!val) {
      this.strengthConfig = { width: '0%', color: 'bg-gray-300', label: 'None' };
      return;
    }
    let strength = 0;
    
    if (val.length >= 6) strength++;
    if (val.match(/[A-Z]/)) strength++;
    if (val.match(/[0-9]/)) strength++;
    if (val.match(/[^A-Za-z0-9]/)) strength++;

    const configs = [
      { width: '0%', color: 'bg-gray-300', label: 'None' },
      { width: '25%', color: 'bg-red-500', label: 'Weak' },
      { width: '50%', color: 'bg-yellow-500', label: 'Fair' },
      { width: '75%', color: 'bg-blue-500', label: 'Good' },
      { width: '100%', color: 'bg-green-500', label: 'Strong' }
    ];
    this.strengthConfig = configs[strength] || configs[0];
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.registerError = '';
      const { username, email, password } = this.registerForm.value;
      
      this.authService.register(username, email, password).subscribe({
        next: (res) => {
          this.isLoading = false;
          if (res.success) {
            this.router.navigate(['/notes']);
          } else {
            this.registerError = res.message || 'Registration failed';
          }
        },
        error: (err) => {
          this.isLoading = false;
          this.registerError = 'Could not create account at this time.';
        }
      });
    }
  }
}
