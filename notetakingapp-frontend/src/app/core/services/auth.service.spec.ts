import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthService, AuthResponse, LoginRequest, RegisterRequest } from './auth.service';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { User } from '../models/user.model';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let mockRouter: { navigate: ReturnType<typeof vi.fn> };

  const mockAuthResponse: AuthResponse = {
    token: 'mock-jwt-token',
    type: 'Bearer',
    username: 'testuser',
    email: 'test@example.com',
    role: 'ROLE_USER',
    expiresIn: 86400,
  };

  const mockApiResponse = (data: AuthResponse): ApiResponse<AuthResponse> => ({
    success: true,
    data,
  });

  beforeEach(() => {
    mockRouter = {
      navigate: vi.fn().mockResolvedValue(true),
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: Router, useValue: mockRouter },
      ],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);

    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should make POST request to /auth/login', () => {
      const loginRequest: LoginRequest = {
        username: 'testuser',
        password: 'password123',
      };

      service.login(loginRequest.username, loginRequest.password).subscribe(response => {
        expect(response.success).toBe(true);
        expect(response.data?.token).toBe(mockAuthResponse.token);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(loginRequest);
      req.flush(mockApiResponse(mockAuthResponse));
    });

    it('should store token on successful login', () => {
      service.login('testuser', 'password123').subscribe();

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
      req.flush(mockApiResponse(mockAuthResponse));

      const token = localStorage.getItem('note_app_token');
      expect(token).toBe(mockAuthResponse.token);
    });

    it('should store username on successful login', () => {
      service.login('testuser', 'password123').subscribe();

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
      req.flush(mockApiResponse(mockAuthResponse));

      const username = localStorage.getItem('username');
      expect(username).toBe(mockAuthResponse.username);
    });

    it('should store role on successful login', () => {
      service.login('testuser', 'password123').subscribe();

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
      req.flush(mockApiResponse(mockAuthResponse));

      const role = localStorage.getItem('role');
      expect(role).toBe(mockAuthResponse.role);
    });

    it('should update currentUser$ on successful login', () => {
      let capturedUser: User | null = null;

      service.login('testuser', 'password123').subscribe();

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
      req.flush(mockApiResponse(mockAuthResponse));

      service.currentUser$.subscribe(user => {
        capturedUser = user;
      });

      // Wait for the subscription to process
      return new Promise(resolve => setTimeout(resolve, 0)).then(() => {
        expect(capturedUser).toBeTruthy();
        expect(capturedUser?.username).toBe(mockAuthResponse.username);
      });
    });

    it('should update isAuthenticated$ to true on successful login', () => {
      let capturedIsAuth = false;

      service.login('testuser', 'password123').subscribe();

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
      req.flush(mockApiResponse(mockAuthResponse));

      service.isAuthenticated$.subscribe(isAuth => {
        capturedIsAuth = isAuth;
      });

      return new Promise(resolve => setTimeout(resolve, 0)).then(() => {
        expect(capturedIsAuth).toBe(true);
      });
    });
  });

  describe('register', () => {
    it('should make POST request to /auth/register', () => {
      const registerRequest: RegisterRequest = {
        username: 'newuser',
        email: 'new@example.com',
        password: 'password123',
      };

      service.register(
        registerRequest.username,
        registerRequest.email,
        registerRequest.password
      ).subscribe(response => {
        expect(response.success).toBe(true);
        expect(response.data?.token).toBe(mockAuthResponse.token);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/register`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(registerRequest);
      req.flush(mockApiResponse(mockAuthResponse));
    });

    it('should store token on successful registration', () => {
      service.register('newuser', 'new@example.com', 'password123').subscribe();

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/register`);
      req.flush(mockApiResponse(mockAuthResponse));

      const token = localStorage.getItem('note_app_token');
      expect(token).toBe(mockAuthResponse.token);
    });

    it('should store username on successful registration', () => {
      service.register('newuser', 'new@example.com', 'password123').subscribe();

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/register`);
      req.flush(mockApiResponse(mockAuthResponse));

      const username = localStorage.getItem('username');
      expect(username).toBe(mockAuthResponse.username);
    });
  });

  describe('logout', () => {
    it('should clear localStorage on logout', () => {
      // First login to set up the state
      service.login('testuser', 'password123').subscribe();
      const req1 = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
      req1.flush(mockApiResponse(mockAuthResponse));

      // Then logout
      service.logout();

      expect(localStorage.getItem('note_app_token')).toBeNull();
      expect(localStorage.getItem('username')).toBeNull();
      expect(localStorage.getItem('role')).toBeNull();
    });

    it('should call router.navigate on logout', () => {
      // First login
      service.login('testuser', 'password123').subscribe();
      let req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
      req.flush(mockApiResponse(mockAuthResponse));

      // Then logout
      service.logout();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should set isAuthenticated$ to false on logout', () => {
      let capturedIsAuth = true;

      // First login
      service.login('testuser', 'password123').subscribe();
      let req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
      req.flush(mockApiResponse(mockAuthResponse));

      // Then logout
      service.logout();

      service.isAuthenticated$.subscribe(isAuth => {
        capturedIsAuth = isAuth;
      });

      return new Promise(resolve => setTimeout(resolve, 0)).then(() => {
        expect(capturedIsAuth).toBe(false);
      });
    });

    it('should set currentUser$ to null on logout', () => {
      let capturedUser: User | null = { id: '1', username: 'test', email: 'test@test.com' };

      // First login
      service.login('testuser', 'password123').subscribe();
      let req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
      req.flush(mockApiResponse(mockAuthResponse));

      // Then logout
      service.logout();

      service.currentUser$.subscribe(user => {
        capturedUser = user;
      });

      return new Promise(resolve => setTimeout(resolve, 0)).then(() => {
        expect(capturedUser).toBeNull();
      });
    });
  });

  describe('getToken', () => {
    it('should return null when no token is stored', () => {
      const token = service.getToken();
      expect(token).toBeNull();
    });

    it('should return stored token', () => {
      localStorage.setItem('note_app_token', 'test-token');
      const token = service.getToken();
      expect(token).toBe('test-token');
    });
  });

  describe('isLoggedIn', () => {
    it('should return false when no token is stored', () => {
      const isLoggedIn = service.isLoggedIn();
      expect(isLoggedIn).toBe(false);
    });

    it('should return false when token is expired', () => {
      // Create an expired JWT token (payload: { exp: 0 })
      const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0Iiwicm9sZSI6IlJPTEVfVVNFUiIsImV4cCI6MH0.invalid';
      localStorage.setItem('note_app_token', expiredToken);
      const isLoggedIn = service.isLoggedIn();
      expect(isLoggedIn).toBe(false);
    });
  });

  describe('getCurrentUser', () => {
    it('should return null when no user data is stored', () => {
      const user = service.getCurrentUser();
      expect(user).toBeNull();
    });

    it('should return user data from localStorage when token is valid', () => {
      localStorage.setItem('note_app_token', mockAuthResponse.token);
      localStorage.setItem('username', mockAuthResponse.username);
      localStorage.setItem('role', mockAuthResponse.role);

      const user = service.getCurrentUser();
      expect(user).toBeTruthy();
      expect(user?.username).toBe(mockAuthResponse.username);
      expect(user?.role).toBe(mockAuthResponse.role);
    });
  });
});
