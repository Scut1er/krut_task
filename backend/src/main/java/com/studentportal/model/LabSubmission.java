package com.studentportal.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "lab_submissions")
public class LabSubmission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "lab_template_id", nullable = false)
    private LabTemplate labTemplate;
    
    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private User student;
    
    @Column(nullable = false)
    private Integer points;
    
    @Column(columnDefinition = "TEXT")
    private String comment;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SubmissionStatus status;
    
    @Column(nullable = false)
    private LocalDateTime submittedAt;
    
    @Column
    private LocalDateTime gradedAt;
    
    @PrePersist
    protected void onCreate() {
        submittedAt = LocalDateTime.now();
        if (status == null) {
            status = SubmissionStatus.PENDING;
        }
    }
    
    public enum SubmissionStatus {
        PENDING,
        GRADED,
        REJECTED
    }

    public LabSubmission() {
    }

    public LabSubmission(Long id, LabTemplate labTemplate, User student, Integer points, String comment, SubmissionStatus status, LocalDateTime submittedAt, LocalDateTime gradedAt) {
        this.id = id;
        this.labTemplate = labTemplate;
        this.student = student;
        this.points = points;
        this.comment = comment;
        this.status = status;
        this.submittedAt = submittedAt;
        this.gradedAt = gradedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LabTemplate getLabTemplate() {
        return labTemplate;
    }

    public void setLabTemplate(LabTemplate labTemplate) {
        this.labTemplate = labTemplate;
    }

    public User getStudent() {
        return student;
    }

    public void setStudent(User student) {
        this.student = student;
    }

    public Integer getPoints() {
        return points;
    }

    public void setPoints(Integer points) {
        this.points = points;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public SubmissionStatus getStatus() {
        return status;
    }

    public void setStatus(SubmissionStatus status) {
        this.status = status;
    }

    public LocalDateTime getSubmittedAt() {
        return submittedAt;
    }

    public void setSubmittedAt(LocalDateTime submittedAt) {
        this.submittedAt = submittedAt;
    }

    public LocalDateTime getGradedAt() {
        return gradedAt;
    }

    public void setGradedAt(LocalDateTime gradedAt) {
        this.gradedAt = gradedAt;
    }
}
