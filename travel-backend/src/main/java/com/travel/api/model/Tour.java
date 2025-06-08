package com.travel.api.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "tours")
@EntityListeners(AuditingEntityListener.class)
public class Tour {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(nullable = false)
    private String destination;
    
    @Column(nullable = false)
    private Integer duration; // in days
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;
    
    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;
    
    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;
    
    @Column(name = "available_slots", nullable = false)
    private Integer availableSlots;
    
    @Column(name = "image_url", length = 255)
    private String imageUrl;
    
    @Column(nullable = false)
    private Integer maxGroupSize;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TourType type;
    
    @Column(nullable = false)
    private Boolean isAvailable = true;
    
    @OneToMany(mappedBy = "tour", cascade = CascadeType.ALL)
    private List<Booking> bookings = new ArrayList<>();
    
    @CreatedDate
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
} 