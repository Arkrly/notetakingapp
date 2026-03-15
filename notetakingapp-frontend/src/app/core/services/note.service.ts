import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Note, NoteColor } from '../models/note.model';
import { ApiResponse } from '../models/api-response.model';
import { environment } from '../../../environments/environment';

export interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface CreateNoteRequest {
  title: string;
  content?: string;
  color?: string;
  tags?: string;
}

export interface UpdateNoteRequest {
  title: string;
  content: string;
  color?: string;
  isPinned?: boolean;
  isArchived?: boolean;
  tags?: string;
}

export interface PatchNoteRequest {
  color?: string;
  isPinned?: boolean;
  isArchived?: boolean;
  tags?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NoteService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/notes`;

  private buildPaginationParams(page: number, size: number, sort: string = 'createdAt,desc'): HttpParams {
    return new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', sort);
  }

  getNotes(page: number = 0, size: number = 10): Observable<ApiResponse<PagedResponse<Note>>> {
    const params = this.buildPaginationParams(page, size);
    
    return this.http.get<ApiResponse<PagedResponse<Note>>>(this.apiUrl, { params });
  }

  getNoteById(id: string): Observable<ApiResponse<Note>> {
    return this.http.get<ApiResponse<Note>>(`${this.apiUrl}/${id}`);
  }

  createNote(request: CreateNoteRequest): Observable<ApiResponse<Note>> {
    return this.http.post<ApiResponse<Note>>(this.apiUrl, request);
  }

  updateNote(id: string, request: UpdateNoteRequest): Observable<ApiResponse<Note>> {
    return this.http.put<ApiResponse<Note>>(`${this.apiUrl}/${id}`, request);
  }

  patchNote(id: string, request: PatchNoteRequest): Observable<ApiResponse<Note>> {
    return this.http.patch<ApiResponse<Note>>(`${this.apiUrl}/${id}`, request);
  }

  deleteNote(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }

  bulkDelete(ids: string[]): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/bulk`, { body: { ids } });
  }

  searchNotes(query: string): Observable<ApiResponse<PagedResponse<Note>>> {
    const params = this.buildPaginationParams(0, 20);
    const searchParams = params.set('q', query);
    
    return this.http.get<ApiResponse<PagedResponse<Note>>>(`${this.apiUrl}/search`, { params: searchParams });
  }

  getPinnedNotes(): Observable<ApiResponse<Note[]>> {
    const params = this.buildPaginationParams(0, 10);
    
    return this.http.get<ApiResponse<Note[]>>(`${this.apiUrl}/pinned`, { params });
  }

  getArchivedNotes(): Observable<ApiResponse<Note[]>> {
    const params = this.buildPaginationParams(0, 20);
    
    return this.http.get<ApiResponse<Note[]>>(`${this.apiUrl}/archived`, { params });
  }
}
