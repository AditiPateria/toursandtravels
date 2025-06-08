package com.travel.api.controller;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.travel.api.dto.AuthRequest;
import com.travel.api.dto.AuthResponse;
import com.travel.api.dto.RegisterRequest;
import com.travel.api.model.ERole;
import com.travel.api.model.Role;
import com.travel.api.model.User;
import com.travel.api.repository.RoleRepository;
import com.travel.api.service.JwtService;
import com.travel.api.service.UserService;

import jakarta.validation.Valid;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
	private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

	@Autowired
	private AuthenticationManager authenticationManager;

	@Autowired
	private UserService userService;

	@Autowired
	private RoleRepository roleRepository;

	@Autowired
	private PasswordEncoder encoder;

	@Autowired
	private JwtService jwtService;

	@PostMapping("/login")
	public ResponseEntity<?> authenticateUser(@Valid @RequestBody AuthRequest loginRequest) {
		try {
			Authentication authentication = authenticationManager.authenticate(
					new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

			// Generate JWT token
			String jwt = jwtService.generateJwtToken(authentication);

			// Get user details from authentication
			UserDetails userDetails = (UserDetails) authentication.getPrincipal();

			// Get user roles from authentication
			List<String> roles = userDetails.getAuthorities().stream().map(GrantedAuthority::getAuthority)
					.collect(Collectors.toList());

			// Get the actual user from database to get ID and email
			User user = userService.findByUsername(userDetails.getUsername());

			return ResponseEntity.ok(new AuthResponse(jwt, user.getId(), user.getUsername(), user.getEmail(), roles));

		} catch (BadCredentialsException e) {
			logger.error("Authentication failed for user: {}", loginRequest.getUsername());
			return ResponseEntity.status(401).body("Invalid username or password");
		} catch (Exception e) {
			logger.error("Authentication error: ", e);
			return ResponseEntity.status(500).body("Authentication failed");
		}
	}

	@PostMapping("/register")
	@Transactional
	public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest signUpRequest) {
	    try {
	        logger.debug("Registration attempt for username: {}", signUpRequest.getUsername());
	        
	        // Check if username/email exists
	        if (userService.existsByUsername(signUpRequest.getUsername())) {
	            logger.warn("Username already exists: {}", signUpRequest.getUsername());
	            return ResponseEntity.badRequest().body("Username is already taken");
	        }
	        if (userService.existsByEmail(signUpRequest.getEmail())) {
	            logger.warn("Email already exists: {}", signUpRequest.getEmail());
	            return ResponseEntity.badRequest().body("Email is already in use");
	        }

	        // Create and save new user
	        User user = new User();
	        user.setUsername(signUpRequest.getUsername());
	        user.setEmail(signUpRequest.getEmail());
	        user.setPassword(encoder.encode(signUpRequest.getPassword()));
	        
	        logger.debug("Looking for ROLE_USER in database");
	        
	        // Set default role (ensure ROLE_USER exists in your database)
	        Role userRole = roleRepository.findByName(ERole.ROLE_USER)
	            .orElseThrow(() -> {
	                logger.error("ROLE_USER not found in database");
	                return new RuntimeException("Error: Role ROLE_USER not found in database");
	            });
	            
	        user.setRoles(Collections.singleton(userRole));

	        logger.debug("Saving user to database");
	        User savedUser = userService.save(user);
	        logger.info("User registered successfully: {}", savedUser.getUsername());
	        
	        return ResponseEntity.ok("User registered successfully");

	    } catch (Exception e) {
	        logger.error("Registration failed for user: {} - Error: {}", 
	                    signUpRequest.getUsername(), e.getMessage(), e);
	        return ResponseEntity.badRequest().body("Registration failed: " + e.getMessage());
	    }
	}
}