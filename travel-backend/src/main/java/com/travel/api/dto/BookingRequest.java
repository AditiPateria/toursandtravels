package com.travel.api.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BookingRequest {
    @NotNull(message = "Tour ID is required")
    private Long tourId;

    @NotNull(message = "Booking date is required")
    private LocalDate bookingDate;

    @NotNull(message = "Number of people is required")
    @Min(value = 1, message = "Number of people must be at least 1")
    private Integer numberOfPeople;

    private String specialRequirements;
}