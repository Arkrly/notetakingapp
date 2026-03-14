package com.notetakingapp.service.impl;

import com.notetakingapp.dto.request.UpdateUserRequest;
import com.notetakingapp.dto.response.UserResponse;
import com.notetakingapp.entity.User;
import com.notetakingapp.exception.ResourceNotFoundException;
import com.notetakingapp.exception.ValidationException;
import com.notetakingapp.mapper.UserMapper;
import com.notetakingapp.repository.UserRepository;
import com.notetakingapp.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Slf4j
@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository,
            UserMapper userMapper,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UserResponse getCurrentUser(UUID userId) {
        log.debug("Fetching user profile for: {}", userId);
        User user = findUserById(userId);
        return userMapper.toResponse(user);
    }

    @Override
    @Transactional
    public UserResponse updateUser(UUID userId, UpdateUserRequest request) {
        log.info("Updating user profile for: {}", userId);
        User user = findUserById(userId);

        if (request.getUsername() != null) {
            user.setUsername(request.getUsername());
        }
        if (request.getEmail() != null) {
            user.setEmail(request.getEmail());
        }

        User updatedUser = userRepository.save(user);
        return userMapper.toResponse(updatedUser);
    }

    @Override
    @Transactional
    public void changePassword(UUID userId, String currentPassword, String newPassword) {
        log.info("Changing password for user: {}", userId);
        User user = findUserById(userId);

        if (!passwordEncoder.matches(currentPassword, user.getPasswordHash())) {
            throw new ValidationException("Current password is incorrect");
        }

        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        log.info("Password changed successfully for user: {}", userId);
    }

    @Override
    @Transactional
    public void softDeleteUser(UUID userId) {
        log.info("Soft deleting user: {}", userId);
        User user = findUserById(userId);
        user.setIsActive(false);
        userRepository.save(user);
    }

    @Override
    public boolean emailExists(String email) {
        return userRepository.existsByEmail(email);
    }

    private User findUserById(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
    }
}
