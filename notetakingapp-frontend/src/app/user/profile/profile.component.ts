import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { User } from '../../core/models/user.model';
import { passwordMatchValidator } from '../../auth/register/register.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    SidebarComponent,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private toastr = inject(ToastrService);

  user: User | null = null;
  profileForm!: FormGroup;
  passwordForm!: FormGroup;
  
  isUpdatingProfile = false;
  isUpdatingPassword = false;

  hideCurrentPassword = true;
  hideNewPassword = true;
  hideConfirmPassword = true;

  passwordStrength = 0;
  strengthConfig = { width: '0%', color: 'bg-slate-300', label: 'Use at least 8 characters.', textColor: 'text-slate-400' };

  ngOnInit() {
    this.initForms();
    this.userService.getProfile().subscribe(res => {
      if (res.success && res.data) {
        this.user = res.data;
        this.profileForm.patchValue({
          username: res.data.username,
          email: res.data.email
        });
      }
    });

    this.passwordForm.get('newPassword')?.valueChanges.subscribe(val => {
      this.calculateStrength(val);
    });
  }

  initForms() {
    this.profileForm = this.fb.group({
      username: ['', Validators.required],
      email: [{ value: '', disabled: true }] // Email read-only as per template
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validators: passwordMatchValidator });
  }

  calculateStrength(val: string) {
    if (!val) {
      this.strengthConfig = { width: '0%', color: 'bg-slate-300', label: 'Use at least 8 characters.', textColor: 'text-slate-400' };
      return;
    }
    
    let strength = 0;
    if (val.length > 0) strength += 20;
    if (val.length >= 8) strength += 20;
    if (/[A-Z]/.test(val)) strength += 20;
    if (/[0-9]/.test(val)) strength += 20;
    if (/[^A-Za-z0-9]/.test(val)) strength += 20;

    if (strength <= 40) {
      this.strengthConfig = { width: `${strength}%`, color: 'bg-red-500', label: 'Weak', textColor: 'text-red-500' };
    } else if (strength <= 60) {
      this.strengthConfig = { width: `${strength}%`, color: 'bg-yellow-500', label: 'Fair', textColor: 'text-yellow-600' };
    } else if (strength <= 80) {
      this.strengthConfig = { width: `${strength}%`, color: 'bg-blue-500', label: 'Good', textColor: 'text-blue-600' };
    } else {
      this.strengthConfig = { width: `${strength}%`, color: 'bg-green-500', label: 'Excellent', textColor: 'text-green-600' };
    }
  }

  get joinedDate(): string {
    if (!this.user?.createdAt) return 'Recently';
    return new Date(this.user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }

  get initials(): string {
    if (!this.user?.username) return 'U';
    return this.user.username.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  }

  onProfileSubmit() {
    if (this.profileForm.valid) {
      this.isUpdatingProfile = true;
      this.userService.updateProfile(this.profileForm.getRawValue()).subscribe({
        next: (res) => {
          this.isUpdatingProfile = false;
          if (res.success && res.data) {
            this.user = res.data;
            this.toastr.success('Profile updated successfully');
          }
        },
        error: () => this.isUpdatingProfile = false
      });
    }
  }

  onPasswordSubmit() {
    if (this.passwordForm.valid) {
      if (this.passwordForm.value.newPassword !== this.passwordForm.value.confirmPassword) {
        this.passwordForm.get('confirmPassword')?.setErrors({ passwordMismatch: true });
        return;
      }
      
      this.isUpdatingPassword = true;
      const { currentPassword, newPassword } = this.passwordForm.value;
      this.userService.changePassword(currentPassword, newPassword).subscribe({
        next: (res) => {
          this.isUpdatingPassword = false;
          if (res.success) {
            this.passwordForm.reset();
            this.toastr.success('Password changed successfully');
          }
        },
        error: () => {
          this.isUpdatingPassword = false;
        }
      });
    }
  }

  deleteAccount() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Danger Zone',
        message: 'Are you absolutely sure you want to delete your account? This action is permanent and all your notes will be erased forever.',
        confirmText: 'Delete My Account',
        isDanger: true
      },
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.userService.deleteAccount().subscribe(() => {
          this.authService.logout();
          this.router.navigate(['/login']);
          this.toastr.success('Your account has been deleted');
        });
      }
    });
  }
}
