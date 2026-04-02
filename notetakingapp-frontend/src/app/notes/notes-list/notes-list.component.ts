import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Observable, BehaviorSubject, combineLatest, of } from 'rxjs';
import { map, startWith, switchMap, catchError, tap, distinctUntilChanged } from 'rxjs/operators';

import { NoteService, PagedResponse } from '../../core/services/note.service';
import { Note } from '../../core/models/note.model';
import { ApiResponse } from '../../core/models/api-response.model';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { NoteCardComponent } from '../note-card/note-card.component';
import { NoteFormComponent } from '../note-form/note-form.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';

const NOTES_CACHE_KEY = 'notes_cache';

@Component({
  selector: 'app-notes-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatIconModule,
    MatProgressSpinnerModule,
    SidebarComponent,
    NoteCardComponent
  ],
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotesListComponent implements OnInit {
  private noteService = inject(NoteService);
  private dialog = inject(MatDialog);

  searchControl = new FormControl('');

  private refresh$ = new BehaviorSubject<void>(undefined);
  private cache$ = new BehaviorSubject<Note[]>(this.loadFromCache());

  notes$!: Observable<Note[]>;
  pinnedNotes$!: Observable<Note[]>;
  otherNotes$!: Observable<Note[]>;
  isLoading$ = new BehaviorSubject<boolean>(!this.hasCachedNotes());
  isEmpty$ = new BehaviorSubject<boolean>(this.isCacheEmpty());

  private loadFromCache(): Note[] {
    try {
      const raw = localStorage.getItem(NOTES_CACHE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private saveToCache(notes: Note[]): void {
    try {
      localStorage.setItem(NOTES_CACHE_KEY, JSON.stringify(notes));
    } catch {
      // Storage quota exceeded — ignore
    }
  }

  private hasCachedNotes(): boolean {
    return localStorage.getItem(NOTES_CACHE_KEY) !== null;
  }

  private isCacheEmpty(): boolean {
    const cached = this.loadFromCache();
    return cached.filter((n: Note) => !n.isArchived).length === 0;
  }

  private fetchFromApi(): Observable<Note[]> {
    return this.noteService.getNotes(0, 50).pipe(
      catchError(() => of({ success: false, data: null } as unknown as ApiResponse<PagedResponse<Note>>)),
      tap((response: ApiResponse<PagedResponse<Note>>) => {
        const notes = (response.success && response.data?.content) || [];
        this.saveToCache(notes);
        this.hasFetched = true;
        // Only update cache$ if the content actually changed to avoid re-triggering combineLatest
        if (JSON.stringify(notes) !== JSON.stringify(this.cache$.value)) {
          this.cache$.next(notes);
        }
        this.isLoading$.next(false);
        this.isEmpty$.next(
          notes.filter((n: Note) => !n.isArchived).length === 0
        );
      }),
      map((response: ApiResponse<PagedResponse<Note>>) => {
        return (response.success && response.data?.content) || [];
      })
    );
  }

  private hasFetched = false;

  ngOnInit() {
    const searchTerm$ = this.searchControl.valueChanges.pipe(
      startWith(''),
      map(term => (term || '').toLowerCase()),
      distinctUntilChanged()
    );

    this.notes$ = combineLatest([
      this.cache$,
      this.refresh$.pipe(startWith(undefined as void)),
      searchTerm$
    ]).pipe(
      switchMap(([cached, _, term]: [Note[], void, string]) => {
        if (cached.length === 0 && !this.hasFetched) {
          return this.fetchFromApi().pipe(
            map(notes => this.filterNotes(notes, term))
          );
        }
        if (cached.length === 0 && this.hasFetched) {
          // Already fetched, no notes exist — stop loading
          this.isLoading$.next(false);
          return of([] as Note[]);
        }
        if (this.hasCachedNotes() && this.cache$.value === cached && !this.hasFetched) {
          this.hasFetched = true;
          this.fetchFromApi().subscribe();
        }
        return of(this.filterNotes(cached, term)).pipe(
          tap(() => this.isLoading$.next(false))
        );
      }),
      tap(() => {
        const term = this.searchControl.value?.toLowerCase() || '';
        const filtered = this.filterNotes(this.cache$.value, term);
        this.isEmpty$.next(filtered.length === 0);
      })
    );

    this.pinnedNotes$ = this.notes$.pipe(
      map(notes => notes.filter(n => n.isPinned))
    );

    this.otherNotes$ = this.notes$.pipe(
      map(notes => notes.filter(n => !n.isPinned))
    );
  }

  private filterNotes(notes: Note[], term: string): Note[] {
    const active = notes.filter((n: Note) => !n.isArchived);
    if (!term) return active;
    return active.filter((n: Note) =>
      n.title.toLowerCase().includes(term) ||
      (n.content && n.content.toLowerCase().includes(term)) ||
      (n.tags && n.tags.toLowerCase().includes(term))
    );
  }

  refresh() {
    this.hasFetched = false;
    this.isLoading$.next(true);
    this.noteService.getNotes(0, 50).subscribe({
      next: (response) => {
        if (response.success && response.data?.content) {
          this.saveToCache(response.data.content);
          this.cache$.next(response.data.content);
        }
        this.isLoading$.next(false);
      },
      error: () => {
        this.isLoading$.next(false);
      }
    });
  }

  openNoteForm(note?: Note) {
    const dialogRef = this.dialog.open(NoteFormComponent, {
      data: { note },
      panelClass: 'note-form-dialog-container',
      width: '100%',
      maxWidth: '640px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (note) {
          this.noteService.updateNote(note.id, result).subscribe(() => this.refresh());
        } else {
          this.noteService.createNote(result).subscribe(() => this.refresh());
        }
      }
    });
  }

  togglePin(note: Note) {
    this.noteService.patchNote(note.id, { isPinned: !note.isPinned }).subscribe(() => this.refresh());
  }

  toggleArchive(note: Note) {
    this.noteService.patchNote(note.id, { isArchived: !note.isArchived }).subscribe(() => this.refresh());
  }

  deleteNote(note: Note) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Note',
        message: 'Are you sure you want to delete this note? This action cannot be undone.',
        confirmText: 'Delete',
        isDanger: true
      },
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.noteService.deleteNote(note.id).subscribe(() => this.refresh());
      }
    });
  }
}
