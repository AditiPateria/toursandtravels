package com.travel.api.repository;

import com.travel.api.model.Booking;
import com.travel.api.model.Booking.BookingStatus;
import com.travel.api.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    // For BookingService.getUserBookings()
    List<Booking> findByUserOrderByCreatedAtDesc(User user);
    
    // For BookingService.getTourBookings() 
    List<Booking> findByTourId(Long tourId);
    
    // For BookingService.calculateTourRevenue()
    List<Booking> findByTourIdAndStatus(Long tourId, BookingStatus status);
    
    // Additional method needed for security checks in controller
    List<Booking> findByUserId(Long userId);
}