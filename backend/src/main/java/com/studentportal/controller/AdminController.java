package com.studentportal.controller;

import com.studentportal.model.*;
import com.studentportal.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private GradeRepository gradeRepository;
    
    @Autowired
    private LabRepository labRepository;
    
    @Autowired
    private AttendanceRepository attendanceRepository;
    
    @Autowired
    private AttestationRepository attestationRepository;
    
    @Autowired
    private SubjectRepository subjectRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    // Users Management
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }
    
    @PostMapping("/users")
    public ResponseEntity<User> createUser(@RequestBody User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        User savedUser = userRepository.save(user);
        return ResponseEntity.ok(savedUser);
    }
    
    @PutMapping("/users/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User user) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        existingUser.setFirstName(user.getFirstName());
        existingUser.setLastName(user.getLastName());
        existingUser.setEmail(user.getEmail());
        existingUser.setRole(user.getRole());
        existingUser.setStudentGroup(user.getStudentGroup());
        existingUser.setDepartment(user.getDepartment());
        
        if (user.getPassword() != null && !user.getPassword().isEmpty()) {
            existingUser.setPassword(passwordEncoder.encode(user.getPassword()));
        }
        
        User updatedUser = userRepository.save(existingUser);
        return ResponseEntity.ok(updatedUser);
    }
    
    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
    
    // Subjects Management
    @GetMapping("/subjects")
    public ResponseEntity<List<Subject>> getAllSubjects() {
        return ResponseEntity.ok(subjectRepository.findAll());
    }
    
    @PostMapping("/subjects")
    public ResponseEntity<Subject> createSubject(@RequestBody Subject subject) {
        Subject savedSubject = subjectRepository.save(subject);
        return ResponseEntity.ok(savedSubject);
    }
    
    @PutMapping("/subjects/{id}")
    public ResponseEntity<Subject> updateSubject(@PathVariable Long id, @RequestBody Subject subject) {
        subject.setId(id);
        Subject updatedSubject = subjectRepository.save(subject);
        return ResponseEntity.ok(updatedSubject);
    }
    
    @DeleteMapping("/subjects/{id}")
    public ResponseEntity<?> deleteSubject(@PathVariable Long id) {
        subjectRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
    
    // Grades Management
    @GetMapping("/grades")
    public ResponseEntity<List<Grade>> getAllGrades() {
        return ResponseEntity.ok(gradeRepository.findAll());
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
    
    // Labs Management
    @GetMapping("/labs")
    public ResponseEntity<List<Lab>> getAllLabs() {
        return ResponseEntity.ok(labRepository.findAll());
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
    
    // Attendance Management
    @GetMapping("/attendance")
    public ResponseEntity<List<Attendance>> getAllAttendance() {
        return ResponseEntity.ok(attendanceRepository.findAll());
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
    
    // Attestations Management
    @GetMapping("/attestations")
    public ResponseEntity<List<Attestation>> getAllAttestations() {
        return ResponseEntity.ok(attestationRepository.findAll());
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
}





