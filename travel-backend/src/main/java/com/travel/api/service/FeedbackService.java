package com.travel.api.service;

import com.travel.api.model.Feedback;
import com.travel.api.model.Tour;
import com.travel.api.model.User;
import com.travel.api.repository.FeedbackRepository;
import com.travel.api.repository.TourRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final TourRepository tourRepository;

    public List<Feedback> getTourFeedbacks(Long tourId) {
        Tour tour = tourRepository.findById(tourId)
                .orElseThrow(() -> new RuntimeException("Tour not found with id: " + tourId));
        return feedbackRepository.findByTourOrderByCreatedAtDesc(tour);
    }

    @Transactional
    public Feedback createFeedback(User user, Long tourId, Integer rating, String comment) {
        Tour tour = tourRepository.findById(tourId)
                .orElseThrow(() -> new RuntimeException("Tour not found with id: " + tourId));

        if (feedbackRepository.existsByTourIdAndUserId(tourId, user.getId())) {
            throw new RuntimeException("You have already provided feedback for this tour");
        }

        if (rating < 1 || rating > 5) {
            throw new RuntimeException("Rating must be between 1 and 5");
        }

        Feedback feedback = Feedback.builder()
                .user(user)
                .tour(tour)
                .rating(rating)
                .comment(comment)
                .build();

        return feedbackRepository.save(feedback);
    }

    @Transactional
    public void deleteFeedback(Long feedbackId) {
        if (!feedbackRepository.existsById(feedbackId)) {
            throw new RuntimeException("Feedback not found with id: " + feedbackId);
        }
        feedbackRepository.deleteById(feedbackId);
    }
} 