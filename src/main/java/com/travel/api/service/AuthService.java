package com.travel.api.service;

import com.travel.api.dto.AuthRequest;
import com.travel.api.dto.AuthResponse;

public interface AuthService {
    AuthResponse authenticate(AuthRequest request);
    AuthResponse register(AuthRequest request);
} 