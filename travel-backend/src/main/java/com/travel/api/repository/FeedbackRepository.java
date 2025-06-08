package com.travel.api.repository;

import com.travel.api.model.Feedback;
import com.travel.api.model.Tour;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    List<Feedback> findByTourOrderByCreatedAtDesc(Tour tour);
    boolean existsByTourIdAndUserId(Long tourId, Long userId);
} 