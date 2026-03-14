import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
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
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm: FormGroup = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', Validators.required]
  });

  hidePassword = true;
  isLoading = false;
  loginError = '';

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.loginError = '';
      const { username, password } = this.loginForm.value;
      
      this.authService.login(username, password).subscribe({
        next: (res) => {
          this.isLoading = false;
          if (res.success) {
            this.router.navigate(['/notes']);
          } else {
            this.loginError = res.message || 'Login failed';
          }
        },
        error: (err) => {
          this.isLoading = false;
          this.loginError = 'Invalid username or password';
        }
      });
    }
  }
}
