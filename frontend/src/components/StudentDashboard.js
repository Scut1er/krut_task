import React, { useState, useEffect } from 'react';
import { studentAPI } from '../services/api';

function StudentDashboard({ user, onLogout }) {
  const [dashboard, setDashboard] = useState(null);
  const [grades, setGrades] = useState([]);
  const [labs, setLabs] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [attestations, setAttestations] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [dashboardRes, gradesRes, labsRes, attendanceRes, attestationsRes, teachersRes] =
        await Promise.all([
          studentAPI.getDashboard(user.userId),
          studentAPI.getGrades(user.userId),
          studentAPI.getLabs(user.userId),
          studentAPI.getAttendance(user.userId),
          studentAPI.getAttestations(user.userId),
          studentAPI.getTeachers(),
        ]);

      setDashboard(dashboardRes.data);
      setGrades(gradesRes.data);
      setLabs(labsRes.data);
      setAttendance(attendanceRes.data);
      setAttestations(attestationsRes.data);
      setTeachers(teachersRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Загрузка данных...</div>;
  }

  return (
    <div className="dashboard">
      <div className="container">
        <nav className="navbar">
          <div className="navbar-brand">🎓 Student Portal</div>
          <div className="navbar-user">
            <div className="user-info">
              <div className="user-name">
                {user.firstName} {user.lastName}
              </div>
              <div className="user-role">Студент</div>
            </div>
            <button onClick={onLogout} className="btn-logout">
              Выход
            </button>
          </div>
        </nav>

        {/* Statistics */}
        <div className="grid grid-4">
          <div className="card stat-card">
            <div className="stat-label">Средний балл</div>
            <div className="stat-value">{dashboard?.averageGrade?.toFixed(1) || '0'}</div>
          </div>
          <div className="card stat-card">
            <div className="stat-label">Лабораторных</div>
            <div className="stat-value">{dashboard?.totalLabs || 0}</div>
          </div>
          <div className="card stat-card">
            <div className="stat-label">Баллов за лабы</div>
            <div className="stat-value">{dashboard?.totalPoints || 0}</div>
          </div>
          <div className="card stat-card">
            <div className="stat-label">Посещаемость</div>
            <div className="stat-value">{dashboard?.attendanceRate?.toFixed(0) || 0}%</div>
          </div>
        </div>

        {/* Attestations */}
        <div className="card">
          <div className="card-header">
            <span className="card-icon" style={{ background: '#dbeafe' }}>
              📋
            </span>
            Аттестации
          </div>
          {attestations.length > 0 ? (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Предмет</th>
                    <th>Тип</th>
                    <th>Статус</th>
                    <th>Комментарий</th>
                  </tr>
                </thead>
                <tbody>
                  {attestations.map((att) => (
                    <tr key={att.id}>
                      <td>{att.subject?.name || 'N/A'}</td>
                      <td>
                        <span className="badge badge-info">
                          {att.type === 'FIRST'
                            ? 'Первая'
                            : att.type === 'SECOND'
                            ? 'Вторая'
                            : 'Финальная'}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            att.passed ? 'badge-success' : 'badge-danger'
                          }`}
                        >
                          {att.passed ? 'Зачтено' : 'Не зачтено'}
                        </span>
                      </td>
                      <td>{att.comment || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">📋</div>
              <div className="empty-state-text">Нет аттестаций</div>
            </div>
          )}
        </div>

        {/* Grades and Labs */}
        <div className="grid grid-2">
          {/* Grades */}
          <div className="card">
            <div className="card-header">
              <span className="card-icon" style={{ background: '#fef3c7' }}>
                🎯
              </span>
              Оценки
            </div>
            {grades.length > 0 ? (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Предмет</th>
                      <th>Оценка</th>
                      <th>Описание</th>
                    </tr>
                  </thead>
                  <tbody>
                    {grades.map((grade) => (
                      <tr key={grade.id}>
                        <td>{grade.subject?.name || 'N/A'}</td>
                        <td>
                          <strong style={{ fontSize: '18px', color: 'var(--primary)' }}>
                            {grade.value}
                          </strong>
                        </td>
                        <td>{grade.description || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon">🎯</div>
                <div className="empty-state-text">Нет оценок</div>
              </div>
            )}
          </div>

          {/* Labs */}
          <div className="card">
            <div className="card-header">
              <span className="card-icon" style={{ background: '#d1fae5' }}>
                🧪
              </span>
              Лабораторные работы
            </div>
            {labs.length > 0 ? (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Название</th>
                      <th>Баллы</th>
                      <th>Предмет</th>
                    </tr>
                  </thead>
                  <tbody>
                    {labs.map((lab) => (
                      <tr key={lab.id}>
                        <td>{lab.title}</td>
                        <td>
                          <span className="badge badge-success">+{lab.points}</span>
                        </td>
                        <td>{lab.subject?.name || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon">🧪</div>
                <div className="empty-state-text">Нет лабораторных</div>
              </div>
            )}
          </div>
        </div>

        {/* Attendance and Teachers */}
        <div className="grid grid-2">
          {/* Attendance */}
          <div className="card">
            <div className="card-header">
              <span className="card-icon" style={{ background: '#fee2e2' }}>
                📅
              </span>
              Посещаемость
            </div>
            {attendance.length > 0 ? (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Дата</th>
                      <th>Предмет</th>
                      <th>Статус</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendance.slice(0, 10).map((att) => (
                      <tr key={att.id}>
                        <td>{att.date}</td>
                        <td>{att.subject?.name || 'N/A'}</td>
                        <td>
                          <span
                            className={`badge ${
                              att.present ? 'badge-success' : 'badge-danger'
                            }`}
                          >
                            {att.present ? 'Присутствовал' : 'Отсутствовал'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon">📅</div>
                <div className="empty-state-text">Нет записей о посещаемости</div>
              </div>
            )}
          </div>

          {/* Teachers */}
          <div className="card">
            <div className="card-header">
              <span className="card-icon" style={{ background: '#e0e7ff' }}>
                👨‍🏫
              </span>
              Преподаватели
            </div>
            {teachers.length > 0 ? (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>ФИО</th>
                      <th>Кафедра</th>
                      <th>Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teachers.map((teacher) => (
                      <tr key={teacher.id}>
                        <td>
                          {teacher.firstName} {teacher.lastName}
                        </td>
                        <td>{teacher.department || '-'}</td>
                        <td>{teacher.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon">👨‍🏫</div>
                <div className="empty-state-text">Нет преподавателей</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;





