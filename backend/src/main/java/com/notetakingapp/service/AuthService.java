package com.notetakingapp.service;

import com.notetakingapp.dto.request.LoginRequest;
import com.notetakingapp.dto.request.RegisterRequest;
import com.notetakingapp.dto.response.AuthResponse;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);
}
