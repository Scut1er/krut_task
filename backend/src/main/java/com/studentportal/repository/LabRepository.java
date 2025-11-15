package com.studentportal.repository;

import com.studentportal.model.Lab;
import com.studentportal.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LabRepository extends JpaRepository<Lab, Long> {
    List<Lab> findByStudent(User student);
    List<Lab> findByStudentId(Long studentId);
}






