package com.studentportal.repository;

import com.studentportal.model.Attestation;
import com.studentportal.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AttestationRepository extends JpaRepository<Attestation, Long> {
    List<Attestation> findByStudent(User student);
    List<Attestation> findByStudentId(Long studentId);
    List<Attestation> findBySubject_Id(Long subjectId);
}






