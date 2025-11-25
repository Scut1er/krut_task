package com.studentportal.repository;

import com.studentportal.model.LabSubmission;
import com.studentportal.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LabSubmissionRepository extends JpaRepository<LabSubmission, Long> {
    List<LabSubmission> findByStudent(User student);
    List<LabSubmission> findByStudentId(Long studentId);
    List<LabSubmission> findByLabTemplate_Subject_IdAndStudentId(Long subjectId, Long studentId);
}

