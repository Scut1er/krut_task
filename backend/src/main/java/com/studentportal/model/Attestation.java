package com.studentportal.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "attestations")
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

    public Attestation() {
    }

    public Attestation(Long id, User student, Subject subject, AttestationType type, Boolean passed, String comment, LocalDateTime createdAt) {
        this.id = id;
        this.student = student;
        this.subject = subject;
        this.type = type;
        this.passed = passed;
        this.comment = comment;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getStudent() {
        return student;
    }

    public void setStudent(User student) {
        this.student = student;
    }

    public Subject getSubject() {
        return subject;
    }

    public void setSubject(Subject subject) {
        this.subject = subject;
    }

    public AttestationType getType() {
        return type;
    }

    public void setType(AttestationType type) {
        this.type = type;
    }

    public Boolean getPassed() {
        return passed;
    }

    public void setPassed(Boolean passed) {
        this.passed = passed;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
