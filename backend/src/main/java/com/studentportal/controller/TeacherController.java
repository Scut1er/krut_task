package com.studentportal.controller;

import com.studentportal.model.*;
import com.studentportal.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teacher")
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('TEACHER')")
public class TeacherController {
    
    @Autowired
    private GradeRepository gradeRepository;
    
    @Autowired
    private LabRepository labRepository;
    
    @Autowired
    private AttendanceRepository attendanceRepository;
    
    @Autowired
    private AttestationRepository attestationRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private SubjectRepository subjectRepository;
    
    @GetMapping("/students")
    public ResponseEntity<List<User>> getAllStudents() {
        List<User> students = userRepository.findByRole(User.Role.STUDENT);
        return ResponseEntity.ok(students);
    }
    
    @PostMapping("/grades")
    public ResponseEntity<Grade> addGrade(@RequestBody Grade grade) {
        Grade savedGrade = gradeRepository.save(grade);
        return ResponseEntity.ok(savedGrade);
    }
    
    @PutMapping("/grades/{id}")
    public ResponseEntity<Grade> updateGrade(@PathVariable Long id, @RequestBody Grade grade) {
        grade.setId(id);
        Grade updatedGrade = gradeRepository.save(grade);
        return ResponseEntity.ok(updatedGrade);
    }
    
    @DeleteMapping("/grades/{id}")
    public ResponseEntity<?> deleteGrade(@PathVariable Long id) {
        gradeRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
    
    @PostMapping("/labs")
    public ResponseEntity<Lab> addLab(@RequestBody Lab lab) {
        Lab savedLab = labRepository.save(lab);
        return ResponseEntity.ok(savedLab);
    }
    
    @PutMapping("/labs/{id}")
    public ResponseEntity<Lab> updateLab(@PathVariable Long id, @RequestBody Lab lab) {
        lab.setId(id);
        Lab updatedLab = labRepository.save(lab);
        return ResponseEntity.ok(updatedLab);
    }
    
    @DeleteMapping("/labs/{id}")
    public ResponseEntity<?> deleteLab(@PathVariable Long id) {
        labRepository.deleteById(id);
        return ResponseEntity.ok().build();
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
    
    @PostMapping("/attestations")
    public ResponseEntity<Attestation> addAttestation(@RequestBody Attestation attestation) {
        Attestation savedAttestation = attestationRepository.save(attestation);
        return ResponseEntity.ok(savedAttestation);
    }
    
    @PutMapping("/attestations/{id}")
    public ResponseEntity<Attestation> updateAttestation(@PathVariable Long id, @RequestBody Attestation attestation) {
        attestation.setId(id);
        Attestation updatedAttestation = attestationRepository.save(attestation);
        return ResponseEntity.ok(updatedAttestation);
    }
    
    @DeleteMapping("/attestations/{id}")
    public ResponseEntity<?> deleteAttestation(@PathVariable Long id) {
        attestationRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
    
    @PostMapping("/subjects")
    public ResponseEntity<Subject> addSubject(@RequestBody Subject subject) {
        Subject savedSubject = subjectRepository.save(subject);
        return ResponseEntity.ok(savedSubject);
    }
    
    @GetMapping("/subjects")
    public ResponseEntity<List<Subject>> getAllSubjects() {
        return ResponseEntity.ok(subjectRepository.findAll());
    }
}






