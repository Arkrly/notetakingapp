import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileComponent } from './profile.component';
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';
import { User } from '../../core/models/user.model';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { vi } from 'vitest';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let authService: Partial<AuthService>;
  let userService: Partial<UserService>;
  let router: Partial<Router>;
  let dialog: Partial<MatDialog>;
  let toastr: Partial<ToastrService>;

  const mockUser: User = {
    id: '1',
    username: 'testuser',
    email: 'test@example.com',
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01'
  };

  beforeEach(async () => {
    const authSpy = {
      logout: vi.fn()
    };
    const userSpy = {
      getProfile: vi.fn(),
      updateProfile: vi.fn(),
      changePassword: vi.fn(),
      deleteAccount: vi.fn()
    };
    const routerSpy = {
      navigate: vi.fn()
    };
    const dialogSpy = {
      open: vi.fn()
    };
    const toastrSpy = {
      success: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [
        ProfileComponent,
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatDialogModule,
        SidebarComponent,
        ConfirmDialogComponent
      ],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: UserService, useValue: userSpy },
        { provide: Router, useValue: routerSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: ToastrService, useValue: toastrSpy },
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    authService = TestBed.inject(AuthService);
    userService = TestBed.inject(UserService);
    router = TestBed.inject(Router);
    dialog = TestBed.inject(MatDialog);
    toastr = TestBed.inject(ToastrService);

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize forms on init', () => {
    // Mock getProfile to return a user
    (userService.getProfile as any).mockReturnValue(of({ success: true, data: mockUser }));

    // Call ngOnInit
    component.ngOnInit();
    fixture.detectChanges();

    // Check that forms are initialized
    expect(component.profileForm).toBeDefined();
    expect(component.passwordForm).toBeDefined();
    expect(component.profileForm.get('username')).toBeDefined();
    expect(component.profileForm.get('email')).toBeDefined();
    expect(component.passwordForm.get('currentPassword')).toBeDefined();
    expect(component.passwordForm.get('newPassword')).toBeDefined();
    expect(component.passwordForm.get('confirmPassword')).toBeDefined();
  });

  it('should load user profile on init', () => {
    // Mock getProfile to return a user
    (userService.getProfile as any).mockReturnValue(of({ success: true, data: mockUser }));

    // Call ngOnInit
    component.ngOnInit();
    fixture.detectChanges();

    // Check that user is set
    expect(component.user).toEqual(mockUser);
    
    // Check that profileForm is patched with user data
    expect(component.profileForm.get('username')?.value).toBe(mockUser.username);
    expect(component.profileForm.get('email')?.value).toBe(mockUser.email);
  });

  it('should calculate password strength correctly', () => {
    // Test empty password
    component.calculateStrength('');
    expect(component.strengthConfig.width).toBe('0%');
    expect(component.strengthConfig.label).toBe('Use at least 8 characters.');

    // Test short password
    component.calculateStrength('abc');
    expect(component.strengthConfig.width).toBe('20%');
    expect(component.strengthConfig.color).toBe('bg-red-500');

    // Test medium password without special chars
    component.calculateStrength('Abcdefg1');
    expect(component.strengthConfig.width).toBe('80%');
    expect(component.strengthConfig.color).toBe('bg-blue-500');

    // Test strong password
    component.calculateStrength('Abcdefg1!');
    expect(component.strengthConfig.width).toBe('100%');
    expect(component.strengthConfig.color).toBe('bg-green-500');
  });

  it('should return correct joined date', () => {
    // Test with user
    component.user = mockUser;
    expect(component.joinedDate).toBe('January, 2023');

    // Test without user
    component.user = null;
    expect(component.joinedDate).toBe('Recently');

    // Test without createdAt
    component.user = { ...mockUser, createdAt: undefined as unknown as string };
    expect(component.joinedDate).toBe('Recently');
  });

  it('should return correct initials', () => {
    // Test with username
    component.user = { ...mockUser, username: 'John Doe' };
    expect(component.initials).toBe('JD');

    // Test with single name
    component.user = { ...mockUser, username: 'John' };
    expect(component.initials).toBe('JO');

    // Test without username
    component.user = null;
    expect(component.initials).toBe('U');

    // Test with empty username
    component.user = { ...mockUser, username: '' };
    expect(component.initials).toBe('U');
  });

  it('should submit profile form successfully', () => {
    // Setup
    component.user = mockUser;
    component.profileForm.patchValue({
      username: 'updateduser',
      email: 'updated@example.com'
    });
    
    // Mock updateProfile to return success
    (userService.updateProfile as any).mockReturnValue(of({ success: true, data: { ...mockUser, username: 'updateduser', email: 'updated@example.com' } }));

    // Submit
    component.onProfileSubmit();
    fixture.detectChanges();

    // Check flags
    expect(component.isUpdatingProfile).toBeFalsy();
    
    // Check that updateProfile was called
    expect(userService.updateProfile).toHaveBeenCalledWith({
      username: 'updateduser',
      email: 'updated@example.com'
    });
    
    // Check that user was updated
    expect(component.user).toEqual({ ...mockUser, username: 'updateduser', email: 'updated@example.com' });
    
    // Check that toast was shown
    expect(toastr.success).toHaveBeenCalledWith('Profile updated successfully');
  });

  it('should handle profile submission error', () => {
    // Setup
    component.profileForm.patchValue({
      username: 'testuser',
      email: 'test@example.com'
    });
    
    // Mock updateProfile to return error
    (userService.updateProfile as any).mockReturnValue(throwError(() => new Error('Error')));

    // Submit
    component.onProfileSubmit();
    fixture.detectChanges();

    // Check flags
    expect(component.isUpdatingProfile).toBeFalsy();
    
    // Check that updateProfile was called
    expect(userService.updateProfile).toHaveBeenCalled();
    
    // Check that user was not changed
    expect(component.user).toBeNull(); // Initially null since ngOnInit wasn't called
    
    // Check that no toast was shown for error
    expect(toastr.success).not.toHaveBeenCalled();
  });

  it('should submit password form successfully', () => {
    // Setup
    component.passwordForm.patchValue({
      currentPassword: 'oldpass',
      newPassword: 'newpass123',
      confirmPassword: 'newpass123'
    });
    
    // Mock changePassword to return success
    (userService.changePassword as any).mockReturnValue(of({ success: true }));

    // Submit
    component.onPasswordSubmit();
    fixture.detectChanges();

    // Check flags
    expect(component.isUpdatingPassword).toBeFalsy();
    
    // Check that changePassword was called
    expect(userService.changePassword).toHaveBeenCalledWith('oldpass', 'newpass123');
    
    // Check that form was reset
    expect(component.passwordForm.value).toEqual({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    
    // Check that toast was shown
    expect(toastr.success).toHaveBeenCalledWith('Password changed successfully');
  });

  it('should handle password mismatch', () => {
    // Setup
    component.passwordForm.patchValue({
      currentPassword: 'oldpass',
      newPassword: 'newpass123',
      confirmPassword: 'differentpass'
    });

    // Submit
    component.onPasswordSubmit();
    fixture.detectChanges();

    // Check that confirmPassword has error
    expect(component.passwordForm.get('confirmPassword')?.hasError('passwordMismatch')).toBeTruthy();
    
    // Check that changePassword was not called
    expect(userService.changePassword).not.toHaveBeenCalled();
    
    // Check flags
    expect(component.isUpdatingPassword).toBeFalsy();
  });

  it('should handle password submission error', () => {
    // Setup
    component.passwordForm.patchValue({
      currentPassword: 'oldpass',
      newPassword: 'newpass123',
      confirmPassword: 'newpass123'
    });
    
    // Mock changePassword to return error
    (userService.changePassword as any).mockReturnValue(throwError(() => new Error('Error')));

    // Submit
    component.onPasswordSubmit();
    fixture.detectChanges();

    // Check flags
    expect(component.isUpdatingPassword).toBeFalsy();
    
    // Check that changePassword was called
    expect(userService.changePassword).toHaveBeenCalledWith('oldpass', 'newpass123');
    
    // Check that form was not reset (due to error)
    expect(component.passwordForm.value).toEqual({
      currentPassword: 'oldpass',
      newPassword: 'newpass123',
      confirmPassword: 'newpass123'
    });
    
    // Check that no toast was shown for error
    expect(toastr.success).not.toHaveBeenCalled();
  });

  it('should delete account successfully', () => {
    // Setup
    const dialogRef = { afterClosed: () => of(true) };
    (dialog.open as any).mockReturnValue(dialogRef as any);
    
    // Mock deleteAccount to return success
    (userService.deleteAccount as any).mockReturnValue(of({}));

    // Call deleteAccount
    component.deleteAccount();
    fixture.detectChanges();

    // Check that dialog was opened with correct parameters
    expect(dialog.open).toHaveBeenCalledWith(ConfirmDialogComponent, {
      data: {
        title: 'Danger Zone',
        message: 'Are you absolutely sure you want to delete your account? This action is permanent and all your notes will be erased forever.',
        confirmText: 'Delete My Account',
        isDanger: true
      },
      width: '400px'
    });

    // Check that deleteAccount was called
    expect(userService.deleteAccount).toHaveBeenCalled();
    
    // Check that authService.logout was called
    expect(authService.logout).toHaveBeenCalled();
    
    // Check that router.navigate was called
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
    
    // Check that toast was shown
    expect(toastr.success).toHaveBeenCalledWith('Your account has been deleted');
  });

  it('should not delete account if user cancels', () => {
    // Setup
    const dialogRef = { afterClosed: () => of(false) };
    (dialog.open as any).mockReturnValue(dialogRef as any);
    
    // Call deleteAccount
    component.deleteAccount();
    fixture.detectChanges();

    // Check that deleteAccount was not called
    expect(userService.deleteAccount).not.toHaveBeenCalled();
    
    // Check that authService.logout was not called
    expect(authService.logout).not.toHaveBeenCalled();
    
    // Check that router.navigate was not called
    expect(router.navigate).not.toHaveBeenCalled();
    
    // Check that no toast was shown
    expect(toastr.success).not.toHaveBeenCalled();
  });
});