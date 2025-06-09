package com.travel.api.service;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;

import org.springframework.stereotype.Service;

import com.travel.api.dto.BookingRequest;
import com.travel.api.exception.ResourceNotFoundException;
import com.travel.api.model.Booking;
import com.travel.api.model.Booking.BookingStatus;
import com.travel.api.model.Tour;
import com.travel.api.model.User;
import com.travel.api.repository.BookingRepository;
import com.travel.api.repository.TourRepository;
import com.travel.api.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookingService {

    private final BookingRepository bookingRepository;
    private final TourRepository tourRepository;
    private final UserRepository userRepository;

    public List<Booking> getAllBookings() {
        log.info("Fetching all bookings");
        return bookingRepository.findAll();
    }

    public List<Booking> getBookingsForUser(String username) {
        log.info("Fetching bookings for user: {}", username);
        return userRepository.findByUsername(username)
                .map(bookingRepository::findByUserOrderByCreatedAtDesc)
                .orElse(Collections.emptyList());
    }

    @Transactional
    public Booking createBooking(String username, BookingRequest request) {
        log.info("Creating booking for user: {} and tour ID: {}", username, request.getTourId());
        
        // Validate and fetch user
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

        // Validate and fetch tour
        Tour tour = tourRepository.findById(request.getTourId())
                .orElseThrow(() -> new ResourceNotFoundException("Tour", "id", request.getTourId()));

        // Check tour availability
        if (!Boolean.TRUE.equals(tour.getAvailable())) {
            log.error("Tour {} is not available for booking", tour.getId());
            throw new IllegalStateException("Tour is not available for booking");
        }

        // Validate number of people
        if (request.getNumberOfPeople() == null || request.getNumberOfPeople() < 1) {
            log.error("Invalid number of people: {}", request.getNumberOfPeople());
            throw new IllegalArgumentException("Number of people must be at least 1");
        }

        // Calculate total price
        BigDecimal totalPrice = tour.getPrice().multiply(BigDecimal.valueOf(request.getNumberOfPeople()));

        // Create and save booking
        Booking booking = Booking.builder()
                .user(user)
                .tour(tour)
                .bookingDate(request.getBookingDate())
                .numberOfPeople(request.getNumberOfPeople())
                .specialRequirements(request.getSpecialRequirements())
                .totalPrice(totalPrice)
                .status(BookingStatus.PENDING)
                .build();

        log.info("Saving new booking for user: {} and tour: {}", user.getId(), tour.getId());
        return bookingRepository.save(booking);
    }

    public Booking getBookingDetails(Long bookingId, String username) {
        log.info("Fetching booking details for ID: {} and user: {}", bookingId, username);
        
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", bookingId));

        // Security check - ensure the booking belongs to the requesting user
        if (!booking.getUser().getUsername().equals(username)) {
            log.error("User {} attempted to access booking {} which belongs to user {}", 
                    username, bookingId, booking.getUser().getUsername());
            throw new IllegalStateException("Not authorized to view this booking");
        }

        return booking;
    }

    @Transactional
    public void cancelBooking(Long bookingId, String username) {
        log.info("Attempting to cancel booking ID: {} for user: {}", bookingId, username);
        
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", bookingId));

        // Security check - ensure the booking belongs to the requesting user
        if (!booking.getUser().getUsername().equals(username)) {
            log.error("User {} attempted to cancel booking {} which belongs to user {}", 
                    username, bookingId, booking.getUser().getUsername());
            throw new IllegalStateException("Not authorized to cancel this booking");
        }

        // Check if booking can be cancelled
        if (BookingStatus.CANCELLED.equals(booking.getStatus())) {
            log.error("Booking {} is already cancelled", bookingId);
            throw new IllegalStateException("Booking is already cancelled");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        bookingRepository.save(booking);
        log.info("Successfully cancelled booking ID: {}", bookingId);
    }

    // Additional utility methods
    public List<Booking> getTourBookings(Long tourId) {
        log.info("Fetching bookings for tour ID: {}", tourId);
        Tour tour = tourRepository.findById(tourId)
                .orElseThrow(() -> new ResourceNotFoundException("Tour", "id", tourId));
        return bookingRepository.findByTourId(tourId);
    }

    public BigDecimal calculateTourRevenue(Long tourId) {
        log.info("Calculating revenue for tour ID: {}", tourId);
        Tour tour = tourRepository.findById(tourId)
                .orElseThrow(() -> new ResourceNotFoundException("Tour", "id", tourId));
        List<Booking> confirmedBookings = bookingRepository.findByTourIdAndStatus(tourId, BookingStatus.CONFIRMED);
        return confirmedBookings.stream()
                .map(Booking::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}