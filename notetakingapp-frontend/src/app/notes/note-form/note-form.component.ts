import { Component, Inject, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule, MatChipInputEvent } from '@angular/material/chips';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Note, NoteColor } from '../../core/models/note.model';

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
export class NoteFormComponent {
  private fb = inject(FormBuilder);
  public dialogRef = inject(MatDialogRef<NoteFormComponent>);
  
  noteForm: FormGroup;
  tags: string[] = [];
  selectedColor: NoteColor = 'white';
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  colors: NoteColor[] = ['white', 'yellow', 'green', 'blue', 'pink', 'purple'];

  private colorMap: Record<NoteColor, string> = {
    white: '#ffffff',
    yellow: '#fef9c3',
    green: '#dcfce7',
    blue: '#dbeafe',
    pink: '#fce7f3',
    purple: '#f3e8ff'
  };

  constructor(@Inject(MAT_DIALOG_DATA) public data: NoteFormData) {
    const note = data?.note;
    if (note) {
      this.tags = note.tags ? note.tags.split(',').map((t: string) => t.trim()).filter((t: string) => t) : [];
      this.selectedColor = note.color;
    }
    
    this.noteForm = this.fb.group({
      title: [note?.title || '', Validators.required],
      content: [note?.content || '']
    });
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
    const value = (event.value || '').trim();
    if (value) {
      // Add # prefix if missing for display, or store raw
      // The template example uses # prefix, so we store it clean and display with # if needed
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
        tags: this.tags.join(',')
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
