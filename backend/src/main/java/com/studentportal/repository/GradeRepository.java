package com.studentportal.repository;

import com.studentportal.model.Grade;
import com.studentportal.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GradeRepository extends JpaRepository<Grade, Long> {
    List<Grade> findByStudent(User student);
    List<Grade> findByStudentId(Long studentId);
    List<Grade> findBySubject_Id(Long subjectId);
}






