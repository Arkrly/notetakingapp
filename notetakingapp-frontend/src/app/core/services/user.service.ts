import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { ApiResponse } from '../models/api-response.model';
import { environment } from '../../../environments/environment';

export interface UpdateUserRequest {
  username?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/users`;

  getProfile(): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${this.apiUrl}/me`);
  }

  updateProfile(request: UpdateUserRequest): Observable<ApiResponse<User>> {
    return this.http.put<ApiResponse<User>>(`${this.apiUrl}/me`, request);
  }

  changePassword(currentPassword: string, newPassword: string): Observable<ApiResponse<void>> {
    const request: ChangePasswordRequest = { currentPassword, newPassword };
    return this.http.patch<ApiResponse<void>>(`${this.apiUrl}/me/password`, request);
  }

  deleteAccount(): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/me`);
  }
}
