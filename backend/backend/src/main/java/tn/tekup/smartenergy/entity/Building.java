package tn.tekup.smartenergy.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity @Table(name = "buildings")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Building {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(nullable = false) private String nom;
    @Column(nullable = false) private String type;
    @Column(nullable = false) private double surface;
    private String adresse;
    private String ville;
    @Enumerated(EnumType.STRING) @Column(nullable = false) private BuildingStatus status;
    @Column(name = "created_at", nullable = false) private LocalDateTime createdAt;
    @PrePersist void onCreate() { if (createdAt == null) createdAt = LocalDateTime.now(); }
}
