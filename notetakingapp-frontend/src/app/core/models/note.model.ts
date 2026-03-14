export type NoteColor = 'white' | 'yellow' | 'green' | 'blue' | 'pink' | 'purple' | string;

export interface Note {
  id: string;
  title: string;
  content: string;
  color: NoteColor;
  tags: string;
  isPinned: boolean;
  isArchived: boolean;
  version: number;
  createdAt: string;
  updatedAt: string;
}
