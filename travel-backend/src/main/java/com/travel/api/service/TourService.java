package com.travel.api.service;

import com.travel.api.model.Tour;
import com.travel.api.repository.TourRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TourService {

    private final TourRepository tourRepository;

    @Autowired
    public TourService(TourRepository tourRepository) {
        this.tourRepository = tourRepository;
    }

    public List<Tour> getAllTours() {
        return tourRepository.findAll();
    }

    public List<Tour> getAvailableTours() {
        return tourRepository.findByAvailableTrue();
    }
    

    public List<Tour> searchByDestination(String destination) {
        return tourRepository.findByDestinationContainingIgnoreCase(destination);
    }

    public List<Tour> getToursByType(String type) {
        return tourRepository.findByTourType(type);
    }

    public Tour getTourById(Long id) {
        return tourRepository.findById(id).orElse(null);
    }

    public Tour saveTour(Tour tour) {
        return tourRepository.save(tour);
    }

    public void deleteTour(Long id) {
        tourRepository.deleteById(id);
    }
}
 