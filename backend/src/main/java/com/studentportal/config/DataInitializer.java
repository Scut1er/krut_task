package com.studentportal.config;

import com.studentportal.model.*;
import com.studentportal.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private SubjectRepository subjectRepository;
    
    @Autowired
    private LabTemplateRepository labTemplateRepository;
    
    @Autowired
    private LabSubmissionRepository labSubmissionRepository;
    
    @Autowired
    private GradeRepository gradeRepository;
    
    @Autowired
    private AttendanceRepository attendanceRepository;
    
    @Autowired
    private AttestationRepository attestationRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private TeacherSubjectRepository teacherSubjectRepository;
    
    @Override
    public void run(String... args) throws Exception {
        // Fix existing lab submissions with invalid points
        fixInvalidLabSubmissions();
        
        if (userRepository.count() == 0) {
            System.out.println("🔄 Initializing database with test data...");
            
            // Create Users
            User admin = createUser("admin@example.com", "admin123", "Администратор", "Системы", User.Role.ADMIN, null, null);
            
            User teacher1 = createUser("teacher@example.com", "teacher123", "Иван", "Петров", User.Role.TEACHER, null, "Кафедра информатики");
            User teacher2 = createUser("teacher2@example.com", "teacher123", "Мария", "Иванова", User.Role.TEACHER, null, "Кафедра математики");
            User teacher3 = createUser("teacher3@example.com", "teacher123", "Дмитрий", "Смирнов", User.Role.TEACHER, null, "Кафедра физики");
            
            User student1 = createUser("student@example.com", "student123", "Анна", "Сидорова", User.Role.STUDENT, "БПИ-201", null);
            User student2 = createUser("student2@example.com", "student123", "Петр", "Козлов", User.Role.STUDENT, "БПИ-201", null);
            User student3 = createUser("student3@example.com", "student123", "Елена", "Морозова", User.Role.STUDENT, "БПИ-202", null);
            User student4 = createUser("student4@example.com", "student123", "Алексей", "Новиков", User.Role.STUDENT, "БПИ-202", null);
            
            List<User> students = List.of(student1, student2, student3, student4);
            
            // Create Subjects
            Subject programming = createSubject("Программирование", "Основы программирования на Java");
            Subject algorithms = createSubject("Алгоритмы и структуры данных", "Изучение основных алгоритмов и структур данных");
            Subject databases = createSubject("Базы данных", "Проектирование и разработка баз данных");
            Subject webdev = createSubject("Веб-разработка", "Разработка современных веб-приложений");
            
            // Subscribe teachers to subjects
            teacherSubjectRepository.save(new TeacherSubject(teacher1, programming));
            teacherSubjectRepository.save(new TeacherSubject(teacher1, webdev));
            teacherSubjectRepository.save(new TeacherSubject(teacher2, algorithms));
            teacherSubjectRepository.save(new TeacherSubject(teacher3, databases));
            
            // Create Lab Templates for Programming
            createLabTemplates(programming, List.of(
                new LabTemplateData("Лабораторная работа №1: Основы Java", "Знакомство с синтаксисом Java, переменные, типы данных", 10, 1),
                new LabTemplateData("Лабораторная работа №2: ООП в Java", "Классы, объекты, наследование, полиморфизм", 15, 2),
                new LabTemplateData("Лабораторная работа №3: Коллекции", "Работа с ArrayList, HashMap, Set", 15, 3),
                new LabTemplateData("Лабораторная работа №4: Обработка исключений", "Try-catch, создание собственных исключений", 10, 4),
                new LabTemplateData("Лабораторная работа №5: Многопоточность", "Threads, ExecutorService, синхронизация", 20, 5)
            ));
            
            // Create Lab Templates for Algorithms
            createLabTemplates(algorithms, List.of(
                new LabTemplateData("Лабораторная работа №1: Сортировки", "Реализация QuickSort, MergeSort, HeapSort", 15, 1),
                new LabTemplateData("Лабораторная работа №2: Поиск", "Бинарный поиск, поиск в глубину, в ширину", 15, 2),
                new LabTemplateData("Лабораторная работа №3: Графы", "Представление графов, обход графов", 20, 3),
                new LabTemplateData("Лабораторная работа №4: Динамическое программирование", "Задача о рюкзаке, LCS, Fibonacci", 20, 4)
            ));
            
            // Create Lab Templates for Databases
            createLabTemplates(databases, List.of(
                new LabTemplateData("Лабораторная работа №1: SQL основы", "SELECT, JOIN, GROUP BY, агрегатные функции", 10, 1),
                new LabTemplateData("Лабораторная работа №2: Проектирование БД", "ER-диаграммы, нормализация", 15, 2),
                new LabTemplateData("Лабораторная работа №3: Индексы и производительность", "Создание индексов, оптимизация запросов", 15, 3),
                new LabTemplateData("Лабораторная работа №4: Транзакции", "ACID, уровни изоляции", 15, 4),
                new LabTemplateData("Лабораторная работа №5: NoSQL", "MongoDB, Redis, сравнение с SQL", 15, 5)
            ));
            
            // Create Lab Templates for Web Development
            createLabTemplates(webdev, List.of(
                new LabTemplateData("Лабораторная работа №1: HTML/CSS", "Верстка страниц, Flexbox, Grid", 10, 1),
                new LabTemplateData("Лабораторная работа №2: JavaScript", "ES6+, DOM manipulation, Events", 15, 2),
                new LabTemplateData("Лабораторная работа №3: React", "Компоненты, хуки, состояние", 20, 3),
                new LabTemplateData("Лабораторная работа №4: Backend REST API", "Spring Boot, контроллеры, репозитории", 20, 4),
                new LabTemplateData("Лабораторная работа №5: Full-stack приложение", "Интеграция frontend и backend", 25, 5)
            ));
            
            // Create Lab Submissions for students
            List<LabTemplate> allLabTemplates = labTemplateRepository.findAll();
            for (User student : students) {
                createLabSubmissionsForStudent(student, allLabTemplates);
            }
            
            // Create Grades
            createGrades(student1, programming, 5, "Отличная работа");
            createGrades(student1, algorithms, 4, "Хорошо");
            createGrades(student2, programming, 4, "Хорошо справился");
            createGrades(student2, databases, 5, "Превосходно");
            createGrades(student3, webdev, 5, "Отличный проект");
            createGrades(student4, algorithms, 3, "Удовлетворительно");
            
            // Create Attendance
            LocalDate today = LocalDate.now();
            for (User student : students) {
                for (int i = 0; i < 20; i++) {
                    LocalDate date = today.minusDays(i);
                    Subject subject = i % 4 == 0 ? programming : i % 4 == 1 ? algorithms : i % 4 == 2 ? databases : webdev;
                    boolean present = Math.random() > 0.15; // 85% attendance
                    createAttendance(student, subject, date, present);
                }
            }
            
            // Create Attestations
            createAttestation(student1, programming, Attestation.AttestationType.FIRST, true, "Допущен");
            createAttestation(student1, programming, Attestation.AttestationType.SECOND, true, "Допущен");
            createAttestation(student1, algorithms, Attestation.AttestationType.FIRST, true, "Допущен");
            
            createAttestation(student2, programming, Attestation.AttestationType.FIRST, true, "Допущен");
            createAttestation(student2, databases, Attestation.AttestationType.FIRST, true, "Допущен");
            createAttestation(student2, databases, Attestation.AttestationType.SECOND, true, "Допущен");
            
            createAttestation(student3, webdev, Attestation.AttestationType.FIRST, true, "Допущен");
            createAttestation(student3, webdev, Attestation.AttestationType.SECOND, true, "Допущен");
            
            createAttestation(student4, algorithms, Attestation.AttestationType.FIRST, false, "Не хватает работ");
            
            System.out.println("\n✅ Database initialized successfully!");
            System.out.println("\n📝 Test Users:");
            System.out.println("  Admin: admin@example.com / admin123");
            System.out.println("  Teacher 1: teacher@example.com / teacher123 (Программирование, Веб-разработка)");
            System.out.println("  Teacher 2: teacher2@example.com / teacher123 (Алгоритмы)");
            System.out.println("  Teacher 3: teacher3@example.com / teacher123 (Базы данных)");
            System.out.println("  Student 1: student@example.com / student123");
            System.out.println("  Student 2: student2@example.com / student123");
            System.out.println("  Student 3: student3@example.com / student123");
            System.out.println("  Student 4: student4@example.com / student123");
            System.out.println("\n📚 Created:");
            System.out.println("  - 4 subjects");
            System.out.println("  - 19 lab templates");
            System.out.println("  - " + labSubmissionRepository.count() + " lab submissions");
            System.out.println("  - " + gradeRepository.count() + " grades");
            System.out.println("  - " + attendanceRepository.count() + " attendance records");
            System.out.println("  - " + attestationRepository.count() + " attestations");
        }
    }
    
    private User createUser(String email, String password, String firstName, String lastName, 
                           User.Role role, String studentGroup, String department) {
        User user = new User();
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setRole(role);
        user.setStudentGroup(studentGroup);
        user.setDepartment(department);
        return userRepository.save(user);
    }
    
    private Subject createSubject(String name, String description) {
        Subject subject = new Subject();
        subject.setName(name);
        subject.setDescription(description);
        return subjectRepository.save(subject);
    }
    
    private void createLabTemplates(Subject subject, List<LabTemplateData> templates) {
        for (LabTemplateData data : templates) {
            LabTemplate labTemplate = new LabTemplate();
            labTemplate.setTitle(data.title);
            labTemplate.setDescription(data.description);
            labTemplate.setSubject(subject);
            labTemplate.setMaxPoints(data.maxPoints);
            labTemplate.setOrderNumber(data.orderNumber);
            labTemplate.setCreatedAt(LocalDateTime.now());
            labTemplateRepository.save(labTemplate);
        }
    }
    
    private void createLabSubmissionsForStudent(User student, List<LabTemplate> templates) {
        // Student completes 60-80% of labs with varying grades
        int completedCount = (int) (templates.size() * (0.6 + Math.random() * 0.2));
        
        for (int i = 0; i < Math.min(completedCount, templates.size()); i++) {
            LabTemplate template = templates.get(i);
            LabSubmission submission = new LabSubmission();
            submission.setLabTemplate(template);
            submission.setStudent(student);
            
            // Random points (70-100% of max points), but not exceeding maxPoints
            int maxPoints = template.getMaxPoints();
            int points = (int) (maxPoints * (0.7 + Math.random() * 0.3));
            points = Math.min(points, maxPoints); // Ensure points don't exceed maxPoints
            
            submission.setPoints(points);
            submission.setStatus(LabSubmission.SubmissionStatus.GRADED);
            submission.setSubmittedAt(LocalDateTime.now().minusDays((long) (Math.random() * 30)));
            submission.setGradedAt(LocalDateTime.now().minusDays((long) (Math.random() * 20)));
            submission.setComment(points >= maxPoints * 0.9 ? "Отлично!" : 
                                 points >= maxPoints * 0.8 ? "Хорошо" : "Зачтено");
            
            labSubmissionRepository.save(submission);
        }
    }
    
    private void createGrades(User student, Subject subject, int value, String description) {
        Grade grade = new Grade();
        grade.setStudent(student);
        grade.setSubject(subject);
        grade.setValue(value);
        grade.setDescription(description);
        grade.setCreatedAt(LocalDateTime.now());
        gradeRepository.save(grade);
    }
    
    private void createAttendance(User student, Subject subject, LocalDate date, boolean present) {
        Attendance attendance = new Attendance();
        attendance.setStudent(student);
        attendance.setSubject(subject);
        attendance.setDate(date);
        attendance.setPresent(present);
        attendanceRepository.save(attendance);
    }
    
    private void createAttestation(User student, Subject subject, Attestation.AttestationType type, 
                                   boolean passed, String comment) {
        Attestation attestation = new Attestation();
        attestation.setStudent(student);
        attestation.setSubject(subject);
        attestation.setType(type);
        attestation.setPassed(passed);
        attestation.setComment(comment);
        attestation.setCreatedAt(LocalDateTime.now());
        attestationRepository.save(attestation);
    }
    
    private static class LabTemplateData {
        String title;
        String description;
        int maxPoints;
        int orderNumber;
        
        LabTemplateData(String title, String description, int maxPoints, int orderNumber) {
            this.title = title;
            this.description = description;
            this.maxPoints = maxPoints;
            this.orderNumber = orderNumber;
        }
    }
    
    private void fixInvalidLabSubmissions() {
        List<LabSubmission> allSubmissions = labSubmissionRepository.findAll();
        for (LabSubmission submission : allSubmissions) {
            if (submission.getPoints() > submission.getLabTemplate().getMaxPoints()) {
                System.out.println("⚠️  Fixing invalid points for submission ID " + submission.getId() + 
                    ": " + submission.getPoints() + " -> " + submission.getLabTemplate().getMaxPoints());
                submission.setPoints(submission.getLabTemplate().getMaxPoints());
                labSubmissionRepository.save(submission);
            }
        }
    }
}


