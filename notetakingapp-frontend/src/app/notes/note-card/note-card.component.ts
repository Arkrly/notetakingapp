import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Note } from '../../core/models/note.model';

@Component({
  selector: 'app-note-card',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './note-card.component.html',
  styleUrls: ['./note-card.component.css']
})
export class NoteCardComponent {
  @Input({ required: true }) note!: Note;
  
  @Output() pinToggle = new EventEmitter<Note>();
  @Output() archiveToggle = new EventEmitter<Note>();
  @Output() edit = new EventEmitter<Note>();
  @Output() delete = new EventEmitter<Note>();

  get bgClass(): string {
    return `bg-note-${this.note.color}`;
  }

  get borderClass(): string {
    // Custom borders to match template
    const borderMap: Record<string, string> = {
      'white': 'border-slate-200',
      'yellow': 'border-yellow-200/50',
      'green': 'border-green-200/50',
      'blue': 'border-blue-200/50',
      'pink': 'border-pink-200/50',
      'purple': 'border-purple-200/50'
    };
    return borderMap[this.note.color] || 'border-slate-200';
  }

  get tagBgClass(): string {
    const tagBgMap: Record<string, string> = {
      'white': 'bg-slate-100',
      'yellow': 'bg-yellow-200/50',
      'green': 'bg-green-200/50',
      'blue': 'bg-blue-200/50',
      'pink': 'bg-pink-200/50',
      'purple': 'bg-purple-200/50'
    };
    return tagBgMap[this.note.color] || 'bg-slate-100';
  }

  onPinClick(event: Event) {
    event.stopPropagation();
    this.pinToggle.emit(this.note);
  }

  onArchiveClick(event: Event) {
    event.stopPropagation();
    this.archiveToggle.emit(this.note);
  }

  onEditClick(event: Event) {
    event.stopPropagation();
    this.edit.emit(this.note);
  }

  onDeleteClick(event: Event) {
    event.stopPropagation();
    this.delete.emit(this.note);
  }
}
