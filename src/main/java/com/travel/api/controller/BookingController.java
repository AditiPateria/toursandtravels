package com.travel.api.controller;

import com.travel.api.dto.BookingRequest;
import com.travel.api.model.Booking;
import com.travel.api.service.BookingService;
import com.travel.api.exception.AuthenticationException;
import com.travel.api.exception.ResourceNotFoundException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/bookings")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Booking Management", description = "Endpoints for managing travel bookings")
@SecurityRequirement(name = "bearerAuth")
public class BookingController {

    private final BookingService bookingService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all bookings", 
               description = "Retrieve all bookings (Admin only)",
               responses = {
                   @ApiResponse(responseCode = "200", description = "Successfully retrieved bookings"),
                   @ApiResponse(responseCode = "403", description = "Forbidden - Admin access required")
               })
    public ResponseEntity<List<Booking>> getAllBookings() {
        log.info("Fetching all bookings");
        List<Booking> bookings = bookingService.getAllBookings();
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/my-bookings")
    @Operation(summary = "Get user's bookings",
               responses = {
                   @ApiResponse(responseCode = "200", description = "Successfully retrieved user's bookings"),
                   @ApiResponse(responseCode = "401", description = "Unauthorized - Authentication required")
               })
    public ResponseEntity<List<Booking>> getUserBookings(
            @AuthenticationPrincipal UserDetails userDetails) {
        validateUserDetails(userDetails);
        log.info("Fetching bookings for user: {}", userDetails.getUsername());
        List<Booking> bookings = bookingService.getBookingsForUser(userDetails.getUsername());
        return ResponseEntity.ok(bookings);
    }

    @PostMapping
    @Operation(summary = "Create a booking",
               responses = {
                   @ApiResponse(responseCode = "201", description = "Booking created successfully"),
                   @ApiResponse(responseCode = "400", description = "Invalid input"),
                   @ApiResponse(responseCode = "401", description = "Unauthorized - Authentication required")
               })
    public ResponseEntity<Booking> createBooking(
            @Valid @RequestBody BookingRequest bookingRequest,
            @AuthenticationPrincipal UserDetails userDetails) {
        validateUserDetails(userDetails);
        log.info("Creating booking for user: {} with request: {}", userDetails.getUsername(), bookingRequest);
        Booking booking = bookingService.createBooking(userDetails.getUsername(), bookingRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(booking);
    }

    @GetMapping("/{bookingId}")
    @Operation(summary = "Get booking details",
               responses = {
                   @ApiResponse(responseCode = "200", description = "Booking details retrieved"),
                   @ApiResponse(responseCode = "401", description = "Unauthorized - Authentication required"),
                   @ApiResponse(responseCode = "403", description = "Forbidden - Not your booking"),
                   @ApiResponse(responseCode = "404", description = "Booking not found")
               })
    public ResponseEntity<Booking> getBookingDetails(
            @PathVariable Long bookingId,
            @AuthenticationPrincipal UserDetails userDetails) {
        validateUserDetails(userDetails);
        log.info("Fetching booking details for ID: {} and user: {}", bookingId, userDetails.getUsername());
        try {
            Booking booking = bookingService.getBookingDetails(bookingId, userDetails.getUsername());
            return ResponseEntity.ok(booking);
        } catch (ResourceNotFoundException e) {
            log.error("Booking not found: {}", e.getMessage());
            throw e;
        } catch (IllegalStateException e) {
            log.error("Access denied: {}", e.getMessage());
            throw new AuthenticationException("Not authorized to access this booking");
        }
    }

    @DeleteMapping("/{bookingId}")
    @Operation(summary = "Cancel booking",
               responses = {
                   @ApiResponse(responseCode = "204", description = "Booking cancelled successfully"),
                   @ApiResponse(responseCode = "401", description = "Unauthorized - Authentication required"),
                   @ApiResponse(responseCode = "403", description = "Forbidden - Not your booking"),
                   @ApiResponse(responseCode = "404", description = "Booking not found")
               })
    public ResponseEntity<Void> cancelBooking(
            @PathVariable Long bookingId,
            @AuthenticationPrincipal UserDetails userDetails) {
        validateUserDetails(userDetails);
        log.info("Cancelling booking ID: {} for user: {}", bookingId, userDetails.getUsername());
        try {
            bookingService.cancelBooking(bookingId, userDetails.getUsername());
            return ResponseEntity.noContent().build();
        } catch (ResourceNotFoundException e) {
            log.error("Booking not found: {}", e.getMessage());
            throw e;
        } catch (IllegalStateException e) {
            log.error("Access denied or invalid state: {}", e.getMessage());
            throw new AuthenticationException("Not authorized to cancel this booking");
        }
    }

    private void validateUserDetails(UserDetails userDetails) {
        if (userDetails == null) {
            log.error("Attempt to access endpoint without authentication");
            throw new AuthenticationException("User not authenticated");
        }
    }
} 