package com.travel.api.repository;

import com.travel.api.model.Tour;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TourRepository extends JpaRepository<Tour, Long> {
    // Use explicit @Query to avoid naming convention issues
    @Query("SELECT t FROM Tour t WHERE t.available = true")
    List<Tour> findByAvailableTrue();
    
    List<Tour> findByDestinationContainingIgnoreCase(String destination);
    List<Tour> findByTourType(String tourType);
}