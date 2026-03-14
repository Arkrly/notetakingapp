package com.notetakingapp.controller;

import com.notetakingapp.dto.request.UpdateUserRequest;
import com.notetakingapp.dto.response.ApiResponse;
import com.notetakingapp.dto.response.UserResponse;
import com.notetakingapp.entity.User;
import com.notetakingapp.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/users")
@Tag(name = "Users", description = "User profile management endpoints")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    @Operation(summary = "Get current user profile", description = "Returns the authenticated user's profile")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser(@AuthenticationPrincipal User user) {
        UserResponse userResponse = userService.getCurrentUser(user.getId());
        return ResponseEntity.ok(ApiResponse.success(userResponse, "User profile retrieved"));
    }

    @PutMapping("/me")
    @Operation(summary = "Update user profile", description = "Full update of the authenticated user's profile")
    public ResponseEntity<ApiResponse<UserResponse>> updateUser(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody UpdateUserRequest request) {
        UserResponse userResponse = userService.updateUser(user.getId(), request);
        return ResponseEntity.ok(ApiResponse.success(userResponse, "Profile updated successfully"));
    }

    @PatchMapping("/me/password")
    @Operation(summary = "Change password", description = "Change the authenticated user's password")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @AuthenticationPrincipal User user,
            @RequestBody Map<String, String> request) {
        String currentPassword = request.get("currentPassword");
        String newPassword = request.get("newPassword");
        userService.changePassword(user.getId(), currentPassword, newPassword);
        return ResponseEntity.ok(ApiResponse.success(null, "Password changed successfully"));
    }

    @DeleteMapping("/me")
    @Operation(summary = "Delete account", description = "Soft deletes the authenticated user's account")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@AuthenticationPrincipal User user) {
        userService.softDeleteUser(user.getId());
        return ResponseEntity.ok(ApiResponse.success(null, "Account deactivated successfully"));
    }

    @RequestMapping(value = "/check", method = RequestMethod.HEAD)
    @Operation(summary = "Check email existence", description = "Returns 200 if email exists, 404 otherwise")
    public ResponseEntity<Void> checkEmailExists(@RequestParam String email) {
        boolean exists = userService.emailExists(email);
        return exists ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }
}
