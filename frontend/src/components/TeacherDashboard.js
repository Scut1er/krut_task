import React, { useState, useEffect } from 'react';
import { teacherAPI, studentAPI } from '../services/api';

function TeacherDashboard({ user, onLogout }) {
  const [students, setStudents] = useState([]);
  const [allSubjects, setAllSubjects] = useState([]);
  const [mySubjects, setMySubjects] = useState([]);
  const [activeTab, setActiveTab] = useState('subjects');
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [labTemplates, setLabTemplates] = useState([]);
  const [labSubmissions, setLabSubmissions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedSubject && activeTab === 'labs') {
      loadLabTemplates();
    }
    if (selectedSubject && activeTab === 'submissions') {
      loadLabSubmissions();
    }
  }, [selectedSubject, activeTab]);

  const loadData = async () => {
    try {
      const [studentsRes, subjectsRes, mySubjectsRes] = await Promise.all([
        teacherAPI.getStudents(),
        teacherAPI.getSubjects(),
        teacherAPI.getMySubjects(user.userId),
      ]);
      setStudents(studentsRes.data);
      setAllSubjects(subjectsRes.data);
      setMySubjects(mySubjectsRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadLabTemplates = async () => {
    if (!selectedSubject) return;
    try {
      const res = await teacherAPI.getLabTemplatesBySubject(selectedSubject.id);
      setLabTemplates(res.data);
    } catch (error) {
      console.error('Error loading lab templates:', error);
    }
  };

  const loadLabSubmissions = async () => {
    if (!selectedSubject) return;
    try {
      const res = await teacherAPI.getLabSubmissionsBySubject(selectedSubject.id);
      setLabSubmissions(res.data);
    } catch (error) {
      console.error('Error loading lab submissions:', error);
    }
  };

  const handleSubscribe = async (subjectId) => {
    try {
      await teacherAPI.subscribeToSubject(subjectId, user.userId);
      loadData();
    } catch (error) {
      console.error('Error subscribing:', error);
      alert('Ошибка при подписке на предмет');
    }
  };

  const handleUnsubscribe = async (subjectId) => {
    try {
      await teacherAPI.unsubscribeFromSubject(subjectId, user.userId);
      loadData();
      if (selectedSubject?.id === subjectId) {
        setSelectedSubject(null);
      }
    } catch (error) {
      console.error('Error unsubscribing:', error);
      alert('Ошибка при отписке от предмета');
    }
  };

  const openModal = (type, item = null) => {
    setModalType(type);
    setFormData(item || {});
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
          subject: { id: selectedSubject.id },
          value: parseInt(formData.value),
          description: formData.description,
        });
      } else if (modalType === 'labTemplate') {
        const labTemplate = {
          title: formData.title,
          description: formData.description,
          subject: { id: selectedSubject.id },
          maxPoints: parseInt(formData.maxPoints),
          orderNumber: parseInt(formData.orderNumber),
        };
        if (formData.id) {
          await teacherAPI.updateLabTemplate(formData.id, labTemplate);
        } else {
          await teacherAPI.createLabTemplate(labTemplate);
        }
        loadLabTemplates();
      } else if (modalType === 'labSubmission') {
        const selectedTemplate = labTemplates.find(t => t.id === parseInt(formData.labTemplateId));
        const points = parseInt(formData.points);
        
        if (points > selectedTemplate.maxPoints) {
          alert(`Баллы не могут превышать максимальные баллы лабораторной работы (${selectedTemplate.maxPoints})`);
          return;
        }
        
        await teacherAPI.createLabSubmission({
          labTemplate: { id: parseInt(formData.labTemplateId) },
          student: { id: parseInt(formData.studentId) },
          points: points,
          comment: formData.comment,
          status: 'GRADED',
        });
        loadLabSubmissions();
      } else if (modalType === 'gradeSubmission') {
        const points = parseInt(formData.points);
        const maxPoints = formData.labTemplate.maxPoints;
        
        if (points > maxPoints) {
          alert(`Баллы не могут превышать максимальные баллы лабораторной работы (${maxPoints})`);
          return;
        }
        
        await teacherAPI.gradeLabSubmission(formData.id, {
          ...formData,
          points: points,
          status: 'GRADED',
        });
        loadLabSubmissions();
      } else if (modalType === 'attendance') {
        await teacherAPI.addAttendance({
          student: { id: parseInt(formData.studentId) },
          subject: { id: selectedSubject.id },
          date: formData.date,
          present: formData.present === 'true',
          note: formData.note,
        });
      } else if (modalType === 'attestation') {
        await teacherAPI.addAttestation({
          student: { id: parseInt(formData.studentId) },
          subject: { id: selectedSubject.id },
          type: formData.type,
          passed: formData.passed === 'true',
          comment: formData.comment,
        });
      }
      closeModal();
    } catch (error) {
      console.error('Error submitting form:', error);
      const errorMessage = error.response?.data || 'Ошибка при сохранении данных';
      alert(errorMessage);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDeleteLabTemplate = async (id) => {
    if (!window.confirm('Удалить шаблон лабораторной работы?')) return;
    try {
      await teacherAPI.deleteLabTemplate(id);
      loadLabTemplates();
    } catch (error) {
      console.error('Error deleting lab template:', error);
      alert('Ошибка при удалении');
    }
  };

  if (loading) {
    return <div className="loading">Загрузка данных...</div>;
  }

  const isSubscribed = (subjectId) => mySubjects.some((s) => s.id === subjectId);

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
            <div className="stat-label">Моих предметов</div>
            <div className="stat-value">{mySubjects.length}</div>
          </div>
          <div className="card stat-card">
            <div className="stat-label">Шаблонов лаб</div>
            <div className="stat-value">{labTemplates.length}</div>
          </div>
          <div className="card stat-card">
            <div className="stat-label">На проверке</div>
            <div className="stat-value">
              {labSubmissions.filter((s) => s.status === 'PENDING').length}
            </div>
          </div>
        </div>

        {/* Action Tabs */}
        <div className="card">
          <div className="tabs">
            <button
              className={`tab ${activeTab === 'subjects' ? 'active' : ''}`}
              onClick={() => setActiveTab('subjects')}
            >
              📚 Предметы
            </button>
            <button
              className={`tab ${activeTab === 'labs' ? 'active' : ''}`}
              onClick={() => setActiveTab('labs')}
              disabled={!selectedSubject}
            >
              🧪 Учебный план
            </button>
            <button
              className={`tab ${activeTab === 'submissions' ? 'active' : ''}`}
              onClick={() => setActiveTab('submissions')}
              disabled={!selectedSubject}
            >
              📝 Выполнения
            </button>
            <button
              className={`tab ${activeTab === 'grades' ? 'active' : ''}`}
              onClick={() => setActiveTab('grades')}
              disabled={!selectedSubject}
            >
              🎯 Оценки
            </button>
            <button
              className={`tab ${activeTab === 'attendance' ? 'active' : ''}`}
              onClick={() => setActiveTab('attendance')}
              disabled={!selectedSubject}
            >
              📅 Посещаемость
            </button>
            <button
              className={`tab ${activeTab === 'attestations' ? 'active' : ''}`}
              onClick={() => setActiveTab('attestations')}
              disabled={!selectedSubject}
            >
              📋 Аттестации
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'subjects' && (
              <div>
                <h3 style={{ marginBottom: '15px' }}>Мои предметы</h3>
                {mySubjects.length > 0 ? (
                  <div className="subjects-grid">
                    {mySubjects.map((subject) => (
                      <div
                        key={subject.id}
                        className={`subject-card ${selectedSubject?.id === subject.id ? 'selected' : ''}`}
                        onClick={() => setSelectedSubject(subject)}
                      >
                        <div className="subject-name">{subject.name}</div>
                        <div className="subject-desc">{subject.description || 'Без описания'}</div>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUnsubscribe(subject.id);
                          }}
                        >
                          Отписаться
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: '#64748b' }}>Вы не подписаны ни на один предмет</p>
                )}

                <h3 style={{ marginTop: '30px', marginBottom: '15px' }}>Все предметы</h3>
                <div className="subjects-grid">
                  {allSubjects.map((subject) => (
                    <div key={subject.id} className="subject-card">
                      <div className="subject-name">{subject.name}</div>
                      <div className="subject-desc">{subject.description || 'Без описания'}</div>
                      {isSubscribed(subject.id) ? (
                        <span className="badge badge-success">✓ Подписан</span>
                      ) : (
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => handleSubscribe(subject.id)}
                        >
                          Подписаться
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'labs' && selectedSubject && (
              <div>
                <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3>Учебный план: {selectedSubject.name}</h3>
                  <button className="btn btn-primary" onClick={() => openModal('labTemplate')}>
                    + Добавить лабу
                  </button>
                </div>

                {labTemplates.length > 0 ? (
                  <div className="table-container">
                    <table>
                      <thead>
                        <tr>
                          <th>№</th>
                          <th>Название</th>
                          <th>Описание</th>
                          <th>Макс. баллы</th>
                          <th>Действия</th>
                        </tr>
                      </thead>
                      <tbody>
                        {labTemplates.map((template) => (
                          <tr key={template.id}>
                            <td>{template.orderNumber}</td>
                            <td>{template.title}</td>
                            <td>{template.description || '-'}</td>
                            <td>
                              <span className="badge badge-info">{template.maxPoints}</span>
                            </td>
                            <td>
                              <button
                                className="btn btn-sm btn-primary"
                                onClick={() => openModal('labTemplate', template)}
                                style={{ marginRight: '5px' }}
                              >
                                ✏️
                              </button>
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => handleDeleteLabTemplate(template.id)}
                              >
                                🗑️
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p style={{ color: '#64748b' }}>Нет лабораторных работ в учебном плане</p>
                )}
              </div>
            )}

            {activeTab === 'submissions' && selectedSubject && (
              <div>
                <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3>Выполнения студентов: {selectedSubject.name}</h3>
                  <button className="btn btn-primary" onClick={() => openModal('labSubmission')}>
                    + Оценить работу
                  </button>
                </div>

                {labSubmissions.length > 0 ? (
                  <div className="table-container">
                    <table>
                      <thead>
                        <tr>
                          <th>Студент</th>
                          <th>Лабораторная</th>
                          <th>Баллы</th>
                          <th>Статус</th>
                          <th>Комментарий</th>
                          <th>Дата сдачи</th>
                          <th>Действия</th>
                        </tr>
                      </thead>
                      <tbody>
                        {labSubmissions.map((submission) => (
                          <tr key={submission.id}>
                            <td>
                              {submission.student
                                ? `${submission.student.firstName} ${submission.student.lastName}`
                                : '-'}
                            </td>
                            <td>{submission.labTemplate?.title || '-'}</td>
                            <td>
                              <span className="badge badge-success">
                                {submission.points}/{submission.labTemplate?.maxPoints || 0}
                              </span>
                            </td>
                            <td>
                              <span
                                className={`badge ${
                                  submission.status === 'GRADED'
                                    ? 'badge-success'
                                    : submission.status === 'PENDING'
                                    ? 'badge-warning'
                                    : 'badge-danger'
                                }`}
                              >
                                {submission.status === 'GRADED'
                                  ? 'Оценено'
                                  : submission.status === 'PENDING'
                                  ? 'На проверке'
                                  : 'Отклонено'}
                              </span>
                            </td>
                            <td>{submission.comment || '-'}</td>
                            <td>
                              {submission.submittedAt
                                ? new Date(submission.submittedAt).toLocaleDateString()
                                : '-'}
                            </td>
                            <td>
                              <button
                                className="btn btn-sm btn-primary"
                                onClick={() => openModal('gradeSubmission', submission)}
                              >
                                Оценить
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p style={{ color: '#64748b' }}>Нет выполненных работ</p>
                )}
              </div>
            )}

            {activeTab === 'grades' && selectedSubject && (
              <div>
                <button className="btn btn-primary" onClick={() => openModal('grade')}>
                  + Добавить оценку
                </button>
                <p style={{ marginTop: '20px', color: '#64748b' }}>
                  Предмет: {selectedSubject.name}
                </p>
              </div>
            )}

            {activeTab === 'attendance' && selectedSubject && (
              <div>
                <button className="btn btn-primary" onClick={() => openModal('attendance')}>
                  + Отметить посещение
                </button>
                <p style={{ marginTop: '20px', color: '#64748b' }}>
                  Предмет: {selectedSubject.name}
                </p>
              </div>
            )}

            {activeTab === 'attestations' && selectedSubject && (
              <div>
                <button className="btn btn-primary" onClick={() => openModal('attestation')}>
                  + Добавить аттестацию
                </button>
                <p style={{ marginTop: '20px', color: '#64748b' }}>
                  Предмет: {selectedSubject.name}
                </p>
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
              {modalType === 'labTemplate' && (formData.id ? 'Редактировать лабу' : 'Добавить лабу')}
              {modalType === 'labSubmission' && 'Оценить работу студента'}
              {modalType === 'gradeSubmission' && 'Изменить оценку'}
              {modalType === 'attendance' && 'Отметить посещение'}
              {modalType === 'attestation' && 'Добавить аттестацию'}
            </div>

            <form onSubmit={handleSubmit}>
              {modalType === 'labTemplate' && (
                <>
                  <div className="form-group">
                    <label className="form-label">Порядковый номер</label>
                    <input
                      type="number"
                      name="orderNumber"
                      className="form-control"
                      min="1"
                      value={formData.orderNumber || ''}
                      required
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Название</label>
                    <input
                      type="text"
                      name="title"
                      className="form-control"
                      value={formData.title || ''}
                      required
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Описание</label>
                    <textarea
                      name="description"
                      className="form-control"
                      rows="3"
                      value={formData.description || ''}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Максимальные баллы</label>
                    <input
                      type="number"
                      name="maxPoints"
                      className="form-control"
                      min="1"
                      value={formData.maxPoints || ''}
                      required
                      onChange={handleChange}
                    />
                  </div>
                </>
              )}

              {(modalType === 'labSubmission' || modalType === 'gradeSubmission') && (
                <>
                  {modalType === 'labSubmission' && (
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
                        <label className="form-label">Лабораторная работа</label>
                        <select
                          name="labTemplateId"
                          className="form-select"
                          required
                          onChange={handleChange}
                        >
                          <option value="">Выберите лабу</option>
                          {labTemplates.map((template) => (
                            <option key={template.id} value={template.id}>
                              {template.title} (макс. {template.maxPoints} баллов)
                            </option>
                          ))}
                        </select>
                      </div>
                    </>
                  )}
                  <div className="form-group">
                    <label className="form-label">
                      Баллы
                      {modalType === 'gradeSubmission' && formData.labTemplate && (
                        <span style={{ color: '#64748b', fontSize: '12px', marginLeft: '8px' }}>
                          (макс. {formData.labTemplate.maxPoints})
                        </span>
                      )}
                      {modalType === 'labSubmission' && formData.labTemplateId && (
                        <span style={{ color: '#64748b', fontSize: '12px', marginLeft: '8px' }}>
                          (макс. {labTemplates.find(t => t.id === parseInt(formData.labTemplateId))?.maxPoints})
                        </span>
                      )}
                    </label>
                    <input
                      type="number"
                      name="points"
                      className="form-control"
                      min="0"
                      max={
                        modalType === 'gradeSubmission' 
                          ? formData.labTemplate?.maxPoints 
                          : labTemplates.find(t => t.id === parseInt(formData.labTemplateId))?.maxPoints
                      }
                      value={formData.points || ''}
                      required
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Комментарий</label>
                    <textarea
                      name="comment"
                      className="form-control"
                      rows="3"
                      value={formData.comment || ''}
                      onChange={handleChange}
                    />
                  </div>
                </>
              )}

              {modalType === 'grade' && (
                <>
                  <div className="form-group">
                    <label className="form-label">Студент</label>
                    <select name="studentId" className="form-select" required onChange={handleChange}>
                      <option value="">Выберите студента</option>
                      {students.map((student) => (
                        <option key={student.id} value={student.id}>
                          {student.firstName} {student.lastName}
                        </option>
                      ))}
                    </select>
                  </div>
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
                    <input type="text" name="description" className="form-control" onChange={handleChange} />
                  </div>
                </>
              )}

              {modalType === 'attendance' && (
                <>
                  <div className="form-group">
                    <label className="form-label">Студент</label>
                    <select name="studentId" className="form-select" required onChange={handleChange}>
                      <option value="">Выберите студента</option>
                      {students.map((student) => (
                        <option key={student.id} value={student.id}>
                          {student.firstName} {student.lastName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Дата</label>
                    <input type="date" name="date" className="form-control" required onChange={handleChange} />
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
                    <input type="text" name="note" className="form-control" onChange={handleChange} />
                  </div>
                </>
              )}

              {modalType === 'attestation' && (
                <>
                  <div className="form-group">
                    <label className="form-label">Студент</label>
                    <select name="studentId" className="form-select" required onChange={handleChange}>
                      <option value="">Выберите студента</option>
                      {students.map((student) => (
                        <option key={student.id} value={student.id}>
                          {student.firstName} {student.lastName}
                        </option>
                      ))}
                    </select>
                  </div>
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
                    <input type="text" name="comment" className="form-control" onChange={handleChange} />
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

        .tab:hover:not(:disabled) {
          background: #f1f5f9;
          border-color: #cbd5e1;
        }

        .tab.active {
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          color: white;
          border-color: transparent;
        }

        .tab:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .tab-content {
          padding: 20px 0;
        }

        .subjects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 15px;
          margin-top: 15px;
        }

        .subject-card {
          padding: 20px;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          transition: all 0.2s;
          cursor: pointer;
        }

        .subject-card:hover {
          border-color: var(--primary);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
        }

        .subject-card.selected {
          border-color: var(--primary);
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05));
        }

        .subject-name {
          font-weight: 700;
          font-size: 16px;
          margin-bottom: 8px;
          color: var(--dark);
        }

        .subject-desc {
          font-size: 14px;
          color: #64748b;
          margin-bottom: 12px;
          min-height: 40px;
        }

        textarea.form-control {
          resize: vertical;
        }
      `}</style>
    </div>
  );
}

export default TeacherDashboard;
