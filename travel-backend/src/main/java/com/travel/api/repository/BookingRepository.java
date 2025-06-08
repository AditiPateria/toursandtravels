package com.travel.api.repository;

import com.travel.api.model.Booking;
import com.travel.api.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUserOrderByCreatedAtDesc(User user);
    List<Booking> findByTourId(Long tourId);
} 