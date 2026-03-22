import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { NotesListComponent } from './notes-list.component';
import { NoteService } from '../../core/services/note.service';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { ApiResponse } from '../../core/models/api-response.model';
import { Note } from '../../core/models/note.model';

describe('NotesListComponent', () => {
  let component: NotesListComponent;
  let fixture: ComponentFixture<NotesListComponent>;
  let mockNoteService: Partial<NoteService>;

  const mockNote: Note = {
    id: '1',
    title: 'Test Note',
    content: 'Content',
    color: 'white',
    tags: 'tag1',
    isPinned: true,
    isArchived: false,
    version: 1,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  };

  const mockResponse: ApiResponse<any> = {
    success: true,
    data: {
      content: [mockNote],
      number: 0,
      size: 50,
      totalElements: 1,
      totalPages: 1,
      first: true,
      last: true,
      empty: false,
    },
  };

  beforeEach(async () => {
    mockNoteService = {
      getNotes: vi.fn().mockReturnValue(of(mockResponse)),
      patchNote: vi.fn().mockReturnValue(of({ success: true })),
      deleteNote: vi.fn().mockReturnValue(of({ success: true })),
    };

    await TestBed.configureTestingModule({
      imports: [NotesListComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        { provide: NoteService, useValue: mockNoteService },
        { provide: MatDialog, useValue: { open: vi.fn().mockReturnValue({ afterClosed: () => of(null) }) } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NotesListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have searchControl initialized', () => {
    expect(component.searchControl).toBeTruthy();
    expect(component.searchControl.value).toBe('');
  });

  it('should call getNotes when initialized', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    expect(mockNoteService.getNotes).toHaveBeenCalled();
  });
});
