package com.notetakingapp.service;

import com.notetakingapp.dto.request.CreateNoteRequest;
import com.notetakingapp.dto.request.PatchNoteRequest;
import com.notetakingapp.dto.request.UpdateNoteRequest;
import com.notetakingapp.dto.response.NoteResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface NoteService {

    Page<NoteResponse> getAllNotes(UUID userId, Pageable pageable);

    NoteResponse getNoteById(UUID noteId, UUID userId);

    NoteResponse createNote(CreateNoteRequest request, UUID userId);

    NoteResponse updateNote(UUID noteId, UpdateNoteRequest request, UUID userId);

    NoteResponse patchNote(UUID noteId, PatchNoteRequest request, UUID userId);

    void deleteNote(UUID noteId, UUID userId);

    void bulkDeleteNotes(List<UUID> noteIds, UUID userId);

    Page<NoteResponse> searchNotes(UUID userId, String query, Pageable pageable);

    Page<NoteResponse> getPinnedNotes(UUID userId, Pageable pageable);

    Page<NoteResponse> getArchivedNotes(UUID userId, Pageable pageable);

    boolean noteExists(UUID noteId, UUID userId);
}
