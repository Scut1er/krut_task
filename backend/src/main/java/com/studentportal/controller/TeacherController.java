package com.studentportal.controller;

import com.studentportal.model.*;
import com.studentportal.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teacher")
@CrossOrigin(origins = "*")
@PreAuthorize("hasAuthority('ROLE_TEACHER')")
public class TeacherController {
    
    @Autowired
    private GradeRepository gradeRepository;
    
    @Autowired
    private AttendanceRepository attendanceRepository;
    
    @Autowired
    private AttestationRepository attestationRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private SubjectRepository subjectRepository;
    
    @Autowired
    private LabTemplateRepository labTemplateRepository;
    
    @Autowired
    private LabSubmissionRepository labSubmissionRepository;
    
    @Autowired
    private TeacherSubjectRepository teacherSubjectRepository;
    
    @GetMapping("/students")
    public ResponseEntity<List<User>> getAllStudents() {
        List<User> students = userRepository.findByRole(User.Role.STUDENT);
        return ResponseEntity.ok(students);
    }
    
    @PostMapping("/grades")
    @PreAuthorize("hasAuthority('ROLE_TEACHER')")
    public ResponseEntity<Grade> addGrade(@RequestBody Grade grade) {
        Grade savedGrade = gradeRepository.save(grade);
        return ResponseEntity.ok(savedGrade);
    }
    
    @PutMapping("/grades/{id}")
    @PreAuthorize("hasAuthority('ROLE_TEACHER')")
    public ResponseEntity<Grade> updateGrade(@PathVariable Long id, @RequestBody Grade grade) {
        Grade existing = gradeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Grade not found"));
        
        // Update only the fields that can be changed
        if (grade.getValue() != null) {
            existing.setValue(grade.getValue());
        }
        if (grade.getDescription() != null) {
            existing.setDescription(grade.getDescription());
        }
        // Update student and subject if provided
        if (grade.getStudent() != null && grade.getStudent().getId() != null) {
            User student = userRepository.findById(grade.getStudent().getId())
                    .orElseThrow(() -> new RuntimeException("Student not found"));
            existing.setStudent(student);
        }
        if (grade.getSubject() != null && grade.getSubject().getId() != null) {
            Subject subject = subjectRepository.findById(grade.getSubject().getId())
                    .orElseThrow(() -> new RuntimeException("Subject not found"));
            existing.setSubject(subject);
        }
        
        Grade updatedGrade = gradeRepository.save(existing);
        return ResponseEntity.ok(updatedGrade);
    }
    
    @DeleteMapping("/grades/{id}")
    public ResponseEntity<?> deleteGrade(@PathVariable Long id) {
        gradeRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/grades/subject/{subjectId}")
    public ResponseEntity<List<Grade>> getGradesBySubject(@PathVariable Long subjectId) {
        return ResponseEntity.ok(gradeRepository.findBySubject_Id(subjectId));
    }
    
    // Subject Subscription Management
    @PostMapping("/subjects/{subjectId}/subscribe")
    public ResponseEntity<?> subscribeToSubject(@PathVariable Long subjectId, @RequestParam Long teacherId) {
        User teacher = userRepository.findById(teacherId)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));
        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new RuntimeException("Subject not found"));
        
        if (teacherSubjectRepository.findByTeacherIdAndSubjectId(teacherId, subjectId).isEmpty()) {
            TeacherSubject teacherSubject = new TeacherSubject(teacher, subject);
            teacherSubjectRepository.save(teacherSubject);
        }
        return ResponseEntity.ok().build();
    }
    
    @DeleteMapping("/subjects/{subjectId}/unsubscribe")
    @Transactional
    public ResponseEntity<?> unsubscribeFromSubject(@PathVariable Long subjectId, @RequestParam Long teacherId) {
        teacherSubjectRepository.deleteByTeacherIdAndSubjectId(teacherId, subjectId);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/subjects/my")
    public ResponseEntity<?> getMySubjects(@RequestParam Long teacherId) {
        List<Subject> subjects = teacherSubjectRepository.findSubjectsByTeacherId(teacherId);
        return ResponseEntity.ok(subjects);
    }
    
    // Lab Templates Management
    @PostMapping("/lab-templates")
    public ResponseEntity<LabTemplate> createLabTemplate(@RequestBody LabTemplate labTemplate) {
        LabTemplate savedLabTemplate = labTemplateRepository.save(labTemplate);
        return ResponseEntity.ok(savedLabTemplate);
    }
    
    @GetMapping("/lab-templates/subject/{subjectId}")
    public ResponseEntity<List<LabTemplate>> getLabTemplatesBySubject(@PathVariable Long subjectId) {
        return ResponseEntity.ok(labTemplateRepository.findBySubject_IdOrderByOrderNumberAsc(subjectId));
    }
    
    @PutMapping("/lab-templates/{id}")
    public ResponseEntity<LabTemplate> updateLabTemplate(@PathVariable Long id, @RequestBody LabTemplate labTemplate) {
        labTemplate.setId(id);
        LabTemplate updatedLabTemplate = labTemplateRepository.save(labTemplate);
        return ResponseEntity.ok(updatedLabTemplate);
    }
    
    @DeleteMapping("/lab-templates/{id}")
    public ResponseEntity<?> deleteLabTemplate(@PathVariable Long id) {
        labTemplateRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
    
    // Lab Submissions Grading
    @GetMapping("/lab-submissions/subject/{subjectId}")
    public ResponseEntity<List<LabSubmission>> getLabSubmissionsBySubject(@PathVariable Long subjectId) {
        return ResponseEntity.ok(labSubmissionRepository.findAll().stream()
                .filter(sub -> sub.getLabTemplate().getSubject().getId().equals(subjectId))
                .toList());
    }
    
    @PostMapping("/lab-submissions")
    @PreAuthorize("hasAuthority('ROLE_TEACHER')")
    public ResponseEntity<?> createLabSubmission(@RequestBody LabSubmission labSubmission) {
        // Load lab template from database to get maxPoints
        if (labSubmission.getLabTemplate() == null || labSubmission.getLabTemplate().getId() == null) {
            return ResponseEntity.badRequest().body("Лабораторная работа не указана");
        }
        
        LabTemplate labTemplate = labTemplateRepository.findById(labSubmission.getLabTemplate().getId())
                .orElseThrow(() -> new RuntimeException("Lab template not found"));
        
        // Validate points
        if (labTemplate.getMaxPoints() == null) {
            return ResponseEntity.badRequest().body("Максимальные баллы не установлены для лабораторной работы");
        }
        
        if (labSubmission.getPoints() > labTemplate.getMaxPoints()) {
            return ResponseEntity.badRequest().body("Баллы не могут превышать максимальные баллы лабораторной работы (" + 
                labTemplate.getMaxPoints() + ")");
        }
        if (labSubmission.getPoints() < 0) {
            return ResponseEntity.badRequest().body("Баллы не могут быть отрицательными");
        }
        
        // Set the loaded lab template
        labSubmission.setLabTemplate(labTemplate);
        
        LabSubmission savedLabSubmission = labSubmissionRepository.save(labSubmission);
        return ResponseEntity.ok(savedLabSubmission);
    }
    
    @PutMapping("/lab-submissions/{id}")
    public ResponseEntity<?> gradeLabSubmission(@PathVariable Long id, @RequestBody LabSubmission labSubmission) {
        LabSubmission existing = labSubmissionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lab submission not found"));
        
        // Validate points
        Integer maxPoints = existing.getLabTemplate().getMaxPoints();
        if (labSubmission.getPoints() > maxPoints) {
            return ResponseEntity.badRequest().body("Баллы не могут превышать максимальные баллы лабораторной работы (" + maxPoints + ")");
        }
        if (labSubmission.getPoints() < 0) {
            return ResponseEntity.badRequest().body("Баллы не могут быть отрицательными");
        }
        
        existing.setPoints(labSubmission.getPoints());
        existing.setComment(labSubmission.getComment());
        existing.setStatus(labSubmission.getStatus());
        existing.setGradedAt(java.time.LocalDateTime.now());
        
        LabSubmission updatedLabSubmission = labSubmissionRepository.save(existing);
        return ResponseEntity.ok(updatedLabSubmission);
    }
    
    @DeleteMapping("/lab-submissions/{id}")
    public ResponseEntity<?> deleteLabSubmission(@PathVariable Long id) {
        labSubmissionRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/attendance/subject/{subjectId}")
    public ResponseEntity<List<Attendance>> getAttendanceBySubject(@PathVariable Long subjectId) {
        return ResponseEntity.ok(attendanceRepository.findBySubject_Id(subjectId));
    }
    
    @PostMapping("/attendance")
    public ResponseEntity<Attendance> addAttendance(@RequestBody Attendance attendance) {
        Attendance savedAttendance = attendanceRepository.save(attendance);
        return ResponseEntity.ok(savedAttendance);
    }
    
    @PutMapping("/attendance/{id}")
    public ResponseEntity<Attendance> updateAttendance(@PathVariable Long id, @RequestBody Attendance attendance) {
        attendance.setId(id);
        Attendance updatedAttendance = attendanceRepository.save(attendance);
        return ResponseEntity.ok(updatedAttendance);
    }
    
    @DeleteMapping("/attendance/{id}")
    public ResponseEntity<?> deleteAttendance(@PathVariable Long id) {
        attendanceRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/attestations/subject/{subjectId}")
    public ResponseEntity<List<Attestation>> getAttestationsBySubject(@PathVariable Long subjectId) {
        return ResponseEntity.ok(attestationRepository.findBySubject_Id(subjectId));
    }
    
    @PostMapping("/attestations")
    public ResponseEntity<Attestation> addAttestation(@RequestBody Attestation attestation) {
        Attestation savedAttestation = attestationRepository.save(attestation);
        return ResponseEntity.ok(savedAttestation);
    }
    
    @PutMapping("/attestations/{id}")
    @PreAuthorize("hasAuthority('ROLE_TEACHER')")
    public ResponseEntity<Attestation> updateAttestation(@PathVariable Long id, @RequestBody Attestation attestation) {
        Attestation existing = attestationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Attestation not found"));
        
        // Update only the fields that can be changed
        if (attestation.getType() != null) {
            existing.setType(attestation.getType());
        }
        if (attestation.getPassed() != null) {
            existing.setPassed(attestation.getPassed());
        }
        if (attestation.getComment() != null) {
            existing.setComment(attestation.getComment());
        }
        // Update student and subject if provided
        if (attestation.getStudent() != null && attestation.getStudent().getId() != null) {
            User student = userRepository.findById(attestation.getStudent().getId())
                    .orElseThrow(() -> new RuntimeException("Student not found"));
            existing.setStudent(student);
        }
        if (attestation.getSubject() != null && attestation.getSubject().getId() != null) {
            Subject subject = subjectRepository.findById(attestation.getSubject().getId())
                    .orElseThrow(() -> new RuntimeException("Subject not found"));
            existing.setSubject(subject);
        }
        
        Attestation updatedAttestation = attestationRepository.save(existing);
        return ResponseEntity.ok(updatedAttestation);
    }
    
    @DeleteMapping("/attestations/{id}")
    public ResponseEntity<?> deleteAttestation(@PathVariable Long id) {
        attestationRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/subjects")
    public ResponseEntity<List<Subject>> getAllSubjects() {
        return ResponseEntity.ok(subjectRepository.findAll());
    }
}






