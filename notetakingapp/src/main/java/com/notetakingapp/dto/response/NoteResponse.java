package com.notetakingapp.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NoteResponse {

    private UUID id;
    private String title;
    private String content;
    private String color;
    private Boolean isPinned;
    private Boolean isArchived;
    private String tags;
    private Integer version;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
