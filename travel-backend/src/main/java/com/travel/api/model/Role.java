package com.travel.api.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(
    name = "roles",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = "name") // ✅ Enforces one entry per role
    }
)
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    private ERole name;

    public Role(ERole name) {
        this.name = name;
    }
}
