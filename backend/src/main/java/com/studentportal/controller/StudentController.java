package com.studentportal.controller;

import com.studentportal.model.*;
import com.studentportal.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/student")
@CrossOrigin(origins = "*")
public class StudentController {
    
    @Autowired
    private GradeRepository gradeRepository;
    
    @Autowired
    private LabSubmissionRepository labSubmissionRepository;
    
    @Autowired
    private LabTemplateRepository labTemplateRepository;
    
    @Autowired
    private AttendanceRepository attendanceRepository;
    
    @Autowired
    private AttestationRepository attestationRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private SubjectRepository subjectRepository;
    
    @GetMapping("/{studentId}/grades")
    @PreAuthorize("hasAnyRole('STUDENT', 'TEACHER')")
    public ResponseEntity<List<Grade>> getGrades(@PathVariable Long studentId) {
        List<Grade> grades = gradeRepository.findByStudentId(studentId);
        return ResponseEntity.ok(grades);
    }
    
    @GetMapping("/{studentId}/labs")
    @PreAuthorize("hasAnyRole('STUDENT', 'TEACHER')")
    public ResponseEntity<List<LabSubmission>> getLabs(@PathVariable Long studentId) {
        List<LabSubmission> labs = labSubmissionRepository.findByStudentId(studentId);
        return ResponseEntity.ok(labs);
    }
    
    @GetMapping("/{studentId}/lab-templates")
    @PreAuthorize("hasAnyRole('STUDENT', 'TEACHER')")
    public ResponseEntity<List<LabTemplate>> getLabTemplates(@PathVariable Long studentId) {
        return ResponseEntity.ok(labTemplateRepository.findAll());
    }
    
    @GetMapping("/{studentId}/lab-templates/subject/{subjectId}")
    @PreAuthorize("hasAnyRole('STUDENT', 'TEACHER')")
    public ResponseEntity<List<LabTemplate>> getLabTemplatesBySubject(@PathVariable Long studentId, @PathVariable Long subjectId) {
        return ResponseEntity.ok(labTemplateRepository.findBySubject_IdOrderByOrderNumberAsc(subjectId));
    }
    
    @GetMapping("/{studentId}/attendance")
    @PreAuthorize("hasAnyRole('STUDENT', 'TEACHER')")
    public ResponseEntity<List<Attendance>> getAttendance(@PathVariable Long studentId) {
        List<Attendance> attendance = attendanceRepository.findByStudentId(studentId);
        return ResponseEntity.ok(attendance);
    }
    
    @GetMapping("/{studentId}/attestations")
    @PreAuthorize("hasAnyRole('STUDENT', 'TEACHER')")
    public ResponseEntity<List<Attestation>> getAttestations(@PathVariable Long studentId) {
        List<Attestation> attestations = attestationRepository.findByStudentId(studentId);
        return ResponseEntity.ok(attestations);
    }
    
    @GetMapping("/teachers")
    @PreAuthorize("hasAnyRole('STUDENT', 'TEACHER')")
    public ResponseEntity<List<User>> getTeachers() {
        List<User> teachers = userRepository.findByRole(User.Role.TEACHER);
        return ResponseEntity.ok(teachers);
    }
    
    @GetMapping("/{studentId}/dashboard")
    @PreAuthorize("hasAnyRole('STUDENT', 'TEACHER')")
    public ResponseEntity<Map<String, Object>> getDashboard(@PathVariable Long studentId) {
        Map<String, Object> dashboard = new HashMap<>();
        
        List<Grade> grades = gradeRepository.findByStudentId(studentId);
        List<LabSubmission> labs = labSubmissionRepository.findByStudentId(studentId);
        List<Attendance> attendance = attendanceRepository.findByStudentId(studentId);
        List<Attestation> attestations = attestationRepository.findByStudentId(studentId);
        
        // Calculate stats
        double averageGrade = grades.stream()
                .mapToInt(Grade::getValue)
                .average()
                .orElse(0.0);
        
        int completedLabs = labs.size();
        int totalLabTemplates = labTemplateRepository.findAll().size();
        int earnedPoints = labs.stream()
                .mapToInt(LabSubmission::getPoints)
                .sum();
        int maxPossiblePoints = labTemplateRepository.findAll().stream()
                .mapToInt(LabTemplate::getMaxPoints)
                .sum();
        
        long totalClasses = attendance.size();
        long attendedClasses = attendance.stream()
                .filter(Attendance::getPresent)
                .count();
        
        double attendanceRate = totalClasses > 0 ? (attendedClasses * 100.0 / totalClasses) : 0.0;
        
        dashboard.put("averageGrade", averageGrade);
        dashboard.put("completedLabs", completedLabs);
        dashboard.put("totalLabs", totalLabTemplates);
        dashboard.put("earnedPoints", earnedPoints);
        dashboard.put("maxPossiblePoints", maxPossiblePoints);
        dashboard.put("attendanceRate", attendanceRate);
        dashboard.put("attestations", attestations);
        dashboard.put("recentGrades", grades.stream().limit(5).toList());
        
        return ResponseEntity.ok(dashboard);
    }
    
    @GetMapping("/subjects")
    @PreAuthorize("hasAnyRole('STUDENT', 'TEACHER')")
    public ResponseEntity<List<Subject>> getAllSubjects() {
        return ResponseEntity.ok(subjectRepository.findAll());
    }
}






