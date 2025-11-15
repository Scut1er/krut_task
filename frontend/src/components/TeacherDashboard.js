import React, { useState, useEffect } from 'react';
import { teacherAPI, studentAPI } from '../services/api';

function TeacherDashboard({ user, onLogout }) {
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [activeTab, setActiveTab] = useState('grades');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [studentsRes, subjectsRes] = await Promise.all([
        teacherAPI.getStudents(),
        teacherAPI.getSubjects(),
      ]);
      setStudents(studentsRes.data);
      setSubjects(subjectsRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (type) => {
    setModalType(type);
    setFormData({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalType === 'grade') {
        await teacherAPI.addGrade({
          student: { id: parseInt(formData.studentId) },
          subject: { id: parseInt(formData.subjectId) },
          value: parseInt(formData.value),
          description: formData.description,
        });
      } else if (modalType === 'lab') {
        await teacherAPI.addLab({
          student: { id: parseInt(formData.studentId) },
          subject: { id: parseInt(formData.subjectId) },
          title: formData.title,
          points: parseInt(formData.points),
          comment: formData.comment,
        });
      } else if (modalType === 'attendance') {
        await teacherAPI.addAttendance({
          student: { id: parseInt(formData.studentId) },
          subject: { id: parseInt(formData.subjectId) },
          date: formData.date,
          present: formData.present === 'true',
          note: formData.note,
        });
      } else if (modalType === 'attestation') {
        await teacherAPI.addAttestation({
          student: { id: parseInt(formData.studentId) },
          subject: { id: parseInt(formData.subjectId) },
          type: formData.type,
          passed: formData.passed === 'true',
          comment: formData.comment,
        });
      } else if (modalType === 'subject') {
        await teacherAPI.addSubject({
          name: formData.name,
          description: formData.description,
          teacher: { id: user.userId },
        });
      }
      closeModal();
      loadData();
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Ошибка при сохранении данных');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
              <div className="user-role">Преподаватель</div>
            </div>
            <button onClick={onLogout} className="btn-logout">
              Выход
            </button>
          </div>
        </nav>

        {/* Statistics */}
        <div className="grid grid-4">
          <div className="card stat-card">
            <div className="stat-label">Студентов</div>
            <div className="stat-value">{students.length}</div>
          </div>
          <div className="card stat-card">
            <div className="stat-label">Предметов</div>
            <div className="stat-value">{subjects.length}</div>
          </div>
          <div className="card stat-card">
            <div className="stat-label">Активных курсов</div>
            <div className="stat-value">{subjects.length}</div>
          </div>
          <div className="card stat-card">
            <div className="stat-label">Всего записей</div>
            <div className="stat-value">-</div>
          </div>
        </div>

        {/* Action Tabs */}
        <div className="card">
          <div className="tabs">
            <button
              className={`tab ${activeTab === 'grades' ? 'active' : ''}`}
              onClick={() => setActiveTab('grades')}
            >
              🎯 Оценки
            </button>
            <button
              className={`tab ${activeTab === 'labs' ? 'active' : ''}`}
              onClick={() => setActiveTab('labs')}
            >
              🧪 Лабораторные
            </button>
            <button
              className={`tab ${activeTab === 'attendance' ? 'active' : ''}`}
              onClick={() => setActiveTab('attendance')}
            >
              📅 Посещаемость
            </button>
            <button
              className={`tab ${activeTab === 'attestations' ? 'active' : ''}`}
              onClick={() => setActiveTab('attestations')}
            >
              📋 Аттестации
            </button>
            <button
              className={`tab ${activeTab === 'subjects' ? 'active' : ''}`}
              onClick={() => setActiveTab('subjects')}
            >
              📚 Предметы
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'grades' && (
              <div>
                <button className="btn btn-primary" onClick={() => openModal('grade')}>
                  + Добавить оценку
                </button>
                <p style={{ marginTop: '20px', color: '#64748b' }}>
                  Нажмите кнопку выше, чтобы выставить оценку студенту
                </p>
              </div>
            )}

            {activeTab === 'labs' && (
              <div>
                <button className="btn btn-primary" onClick={() => openModal('lab')}>
                  + Добавить лабораторную
                </button>
                <p style={{ marginTop: '20px', color: '#64748b' }}>
                  Нажмите кнопку выше, чтобы добавить баллы за лабораторную работу
                </p>
              </div>
            )}

            {activeTab === 'attendance' && (
              <div>
                <button className="btn btn-primary" onClick={() => openModal('attendance')}>
                  + Отметить посещение
                </button>
                <p style={{ marginTop: '20px', color: '#64748b' }}>
                  Нажмите кнопку выше, чтобы отметить посещение занятия
                </p>
              </div>
            )}

            {activeTab === 'attestations' && (
              <div>
                <button className="btn btn-primary" onClick={() => openModal('attestation')}>
                  + Добавить аттестацию
                </button>
                <p style={{ marginTop: '20px', color: '#64748b' }}>
                  Нажмите кнопку выше, чтобы проставить аттестацию
                </p>
              </div>
            )}

            {activeTab === 'subjects' && (
              <div>
                <button className="btn btn-primary" onClick={() => openModal('subject')}>
                  + Добавить предмет
                </button>
                {subjects.length > 0 && (
                  <div className="table-container" style={{ marginTop: '20px' }}>
                    <table>
                      <thead>
                        <tr>
                          <th>Название</th>
                          <th>Описание</th>
                          <th>Преподаватель</th>
                        </tr>
                      </thead>
                      <tbody>
                        {subjects.map((subject) => (
                          <tr key={subject.id}>
                            <td>{subject.name}</td>
                            <td>{subject.description || '-'}</td>
                            <td>
                              {subject.teacher
                                ? `${subject.teacher.firstName} ${subject.teacher.lastName}`
                                : '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Students List */}
        <div className="card">
          <div className="card-header">
            <span className="card-icon" style={{ background: '#e0e7ff' }}>
              👨‍🎓
            </span>
            Список студентов
          </div>
          {students.length > 0 ? (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>ФИО</th>
                    <th>Email</th>
                    <th>Группа</th>
                    <th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id}>
                      <td>
                        {student.firstName} {student.lastName}
                      </td>
                      <td>{student.email}</td>
                      <td>{student.studentGroup || '-'}</td>
                      <td>
                        <button className="btn btn-sm btn-primary">
                          Просмотр данных
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">👨‍🎓</div>
              <div className="empty-state-text">Нет студентов</div>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              {modalType === 'grade' && 'Добавить оценку'}
              {modalType === 'lab' && 'Добавить лабораторную работу'}
              {modalType === 'attendance' && 'Отметить посещение'}
              {modalType === 'attestation' && 'Добавить аттестацию'}
              {modalType === 'subject' && 'Добавить предмет'}
            </div>

            <form onSubmit={handleSubmit}>
              {modalType !== 'subject' && (
                <>
                  <div className="form-group">
                    <label className="form-label">Студент</label>
                    <select
                      name="studentId"
                      className="form-select"
                      required
                      onChange={handleChange}
                    >
                      <option value="">Выберите студента</option>
                      {students.map((student) => (
                        <option key={student.id} value={student.id}>
                          {student.firstName} {student.lastName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Предмет</label>
                    <select
                      name="subjectId"
                      className="form-select"
                      required
                      onChange={handleChange}
                    >
                      <option value="">Выберите предмет</option>
                      {subjects.map((subject) => (
                        <option key={subject.id} value={subject.id}>
                          {subject.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              {modalType === 'grade' && (
                <>
                  <div className="form-group">
                    <label className="form-label">Оценка</label>
                    <input
                      type="number"
                      name="value"
                      className="form-control"
                      min="2"
                      max="5"
                      required
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Описание</label>
                    <input
                      type="text"
                      name="description"
                      className="form-control"
                      onChange={handleChange}
                    />
                  </div>
                </>
              )}

              {modalType === 'lab' && (
                <>
                  <div className="form-group">
                    <label className="form-label">Название</label>
                    <input
                      type="text"
                      name="title"
                      className="form-control"
                      required
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Баллы</label>
                    <input
                      type="number"
                      name="points"
                      className="form-control"
                      min="0"
                      required
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Комментарий</label>
                    <input
                      type="text"
                      name="comment"
                      className="form-control"
                      onChange={handleChange}
                    />
                  </div>
                </>
              )}

              {modalType === 'attendance' && (
                <>
                  <div className="form-group">
                    <label className="form-label">Дата</label>
                    <input
                      type="date"
                      name="date"
                      className="form-control"
                      required
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Присутствие</label>
                    <select name="present" className="form-select" required onChange={handleChange}>
                      <option value="">Выберите</option>
                      <option value="true">Присутствовал</option>
                      <option value="false">Отсутствовал</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Примечание</label>
                    <input
                      type="text"
                      name="note"
                      className="form-control"
                      onChange={handleChange}
                    />
                  </div>
                </>
              )}

              {modalType === 'attestation' && (
                <>
                  <div className="form-group">
                    <label className="form-label">Тип аттестации</label>
                    <select name="type" className="form-select" required onChange={handleChange}>
                      <option value="">Выберите тип</option>
                      <option value="FIRST">Первая</option>
                      <option value="SECOND">Вторая</option>
                      <option value="FINAL">Финальная</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Статус</label>
                    <select name="passed" className="form-select" required onChange={handleChange}>
                      <option value="">Выберите статус</option>
                      <option value="true">Зачтено</option>
                      <option value="false">Не зачтено</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Комментарий</label>
                    <input
                      type="text"
                      name="comment"
                      className="form-control"
                      onChange={handleChange}
                    />
                  </div>
                </>
              )}

              {modalType === 'subject' && (
                <>
                  <div className="form-group">
                    <label className="form-label">Название предмета</label>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      required
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Описание</label>
                    <input
                      type="text"
                      name="description"
                      className="form-control"
                      onChange={handleChange}
                    />
                  </div>
                </>
              )}

              <div className="modal-footer">
                <button type="button" className="btn" onClick={closeModal}>
                  Отмена
                </button>
                <button type="submit" className="btn btn-primary">
                  Сохранить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .tabs {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .tab {
          padding: 12px 20px;
          background: #f8fafc;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s;
          color: #64748b;
        }

        .tab:hover {
          background: #f1f5f9;
          border-color: #cbd5e1;
        }

        .tab.active {
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          color: white;
          border-color: transparent;
        }

        .tab-content {
          padding: 20px 0;
        }
      `}</style>
    </div>
  );
}

export default TeacherDashboard;






