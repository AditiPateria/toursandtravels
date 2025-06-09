package com.travel.api.controller;

import com.travel.api.dto.AuthRequest;
import com.travel.api.dto.AuthResponse;
import com.travel.api.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Endpoints for user authentication")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    @Operation(summary = "Login user",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Successfully authenticated"),
                    @ApiResponse(responseCode = "401", description = "Invalid credentials")
            })
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        return ResponseEntity.ok(authService.authenticate(request));
    }

    @PostMapping("/register")
    @Operation(summary = "Register new user",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Successfully registered"),
                    @ApiResponse(responseCode = "400", description = "Invalid input or email already exists")
            })
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody AuthRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }
} 