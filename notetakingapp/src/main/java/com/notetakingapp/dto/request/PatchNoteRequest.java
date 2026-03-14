package com.notetakingapp.dto.request;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PatchNoteRequest {

    @Pattern(regexp = "^#[0-9A-Fa-f]{6}$", message = "Color must be a valid hex color code (e.g. #FFFFFF)")
    private String color;

    private Boolean isPinned;

    private Boolean isArchived;

    @Size(max = 500, message = "Tags must not exceed 500 characters")
    private String tags;
}
