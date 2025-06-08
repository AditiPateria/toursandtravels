package com.travel.api.repository;

import com.travel.api.model.Tour;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TourRepository extends JpaRepository<Tour, Long> {
    List<Tour> findByIsAvailableTrue();
    List<Tour> findByDestinationContainingIgnoreCase(String destination);
    List<Tour> findByType(String type);
} 