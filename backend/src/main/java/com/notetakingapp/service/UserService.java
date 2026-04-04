package com.notetakingapp.service;

import com.notetakingapp.dto.request.UpdateUserRequest;
import com.notetakingapp.dto.response.UserResponse;

import java.util.UUID;

public interface UserService {

    UserResponse getCurrentUser(UUID userId);

    UserResponse updateUser(UUID userId, UpdateUserRequest request);

    void changePassword(UUID userId, String currentPassword, String newPassword);

    void softDeleteUser(UUID userId);

    boolean emailExists(String email);
}
