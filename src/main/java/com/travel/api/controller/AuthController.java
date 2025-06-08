package com.travel.api.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.travel.api.model.User;
import com.travel.api.service.UserService;

import lombok.Data;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:8080/api")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = userService.generateToken(authentication);

        return ResponseEntity.ok(new JwtResponse(jwt));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> register(@RequestBody SignupRequest signupRequest) {
        if (userService.existsByUsername(signupRequest.getUsername())) {
            return ResponseEntity.badRequest().body("Username is already taken!");
        }

        if (userService.existsByEmail(signupRequest.getEmail())) {
            return ResponseEntity.badRequest().body("Email is already in use!");
        }

        User user = new User();
        user.setUsername(signupRequest.getUsername());
        user.setEmail(signupRequest.getEmail());
        user.setPassword(signupRequest.getPassword());
        user.setFullName(signupRequest.getFullName());
        user.setPhone(signupRequest.getPhone());

        userService.createUser(user);

        return ResponseEntity.ok("User registered successfully!");
    }

    @Data
    public static class LoginRequest {
        private String username;
        private String password;
    }

    @Data
    public static class SignupRequest {
        private String username;
        private String email;
        private String password;
        private String fullName;
        private String phone;
    }

    @Data
    public static class JwtResponse {
        private String token;
        private String type = "Bearer";

        public JwtResponse(String token) {
            this.token = token;
        }
    }
} 