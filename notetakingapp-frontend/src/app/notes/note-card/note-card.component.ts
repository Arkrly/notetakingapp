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
    const borderMap: Record<string, string> = {
      'white': 'border-slate-200/80',
      'yellow': 'border-yellow-300/60',
      'green': 'border-green-300/60',
      'blue': 'border-blue-300/60',
      'pink': 'border-pink-300/60',
      'purple': 'border-purple-300/60',
      'orange': 'border-orange-300/60'
    };
    return borderMap[this.note.color] || 'border-slate-200/80';
  }

  get tagBgClass(): string {
    const tagBgMap: Record<string, string> = {
      'white': 'bg-slate-200/60 text-slate-700',
      'yellow': 'bg-yellow-300/50 text-yellow-800',
      'green': 'bg-green-300/50 text-green-800',
      'blue': 'bg-blue-300/50 text-blue-800',
      'pink': 'bg-pink-300/50 text-pink-800',
      'purple': 'bg-purple-300/50 text-purple-800',
      'orange': 'bg-orange-300/50 text-orange-800'
    };
    return tagBgMap[this.note.color] || 'bg-slate-200/60 text-slate-700';
  }

  get tagList(): string[] {
    return this.note.tags ? this.note.tags.split(',').map(t => t.trim()).filter(t => t) : [];
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
