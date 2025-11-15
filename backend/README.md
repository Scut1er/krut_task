# Student Portal Backend

Spring Boot REST API для системы управления студентами.

## Требования

- Java 17+
- Maven 3.8+
- PostgreSQL 15+

## Запуск

```bash
mvn spring-boot:run
```

API будет доступен на http://localhost:8080

## Конфигурация

Настройки в `src/main/resources/application.yml`

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/student_portal
    username: admin
    password: admin123
```

## База данных

При первом запуске автоматически создаются таблицы и тестовые пользователи:
- teacher@example.com / teacher123
- student@example.com / student123

## API Endpoints

### Auth
- POST `/api/auth/login` - Вход
- POST `/api/auth/register` - Регистрация

### Student
- GET `/api/student/{id}/grades`
- GET `/api/student/{id}/labs`
- GET `/api/student/{id}/attendance`
- GET `/api/student/{id}/attestations`
- GET `/api/student/{id}/dashboard`
- GET `/api/student/teachers`

### Teacher
- GET `/api/teacher/students`
- POST `/api/teacher/grades`
- POST `/api/teacher/labs`
- POST `/api/teacher/attendance`
- POST `/api/teacher/attestations`
- POST `/api/teacher/subjects`

## Безопасность

- JWT токены для аутентификации
- BCrypt для паролей
- CORS настроен для frontend

## Архитектура

```
com.studentportal/
├── controller/      # REST контроллеры
├── model/          # JPA Entity модели
├── repository/     # Spring Data репозитории
├── service/        # Бизнес логика
├── security/       # JWT & Security конфигурация
├── dto/            # Data Transfer Objects
└── config/         # Конфигурация и инициализация
```






