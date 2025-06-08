package com.travel.api.controller;

import com.travel.api.dto.BookingRequest;
import com.travel.api.model.Booking;
import com.travel.api.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*", maxAge = 3600)
@RequiredArgsConstructor
public class BookingController {
    
    private final BookingService bookingService;

    @GetMapping("/my-bookings")
    public ResponseEntity<List<Booking>> getMyBookings(Authentication authentication) {
        try {
            List<Booking> bookings = bookingService.getBookingsForUser(authentication.getName());
            return ResponseEntity.ok(bookings);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping
    public ResponseEntity<?> createBooking(
            @Valid @RequestBody BookingRequest bookingRequest,
            Authentication authentication) {
        try {
            Booking booking = bookingService.createBooking(
                    authentication.getName(),
                    bookingRequest
            );
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancelBooking(
            @PathVariable Long id,
            Authentication authentication) {
        try {
            bookingService.cancelBooking(authentication.getName(), id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Booking> getBooking(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(bookingService.getBookingById(id));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
} 