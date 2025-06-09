package com.travel.api.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Entity
@Table(name = "tours")
public class Tour {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String destination;
    
    @Column(name = "tour_type")
    private String tourType;

    @Column(length = 1000)
    private String description;
    private BigDecimal price;

    @Column(name = "duration_days")
    private Integer durationDays;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "is_available")
    private Boolean available;

    // Remove these manual getter/setter as they conflict with @Data
    // Lombok's @Data already generates proper getters/setters

    // getter and setter
    public Boolean getAvailable() {
        return getAvailable();
    }

    public void setAvailable(Boolean available) {
        Boolean isAvailable = available;
    }
    
  
}

