package com.studentportal.repository;

import com.studentportal.model.LabTemplate;
import com.studentportal.model.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LabTemplateRepository extends JpaRepository<LabTemplate, Long> {
    List<LabTemplate> findBySubjectOrderByOrderNumberAsc(Subject subject);
    List<LabTemplate> findBySubject_IdOrderByOrderNumberAsc(Long subjectId);
}

