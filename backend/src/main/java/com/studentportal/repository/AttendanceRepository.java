package com.studentportal.repository;

import com.studentportal.model.Attendance;
import com.studentportal.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    List<Attendance> findByStudent(User student);
    List<Attendance> findByStudentId(Long studentId);
}






