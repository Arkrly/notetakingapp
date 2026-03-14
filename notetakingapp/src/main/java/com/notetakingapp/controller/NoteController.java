package com.notetakingapp.controller;

import com.notetakingapp.dto.request.CreateNoteRequest;
import com.notetakingapp.dto.request.PatchNoteRequest;
import com.notetakingapp.dto.request.UpdateNoteRequest;
import com.notetakingapp.dto.response.ApiResponse;
import com.notetakingapp.dto.response.NoteResponse;
import com.notetakingapp.entity.User;
import com.notetakingapp.service.NoteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/notes")
@Tag(name = "Notes", description = "Note CRUD and management endpoints")
public class NoteController {

    private final NoteService noteService;

    public NoteController(NoteService noteService) {
        this.noteService = noteService;
    }

    @GetMapping
    @Operation(summary = "Get all notes", description = "Returns paginated list of user's notes")
    public ResponseEntity<ApiResponse<Page<NoteResponse>>> getAllNotes(
            @AuthenticationPrincipal User user,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<NoteResponse> notes = noteService.getAllNotes(user.getId(), pageable);
        return ResponseEntity.ok(ApiResponse.success(notes, "Notes retrieved successfully"));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get note by ID", description = "Returns a single note by its ID")
    public ResponseEntity<ApiResponse<NoteResponse>> getNoteById(
            @PathVariable UUID id,
            @AuthenticationPrincipal User user) {
        NoteResponse note = noteService.getNoteById(id, user.getId());
        return ResponseEntity.ok(ApiResponse.success(note, "Note retrieved successfully"));
    }

    @PostMapping
    @Operation(summary = "Create a note", description = "Creates a new note for the authenticated user")
    public ResponseEntity<ApiResponse<NoteResponse>> createNote(
            @Valid @RequestBody CreateNoteRequest request,
            @AuthenticationPrincipal User user) {
        NoteResponse note = noteService.createNote(request, user.getId());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(note, "Note created successfully"));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update note", description = "Full update of an existing note")
    public ResponseEntity<ApiResponse<NoteResponse>> updateNote(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateNoteRequest request,
            @AuthenticationPrincipal User user) {
        NoteResponse note = noteService.updateNote(id, request, user.getId());
        return ResponseEntity.ok(ApiResponse.success(note, "Note updated successfully"));
    }

    @PatchMapping("/{id}")
    @Operation(summary = "Patch note", description = "Partial update — pin, archive, color, tags only")
    public ResponseEntity<ApiResponse<NoteResponse>> patchNote(
            @PathVariable UUID id,
            @Valid @RequestBody PatchNoteRequest request,
            @AuthenticationPrincipal User user) {
        NoteResponse note = noteService.patchNote(id, request, user.getId());
        return ResponseEntity.ok(ApiResponse.success(note, "Note patched successfully"));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete note", description = "Deletes a single note")
    public ResponseEntity<ApiResponse<Void>> deleteNote(
            @PathVariable UUID id,
            @AuthenticationPrincipal User user) {
        noteService.deleteNote(id, user.getId());
        return ResponseEntity.ok(ApiResponse.success(null, "Note deleted successfully"));
    }

    @DeleteMapping("/bulk")
    @Operation(summary = "Bulk delete notes", description = "Deletes multiple notes by their IDs")
    public ResponseEntity<ApiResponse<Void>> bulkDeleteNotes(
            @RequestBody List<UUID> noteIds,
            @AuthenticationPrincipal User user) {
        noteService.bulkDeleteNotes(noteIds, user.getId());
        return ResponseEntity.ok(ApiResponse.success(null, "Notes deleted successfully"));
    }

    @GetMapping("/search")
    @Operation(summary = "Search notes", description = "Search notes by title or content")
    public ResponseEntity<ApiResponse<Page<NoteResponse>>> searchNotes(
            @RequestParam("q") String query,
            @AuthenticationPrincipal User user,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<NoteResponse> notes = noteService.searchNotes(user.getId(), query, pageable);
        return ResponseEntity.ok(ApiResponse.success(notes, "Search results retrieved"));
    }

    @GetMapping("/pinned")
    @Operation(summary = "Get pinned notes", description = "Returns all pinned notes for the user")
    public ResponseEntity<ApiResponse<Page<NoteResponse>>> getPinnedNotes(
            @AuthenticationPrincipal User user,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<NoteResponse> notes = noteService.getPinnedNotes(user.getId(), pageable);
        return ResponseEntity.ok(ApiResponse.success(notes, "Pinned notes retrieved"));
    }

    @GetMapping("/archived")
    @Operation(summary = "Get archived notes", description = "Returns all archived notes for the user")
    public ResponseEntity<ApiResponse<Page<NoteResponse>>> getArchivedNotes(
            @AuthenticationPrincipal User user,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<NoteResponse> notes = noteService.getArchivedNotes(user.getId(), pageable);
        return ResponseEntity.ok(ApiResponse.success(notes, "Archived notes retrieved"));
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.HEAD)
    @Operation(summary = "Check note existence", description = "Returns 200 if note exists, 404 otherwise")
    public ResponseEntity<Void> checkNoteExists(
            @PathVariable UUID id,
            @AuthenticationPrincipal User user) {
        boolean exists = noteService.noteExists(id, user.getId());
        return exists ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }
}
