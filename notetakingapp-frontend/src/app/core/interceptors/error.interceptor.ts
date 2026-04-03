import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastr = inject(ToastrService);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unknown error occurred!';

      if (error.error instanceof ErrorEvent) {
        errorMessage = `Error: ${error.error.message}`;
      } else {
        switch (error.status) {
          case 401:
            // Don't auto-logout for auth endpoint 401s (e.g., failed login)
            if (!req.url.includes('/auth/')) {
              authService.logout();
              toastr.error('Session expired. Please login again.', 'Error');
              return throwError(() => new Error('Session expired'));
            }
            // For auth endpoints, let the component handle the error
            return throwError(() => error);
          case 403:
            toastr.error("You don't have permission to do this.", 'Error');
            return throwError(() => new Error('Forbidden'));
          case 404:
            toastr.error('Resource not found.', 'Error');
            return throwError(() => new Error('Not found'));
          case 409:
            const conflictMessage = error.error?.message || 'Conflict error';
            toastr.error(conflictMessage, 'Error');
            return throwError(() => new Error(conflictMessage));
          case 422:
          case 400:
            const validationMessage = error.error?.message || 'Validation error';
            toastr.error(validationMessage, 'Error');
            return throwError(() => new Error(validationMessage));
          case 500:
            toastr.error('Something went wrong. Please try again.', 'Error');
            return throwError(() => new Error('Server error'));
          default:
            if (error.error && error.error.message) {
              errorMessage = error.error.message;
            } else {
              errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
            }
        }
      }
      
      toastr.error(errorMessage, 'Error');
      return throwError(() => new Error(errorMessage));
    })
  );
};
