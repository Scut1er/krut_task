package com.studentportal.repository;

import com.studentportal.model.Subject;
import com.studentportal.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, Long> {
    List<Subject> findByTeacher(User teacher);
}






