package com.notetakingapp.dto.request;

import jakarta.validation.constraints.Email;
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
public class UpdateUserRequest {

    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    @Pattern(regexp = "^[a-zA-Z0-9_]+$", message = "Username can only contain letters, numbers, and underscores")
    private String username;

    @Email(message = "Must be a valid email address")
    private String email;

    @Size(min = 8, max = 100, message = "Password must be between 8 and 100 characters")
    private String currentPassword;

    @Size(min = 8, max = 100, message = "New password must be between 8 and 100 characters")
    private String newPassword;
}
