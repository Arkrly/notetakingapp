import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { User } from '../models/user.model';
import { ApiResponse } from '../models/api-response.model';

export interface AuthResponse {
  token: string;
  type: string;
  username: string;
  email: string;
  role: string;
  expiresIn: number;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  
  private tokenKey = 'note_app_token';
  private usernameKey = 'username';
  private roleKey = 'role';

  constructor() {
    this.checkStoredAuth();
  }

  private checkStoredAuth(): void {
    const token = this.getStorageItem(this.tokenKey);
    if (token && this.isLoggedIn()) {
      const userData = this.getCurrentUser();
      if (userData) {
        const user: User = {
          id: '',
          username: userData.username,
          email: userData.email || ''
        };
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
      }
    }
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string): Observable<ApiResponse<AuthResponse>> {
    const request: LoginRequest = { username, password };
    return this.http.post<ApiResponse<AuthResponse>>(`${environment.apiUrl}/auth/login`, request).pipe(
      tap(response => {
        if (response.success && response.data) {
          this.setStorageItem(this.tokenKey, response.data.token);
          this.setStorageItem(this.usernameKey, response.data.username);
          this.setStorageItem(this.roleKey, response.data.role);
          
          const user: User = {
            id: '',
            username: response.data.username,
            email: response.data.email
          };
          this.currentUserSubject.next(user);
          this.isAuthenticatedSubject.next(true);
        }
      })
    );
  }

register(username: string, email: string, password: string): Observable<ApiResponse<AuthResponse>> {
    const request: RegisterRequest = { username, email, password };
    return this.http.post<ApiResponse<AuthResponse>>(`${environment.apiUrl}/auth/register`, request).pipe(
      tap(response => {
        if (response.success && response.data) {
          this.setStorageItem(this.tokenKey, response.data.token);
          this.setStorageItem(this.usernameKey, response.data.username);
          this.setStorageItem(this.roleKey, response.data.role);

          const user: User = {
            id: '',
            username: response.data.username,
            email: response.data.email
          };
          this.currentUserSubject.next(user);
          this.isAuthenticatedSubject.next(true);
        }
      })
    );
  }

  logout(): void {
    this.removeStorageItem(this.tokenKey);
    this.removeStorageItem(this.usernameKey);
    this.removeStorageItem(this.roleKey);
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return this.getStorageItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    
    try {
      const payload = this.decodeToken(token);
      if (payload && payload.exp) {
        const expDate = new Date(payload.exp * 1000);
        return expDate.valueOf() > new Date().valueOf();
      }
      return false;
    } catch {
      return false;
    }
  }

  getCurrentUser(): { username: string, role: string, email?: string } | null {
    const username = this.getStorageItem(this.usernameKey);
    const role = this.getStorageItem(this.roleKey);
    
    if (username && role) {
      return { username, role };
    }
    
    const token = this.getToken();
    if (token) {
      try {
        const payload = this.decodeToken(token);
        return {
          username: payload.username || payload.sub,
          role: payload.role || 'ROLE_USER',
          email: payload.email
        };
      } catch {
        return null;
      }
    }
    
    return null;
  }

  private decodeToken(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch {
      return {};
    }
  }

  private getStorageItem(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  private setStorageItem(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch {
      return;
    }
  }

  private removeStorageItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch {
      return;
    }
  }
}
