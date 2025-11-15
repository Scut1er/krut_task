package com.studentportal.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "attestations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Attestation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private User student;
    
    @ManyToOne
    @JoinColumn(name = "subject_id", nullable = false)
    private Subject subject;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AttestationType type;
    
    @Column(nullable = false)
    private Boolean passed;
    
    @Column
    private String comment;
    
    @Column(nullable = false)
    private LocalDateTime createdAt;
    
    public enum AttestationType {
        FIRST,
        SECOND,
        FINAL
    }
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}






