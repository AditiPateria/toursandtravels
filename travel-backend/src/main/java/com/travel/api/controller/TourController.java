package com.travel.api.controller;

import com.travel.api.model.Tour;
import com.travel.api.service.TourService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tours")
@CrossOrigin(origins = "*")
public class TourController {

    private final TourService tourService;

    @Autowired
    public TourController(TourService tourService) {
        this.tourService = tourService;
    }

    @GetMapping
    public List<Tour> getAllTours() {
        return tourService.getAllTours();
    }

    @GetMapping("/available")
    public List<Tour> getAvailableTours() {
        return tourService.getAvailableTours();
    }

    @GetMapping("/search")
    public List<Tour> searchByDestination(@RequestParam String destination) {
        return tourService.searchByDestination(destination);
    }

    @GetMapping("/{id}")
    public Tour getTourById(@PathVariable Long id) {
        return tourService.getTourById(id);
    }

    @PostMapping
    public Tour createTour(@RequestBody Tour tour) {
        return tourService.saveTour(tour);
    }

    @DeleteMapping("/{id}")
    public void deleteTour(@PathVariable Long id) {
        tourService.deleteTour(id);
    }
}
 