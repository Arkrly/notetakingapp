import { Component, Inject, inject, ChangeDetectionStrategy, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule, MatChipInputEvent } from '@angular/material/chips';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { animate } from 'framer-motion';
import { Note, NoteColor } from '../../core/models/note.model';
import { MotionService } from '../../core/services/motion.service';

export interface NoteFormData {
  note?: Note;
}

@Component({
  selector: 'app-note-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule
  ],
  templateUrl: './note-form.component.html',
  styleUrls: ['./note-form.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoteFormComponent implements AfterViewInit {
  private fb = inject(FormBuilder);
  public dialogRef = inject(MatDialogRef<NoteFormComponent>);
  private motion = inject(MotionService);

  noteForm: FormGroup;
  tags: string[] = [];
  selectedColor: NoteColor = 'white';
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  isPinned = false;
  isArchived = false;

  colors: NoteColor[] = ['white', 'yellow', 'green', 'blue', 'pink', 'purple', 'orange'];

  private colorMap: Record<NoteColor, string> = {
    white: '#ffffff',
    yellow: '#fef9c3',
    green: '#dcfce7',
    blue: '#dbeafe',
    pink: '#fce7f3',
    purple: '#f3e8ff',
    orange: '#ffedd5'
  };

  constructor(@Inject(MAT_DIALOG_DATA) public data: NoteFormData) {
    const note = data?.note;
    if (note) {
      this.tags = note.tags ? note.tags.split(',').map((t: string) => t.trim().toLowerCase()).filter((t: string) => t) : [];
      this.selectedColor = note.color;
      this.isPinned = note.isPinned || false;
      this.isArchived = note.isArchived || false;
    }
    
    this.noteForm = this.fb.group({
      title: [note?.title || '', Validators.required],
      content: [note?.content || '']
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      animate('.modal-overlay', { opacity: [0, 1] }, { duration: 0.15 });
      animate('.modal-panel', { opacity: [0, 1], scale: [0.94, 1], y: [16, 0] }, { type: 'spring', stiffness: 320, damping: 25 });
    }, 0);
  }

  get bgClass(): string {
    return `bg-note-${this.selectedColor}`;
  }

  get bgStyle(): string {
    return this.colorMap[this.selectedColor];
  }

  selectColor(color: NoteColor) {
    this.selectedColor = color;
  }

  addTag(event: MatChipInputEvent): void {
    const value = (event.value || '').trim().toLowerCase();
    if (value && !this.tags.includes(value)) {
      this.tags.push(value);
    }
    event.chipInput!.clear();
  }

  removeTag(tag: string): void {
    const index = this.tags.indexOf(tag);
    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  onSubmit() {
    if (this.noteForm.valid) {
      this.dialogRef.close({
        ...this.noteForm.value,
        color: this.colorMap[this.selectedColor],
        tags: this.tags.join(','),
        isPinned: this.isPinned,
        isArchived: this.isArchived
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
