package com.notetakingapp.service.impl;

import com.notetakingapp.exception.UnauthorizedException;
import com.notetakingapp.repository.NoteRepository;
import com.notetakingapp.repository.UserRepository;
import com.notetakingapp.mapper.NoteMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.Collections;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class NoteServiceImplTest {

    @Mock
    private NoteRepository noteRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private NoteMapper noteMapper;

    private NoteServiceImpl noteService;

    private UUID userId;
    private UUID otherUserId;

    @BeforeEach
    void setUp() {
        noteService = new NoteServiceImpl(noteRepository, userRepository, noteMapper);
        userId = UUID.randomUUID();
        otherUserId = UUID.randomUUID();
    }

    @Test
    void bulkDeleteNotes_shouldThrowUnauthorized_whenSomeNotesDontBelongToUser() {
        // Arrange: User tries to delete 3 notes, but only 2 belong to them
        UUID noteId1 = UUID.randomUUID();
        UUID noteId2 = UUID.randomUUID();
        UUID noteId3 = UUID.randomUUID(); // This one belongs to another user

        when(noteRepository.countByIdInAndUserId(Arrays.asList(noteId1, noteId2, noteId3), userId))
                .thenReturn(2L); // Only 2 notes belong to user

        // Act & Assert: Should throw UnauthorizedException
        assertThrows(UnauthorizedException.class, () -> {
            noteService.bulkDeleteNotes(Arrays.asList(noteId1, noteId2, noteId3), userId);
        });

        // Verify delete was never called
        verify(noteRepository, never()).deleteAllByIdInAndUserId(any(), any());
    }

    @Test
    void bulkDeleteNotes_shouldSucceed_whenAllNotesBelongToUser() {
        // Arrange: User tries to delete 2 notes, both belong to them
        UUID noteId1 = UUID.randomUUID();
        UUID noteId2 = UUID.randomUUID();

        when(noteRepository.countByIdInAndUserId(Arrays.asList(noteId1, noteId2), userId))
                .thenReturn(2L);

        // Act: Should not throw
        assertDoesNotThrow(() -> {
            noteService.bulkDeleteNotes(Arrays.asList(noteId1, noteId2), userId);
        });

        // Verify delete was called
        verify(noteRepository).deleteAllByIdInAndUserId(Arrays.asList(noteId1, noteId2), userId);
    }

    @Test
    void bulkDeleteNotes_shouldThrowUnauthorized_whenEmptyListProvided() {
        // Arrange: Empty list should be handled
        when(noteRepository.countByIdInAndUserId(Collections.emptyList(), userId))
                .thenReturn(0L);

        // Act & Assert: Should throw because count doesn't match
        assertThrows(UnauthorizedException.class, () -> {
            noteService.bulkDeleteNotes(Collections.emptyList(), userId);
        });
    }

    @Test
    void bulkDeleteNotes_shouldPreventIDOR_whenAttackerManipulatesIds() {
        // Arrange: Attacker tries to delete notes they don't own
        UUID attackerId = userId;
        UUID victimId = otherUserId;

        UUID victimNoteId1 = UUID.randomUUID();
        UUID victimNoteId2 = UUID.randomUUID();

        // Attacker tries to delete victim's notes by manipulating IDs
        when(noteRepository.countByIdInAndUserId(Arrays.asList(victimNoteId1, victimNoteId2), attackerId))
                .thenReturn(0L); // None of these belong to attacker

        // Act & Assert: Should throw UnauthorizedException (IDOR prevented)
        assertThrows(UnauthorizedException.class, () -> {
            noteService.bulkDeleteNotes(Arrays.asList(victimNoteId1, victimNoteId2), attackerId);
        });

        // Verify delete was never called (attacker's request blocked)
        verify(noteRepository, never()).deleteAllByIdInAndUserId(any(), any());
    }
}
