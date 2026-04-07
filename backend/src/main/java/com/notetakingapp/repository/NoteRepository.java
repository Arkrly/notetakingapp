package com.notetakingapp.repository;

import com.notetakingapp.entity.Note;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface NoteRepository extends JpaRepository<Note, UUID> {

    Page<Note> findByUserId(UUID userId, Pageable pageable);

    Page<Note> findByUserIdAndIsArchivedFalse(UUID userId, Pageable pageable);

    Optional<Note> findByIdAndUserId(UUID id, UUID userId);

    Page<Note> findByUserIdAndIsPinnedTrue(UUID userId, Pageable pageable);

    Page<Note> findByUserIdAndIsArchivedTrue(UUID userId, Pageable pageable);

    @Query("SELECT n FROM Note n WHERE n.user.id = :userId AND " +
            "(LOWER(n.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(n.content) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<Note> searchByTitleOrContent(
            @Param("userId") UUID userId,
            @Param("query") String query,
            Pageable pageable);

    boolean existsByIdAndUserId(UUID id, UUID userId);

    void deleteAllByIdInAndUserId(List<UUID> ids, UUID userId);

    long countByIdInAndUserId(List<UUID> ids, UUID userId);
}
