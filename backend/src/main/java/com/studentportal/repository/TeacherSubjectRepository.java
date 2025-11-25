package com.studentportal.repository;

import com.studentportal.model.TeacherSubject;
import com.studentportal.model.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TeacherSubjectRepository extends JpaRepository<TeacherSubject, Long> {
    List<TeacherSubject> findByTeacherId(Long teacherId);
    List<TeacherSubject> findBySubjectId(Long subjectId);
    Optional<TeacherSubject> findByTeacherIdAndSubjectId(Long teacherId, Long subjectId);
    void deleteByTeacherIdAndSubjectId(Long teacherId, Long subjectId);
    
    @Query("SELECT ts.subject FROM TeacherSubject ts WHERE ts.teacher.id = :teacherId")
    List<Subject> findSubjectsByTeacherId(Long teacherId);
}

