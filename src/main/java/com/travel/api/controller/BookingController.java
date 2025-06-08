package com.travel.api.controller;

import com.travel.api.model.Booking;
import com.travel.api.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/bookings")
@CrossOrigin(origins = "http://localhost:3000")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @GetMapping
    public ResponseEntity<List<Booking>> getUserBookings(@RequestParam Integer userId) {
        return ResponseEntity.ok(bookingService.getUserBookings(userId));
    }

    @PostMapping
    public ResponseEntity<Booking> createBooking(
            @RequestParam Integer userId,
            @RequestParam Integer tourId,
            @RequestParam Integer travelersCount) {
        try {
            Booking booking = bookingService.createBooking(userId, tourId, travelersCount);
            return ResponseEntity.ok(booking);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<Booking> cancelBooking(@PathVariable Integer id) {
        try {
            Booking booking = bookingService.cancelBooking(id);
            return ResponseEntity.ok(booking);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
} 