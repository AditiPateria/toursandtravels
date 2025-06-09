package com.travel.api.controller;

import com.travel.api.dto.BookingRequest;
import com.travel.api.model.Booking;
import com.travel.api.service.BookingService;
import com.travel.api.exception.ResourceNotFoundException;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import io.swagger.annotations.Authorization;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/bookings")
@RequiredArgsConstructor
@Slf4j
@Api(tags = "Booking Management", description = "Endpoints for managing travel bookings", authorizations = {
    @Authorization(value = "bearerAuth")
})
public class BookingController {

    private final BookingService bookingService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @ApiOperation(value = "Get all bookings", 
               notes = "Retrieve all bookings (Admin only)",
               authorizations = { @Authorization(value = "bearerAuth") })
    @ApiResponses({
        @ApiResponse(code = 200, message = "Successfully retrieved bookings"),
        @ApiResponse(code = 403, message = "Forbidden - Admin access required")
    })
    public ResponseEntity<List<Booking>> getAllBookings() {
        log.info("Fetching all bookings");
        List<Booking> bookings = bookingService.getAllBookings();
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/my-bookings")
    @ApiOperation(value = "Get user's bookings",
               authorizations = { @Authorization(value = "bearerAuth") })
    @ApiResponses({
        @ApiResponse(code = 200, message = "Successfully retrieved user's bookings"),
        @ApiResponse(code = 401, message = "Unauthorized - Authentication required")
    })
    public ResponseEntity<List<Booking>> getUserBookings(
            @AuthenticationPrincipal UserDetails userDetails) {
        validateUserDetails(userDetails);
        log.info("Fetching bookings for user: {}", userDetails.getUsername());
        List<Booking> bookings = bookingService.getBookingsForUser(userDetails.getUsername());
        return ResponseEntity.ok(bookings);
    }

    @PostMapping
    @ApiOperation(value = "Create a booking",
               authorizations = { @Authorization(value = "bearerAuth") })
    @ApiResponses({
        @ApiResponse(code = 201, message = "Booking created successfully"),
        @ApiResponse(code = 400, message = "Invalid input"),
        @ApiResponse(code = 401, message = "Unauthorized - Authentication required")
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
    @ApiOperation(value = "Get booking details",
               authorizations = { @Authorization(value = "bearerAuth") })
    @ApiResponses({
        @ApiResponse(code = 200, message = "Booking details retrieved"),
        @ApiResponse(code = 401, message = "Unauthorized - Authentication required"),
        @ApiResponse(code = 403, message = "Forbidden - Not your booking"),
        @ApiResponse(code = 404, message = "Booking not found")
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
            log.error("Booking not found: {}", e.getMessage(), e);
            throw e;
        } catch (IllegalStateException e) {
            log.error("Access denied: {}", e.getMessage(), e);
            throw new AccessDeniedException("Not authorized to access this booking");
        }
    }

    @DeleteMapping("/{bookingId}")
    @ApiOperation(value = "Cancel booking",
               authorizations = { @Authorization(value = "bearerAuth") })
    @ApiResponses({
        @ApiResponse(code = 204, message = "Booking cancelled successfully"),
        @ApiResponse(code = 401, message = "Unauthorized - Authentication required"),
        @ApiResponse(code = 403, message = "Forbidden - Not your booking"),
        @ApiResponse(code = 404, message = "Booking not found")
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
            log.error("Booking not found: {}", e.getMessage(), e);
            throw e;
        } catch (IllegalStateException e) {
            log.error("Access denied or invalid state: {}", e.getMessage(), e);
            throw new AccessDeniedException("Not authorized to cancel this booking");
        }
    }

    private void validateUserDetails(UserDetails userDetails) {
        if (userDetails == null) {
            log.error("Attempt to access endpoint without authentication");
            throw new AccessDeniedException("User not authenticated");
        }
    }
}