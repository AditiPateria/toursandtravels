package com.travel.api.controller;

import com.travel.api.dto.FeedbackRequest;
import com.travel.api.model.Feedback;
import com.travel.api.model.User;
import com.travel.api.repository.UserRepository;
import com.travel.api.service.FeedbackService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/feedbacks")
@CrossOrigin(origins = "*", maxAge = 3600)
@RequiredArgsConstructor
public class FeedbackController {

    private final FeedbackService feedbackService;
    private final UserRepository userRepository;

    @GetMapping("/tour/{tourId}")
    public ResponseEntity<List<Feedback>> getTourFeedbacks(@PathVariable Long tourId) {
        return ResponseEntity.ok(feedbackService.getTourFeedbacks(tourId));
    }

    @PostMapping("/tour/{tourId}")
    public ResponseEntity<?> createFeedback(
            @PathVariable Long tourId,
            @Valid @RequestBody FeedbackRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Feedback feedback = feedbackService.createFeedback(
                user,
                tourId,
                request.getRating(),
                request.getComment()
        );
        return ResponseEntity.ok(feedback);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFeedback(@PathVariable Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        feedbackService.deleteFeedback(id);
        return ResponseEntity.ok().build();
    }
} 