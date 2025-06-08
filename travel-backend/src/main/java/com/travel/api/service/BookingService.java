package com.travel.api.service;

import com.travel.api.dto.BookingRequest;
import com.travel.api.exception.ResourceNotFoundException;
import com.travel.api.model.Booking;
import com.travel.api.model.Tour;
import com.travel.api.model.User;
import com.travel.api.repository.BookingRepository;
import com.travel.api.repository.TourRepository;
import com.travel.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {
    
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final TourRepository tourRepository;

    public List<Booking> getBookingsForUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return bookingRepository.findByUserOrderByCreatedAtDesc(user);
    }

    @Transactional
    public Booking createBooking(String username, BookingRequest bookingRequest) {
        // Get user
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Get tour
        Tour tour = tourRepository.findById(bookingRequest.getTourId())
                .orElseThrow(() -> new ResourceNotFoundException("Tour", "id", bookingRequest.getTourId()));

        // Create and save booking
        Booking booking = Booking.builder()
                .user(user)
                .tour(tour)
                .bookingDate(bookingRequest.getBookingDate())
                .numberOfPeople(bookingRequest.getNumberOfPeople())
                .specialRequirements(bookingRequest.getSpecialRequirements())
                .build();

        return bookingRepository.save(booking);
    }

    @Transactional
    public void cancelBooking(String username, Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", bookingId));

        if (!booking.getUser().getUsername().equals(username)) {
            throw new IllegalStateException("Not authorized to cancel this booking");
        }

        bookingRepository.delete(booking);
    }

    public Booking getBookingById(Long bookingId) {
        return bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", bookingId));
    }

    public List<Booking> getBookingsForTour(Long tourId) {
        return bookingRepository.findByTourId(tourId);
    }
} 