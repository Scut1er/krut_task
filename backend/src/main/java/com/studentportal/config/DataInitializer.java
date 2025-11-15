package com.studentportal.config;

import com.studentportal.model.User;
import com.studentportal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            // Create admin
            User admin = new User();
            admin.setEmail("admin@example.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setFirstName("Администратор");
            admin.setLastName("Системы");
            admin.setRole(User.Role.ADMIN);
            userRepository.save(admin);
            
            // Create teacher
            User teacher = new User();
            teacher.setEmail("teacher@example.com");
            teacher.setPassword(passwordEncoder.encode("teacher123"));
            teacher.setFirstName("Иван");
            teacher.setLastName("Петров");
            teacher.setRole(User.Role.TEACHER);
            teacher.setDepartment("Кафедра информатики");
            userRepository.save(teacher);
            
            // Create student
            User student = new User();
            student.setEmail("student@example.com");
            student.setPassword(passwordEncoder.encode("student123"));
            student.setFirstName("Анна");
            student.setLastName("Сидорова");
            student.setRole(User.Role.STUDENT);
            student.setStudentGroup("БПИ-201");
            userRepository.save(student);
            
            System.out.println("✓ Initialized test users:");
            System.out.println("  Admin: admin@example.com / admin123");
            System.out.println("  Teacher: teacher@example.com / teacher123");
            System.out.println("  Student: student@example.com / student123");
        }
    }
}


