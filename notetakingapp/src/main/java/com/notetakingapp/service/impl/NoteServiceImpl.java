package com.notetakingapp.service.impl;

import com.notetakingapp.dto.request.CreateNoteRequest;
import com.notetakingapp.dto.request.PatchNoteRequest;
import com.notetakingapp.dto.request.UpdateNoteRequest;
import com.notetakingapp.dto.response.NoteResponse;
import com.notetakingapp.entity.Note;
import com.notetakingapp.entity.User;
import com.notetakingapp.exception.ResourceNotFoundException;
import com.notetakingapp.exception.UnauthorizedException;
import com.notetakingapp.mapper.NoteMapper;
import com.notetakingapp.repository.NoteRepository;
import com.notetakingapp.repository.UserRepository;
import com.notetakingapp.service.NoteService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Slf4j
@Service
public class NoteServiceImpl implements NoteService {

    private final NoteRepository noteRepository;
    private final UserRepository userRepository;
    private final NoteMapper noteMapper;

    public NoteServiceImpl(NoteRepository noteRepository,
            UserRepository userRepository,
            NoteMapper noteMapper) {
        this.noteRepository = noteRepository;
        this.userRepository = userRepository;
        this.noteMapper = noteMapper;
    }

    @Override
    public Page<NoteResponse> getAllNotes(UUID userId, Pageable pageable) {
        log.debug("Fetching all notes for user: {}", userId);
        return noteRepository.findByUserId(userId, pageable)
                .map(noteMapper::toResponse);
    }

    @Override
    public NoteResponse getNoteById(UUID noteId, UUID userId) {
        log.debug("Fetching note {} for user {}", noteId, userId);
        Note note = findNoteAndVerifyOwnership(noteId, userId);
        return noteMapper.toResponse(note);
    }

    @Override
    @Transactional
    public NoteResponse createNote(CreateNoteRequest request, UUID userId) {
        log.info("Creating note for user: {}", userId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Note note = noteMapper.toEntity(request);
        note.setUser(user);

        if (request.getColor() == null) {
            note.setColor("#FFFFFF");
        }

        Note savedNote = noteRepository.save(note);
        log.info("Note created with id: {}", savedNote.getId());
        return noteMapper.toResponse(savedNote);
    }

    @Override
    @Transactional
    public NoteResponse updateNote(UUID noteId, UpdateNoteRequest request, UUID userId) {
        log.info("Updating note {} for user {}", noteId, userId);
        Note note = findNoteAndVerifyOwnership(noteId, userId);

        note.setTitle(request.getTitle());
        note.setContent(request.getContent());
        note.setColor(request.getColor() != null ? request.getColor() : note.getColor());
        note.setIsPinned(request.getIsPinned() != null ? request.getIsPinned() : note.getIsPinned());
        note.setIsArchived(request.getIsArchived() != null ? request.getIsArchived() : note.getIsArchived());
        note.setTags(request.getTags());

        Note updatedNote = noteRepository.save(note);
        return noteMapper.toResponse(updatedNote);
    }

    @Override
    @Transactional
    public NoteResponse patchNote(UUID noteId, PatchNoteRequest request, UUID userId) {
        log.info("Patching note {} for user {}", noteId, userId);
        Note note = findNoteAndVerifyOwnership(noteId, userId);

        if (request.getIsPinned() != null) {
            note.setIsPinned(request.getIsPinned());
        }
        if (request.getIsArchived() != null) {
            note.setIsArchived(request.getIsArchived());
        }
        if (request.getColor() != null) {
            note.setColor(request.getColor());
        }
        if (request.getTags() != null) {
            note.setTags(request.getTags());
        }

        Note patchedNote = noteRepository.save(note);
        return noteMapper.toResponse(patchedNote);
    }

    @Override
    @Transactional
    public void deleteNote(UUID noteId, UUID userId) {
        log.info("Deleting note {} for user {}", noteId, userId);
        Note note = findNoteAndVerifyOwnership(noteId, userId);
        noteRepository.delete(note);
    }

    @Override
    @Transactional
    public void bulkDeleteNotes(List<UUID> noteIds, UUID userId) {
        log.info("Bulk deleting {} notes for user {}", noteIds.size(), userId);
        noteRepository.deleteAllByIdInAndUserId(noteIds, userId);
    }

    @Override
    public Page<NoteResponse> searchNotes(UUID userId, String query, Pageable pageable) {
        log.debug("Searching notes for user {} with query: {}", userId, query);
        return noteRepository.searchByTitleOrContent(userId, query, pageable)
                .map(noteMapper::toResponse);
    }

    @Override
    public Page<NoteResponse> getPinnedNotes(UUID userId, Pageable pageable) {
        log.debug("Fetching pinned notes for user: {}", userId);
        return noteRepository.findByUserIdAndIsPinnedTrue(userId, pageable)
                .map(noteMapper::toResponse);
    }

    @Override
    public Page<NoteResponse> getArchivedNotes(UUID userId, Pageable pageable) {
        log.debug("Fetching archived notes for user: {}", userId);
        return noteRepository.findByUserIdAndIsArchivedTrue(userId, pageable)
                .map(noteMapper::toResponse);
    }

    @Override
    public boolean noteExists(UUID noteId, UUID userId) {
        return noteRepository.existsByIdAndUserId(noteId, userId);
    }

    private Note findNoteAndVerifyOwnership(UUID noteId, UUID userId) {
        Note note = noteRepository.findById(noteId)
                .orElseThrow(() -> new ResourceNotFoundException("Note", "id", noteId));

        if (!note.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You do not have permission to access this note");
        }
        return note;
    }
}
