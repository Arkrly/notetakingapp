import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Observable, BehaviorSubject, combineLatest, of } from 'rxjs';
import { map, startWith, switchMap, tap, catchError } from 'rxjs/operators';

import { NoteService, PagedResponse } from '../../core/services/note.service';
import { Note } from '../../core/models/note.model';
import { ApiResponse } from '../../core/models/api-response.model';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { NoteCardComponent } from '../note-card/note-card.component';
import { NoteFormComponent } from '../note-form/note-form.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';

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
  styleUrls: ['./notes-list.component.css']
})
export class NotesListComponent implements OnInit {
  private noteService = inject(NoteService);
  private dialog = inject(MatDialog);

  searchControl = new FormControl('');
  
  private refresh$ = new BehaviorSubject<void>(undefined);
  
  notes$!: Observable<Note[]>;
  pinnedNotes$!: Observable<Note[]>;
  otherNotes$!: Observable<Note[]>;
  isLoading$ = new BehaviorSubject<boolean>(false);
  isEmpty$ = new BehaviorSubject<boolean>(false);

  ngOnInit() {
    const searchTerm$ = this.searchControl.valueChanges.pipe(
      startWith(''),
      map(term => (term || '').toLowerCase())
    );

    this.notes$ = combineLatest([
      this.refresh$,
      searchTerm$
    ]).pipe(
      tap(() => {
        this.isLoading$.next(true);
        this.isEmpty$.next(false);
      }),
      switchMap(([_, term]: [void, string]) => 
        this.noteService.getNotes(0, 50).pipe(
          catchError(() => of({ success: false, data: null } as unknown as ApiResponse<PagedResponse<Note>>))
        )
      ),
      map((response: ApiResponse<PagedResponse<Note>>) => {
        this.isLoading$.next(false);
        if (!response.success || !response.data) {
          this.isEmpty$.next(true);
          return [];
        }
        const notes = response.data.content || [];
        this.isEmpty$.next(notes.length === 0);
        
        const term = this.searchControl.value?.toLowerCase() || '';
        
        if (!term) return notes.filter((n: Note) => !n.isArchived);
        return notes.filter((n: Note) => !n.isArchived && (
          n.title.toLowerCase().includes(term) || 
          (n.content && n.content.toLowerCase().includes(term)) ||
          (n.tags && n.tags.toLowerCase().includes(term))
        ));
      })
    );

    this.pinnedNotes$ = this.notes$.pipe(
      map(notes => notes.filter(n => n.isPinned))
    );

    this.otherNotes$ = this.notes$.pipe(
      map(notes => notes.filter(n => !n.isPinned))
    );
  }

  refresh() {
    this.refresh$.next();
  }

  openNoteForm(note?: Note) {
    const dialogRef = this.dialog.open(NoteFormComponent, {
      data: { note },
      panelClass: 'note-form-dialog-container',
      width: '100%',
      maxWidth: '560px'
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
