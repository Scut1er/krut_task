import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';

function AdminDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [grades, setGrades] = useState([]);
  const [labTemplates, setLabTemplates] = useState([]);
  const [labSubmissions, setLabSubmissions] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [attestations, setAttestations] = useState([]);
  
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      switch (activeTab) {
        case 'users':
          const usersRes = await adminAPI.getUsers();
          setUsers(usersRes.data);
          break;
        case 'subjects':
          const subjectsRes = await adminAPI.getSubjects();
          setSubjects(subjectsRes.data);
          break;
        case 'grades':
          const gradesRes = await adminAPI.getGrades();
          setGrades(gradesRes.data);
          break;
        case 'labTemplates':
          const labTemplatesRes = await adminAPI.getLabTemplates();
          setLabTemplates(labTemplatesRes.data);
          break;
        case 'labSubmissions':
          const labSubmissionsRes = await adminAPI.getLabSubmissions();
          setLabSubmissions(labSubmissionsRes.data);
          break;
        case 'attendance':
          const attendanceRes = await adminAPI.getAttendance();
          setAttendance(attendanceRes.data);
          break;
        case 'attestations':
          const attestationsRes = await adminAPI.getAttestations();
          setAttestations(attestationsRes.data);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (item = null) => {
    setEditingItem(item);
    setFormData(item || {});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setFormData({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (activeTab === 'users') {
        if (editingItem) {
          await adminAPI.updateUser(editingItem.id, formData);
        } else {
          await adminAPI.createUser(formData);
        }
      } else if (activeTab === 'subjects') {
        if (editingItem) {
          await adminAPI.updateSubject(editingItem.id, formData);
        } else {
          await adminAPI.createSubject(formData);
        }
      }
      closeModal();
      loadData();
    } catch (error) {
      console.error('Error saving:', error);
      alert('Ошибка при сохранении');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту запись?')) return;
    
    try {
      switch (activeTab) {
        case 'users':
          await adminAPI.deleteUser(id);
          break;
        case 'subjects':
          await adminAPI.deleteSubject(id);
          break;
        case 'grades':
          await adminAPI.deleteGrade(id);
          break;
        case 'labTemplates':
          await adminAPI.deleteLabTemplate(id);
          break;
        case 'labSubmissions':
          await adminAPI.deleteLabSubmission(id);
          break;
        case 'attendance':
          await adminAPI.deleteAttendance(id);
          break;
        case 'attestations':
          await adminAPI.deleteAttestation(id);
          break;
        default:
          break;
      }
      loadData();
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Ошибка при удалении');
    }
  };

  if (loading && activeTab === 'users' && users.length === 0) {
    return <div className="loading">Загрузка...</div>;
  }

  return (
    <div className="dashboard">
      <div className="container">
        <nav className="navbar">
          <div className="navbar-brand">🎓 Student Portal - Админка</div>
          <div className="navbar-user">
            <div className="user-info">
              <div className="user-name">{user.firstName} {user.lastName}</div>
              <div className="user-role">Администратор</div>
            </div>
            <button onClick={onLogout} className="btn-logout">Выход</button>
          </div>
        </nav>

        <div className="card">
          <div className="tabs">
            <button
              className={`tab ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              👥 Пользователи
            </button>
            <button
              className={`tab ${activeTab === 'subjects' ? 'active' : ''}`}
              onClick={() => setActiveTab('subjects')}
            >
              📚 Предметы
            </button>
            <button
              className={`tab ${activeTab === 'grades' ? 'active' : ''}`}
              onClick={() => setActiveTab('grades')}
            >
              🎯 Оценки
            </button>
            <button
              className={`tab ${activeTab === 'labTemplates' ? 'active' : ''}`}
              onClick={() => setActiveTab('labTemplates')}
            >
              📝 Шаблоны лаб
            </button>
            <button
              className={`tab ${activeTab === 'labSubmissions' ? 'active' : ''}`}
              onClick={() => setActiveTab('labSubmissions')}
            >
              🧪 Выполнения
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
          </div>

          <div className="tab-content">
            {(activeTab === 'users' || activeTab === 'subjects') && (
              <button className="btn btn-primary" onClick={() => openModal()}>
                + Добавить {activeTab === 'users' ? 'пользователя' : 'предмет'}
              </button>
            )}

            {loading ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                Загрузка...
              </div>
            ) : (
              <>
                {/* Users Table */}
                {activeTab === 'users' && (
                  <div className="table-container" style={{ marginTop: '20px' }}>
                    <table>
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>ФИО</th>
                          <th>Email</th>
                          <th>Роль</th>
                          <th>Группа/Кафедра</th>
                          <th>Действия</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((u) => (
                          <tr key={u.id}>
                            <td>{u.id}</td>
                            <td>{u.firstName} {u.lastName}</td>
                            <td>{u.email}</td>
                            <td>
                              <span className={`badge ${
                                u.role === 'ADMIN' ? 'badge-danger' :
                                u.role === 'TEACHER' ? 'badge-info' : 'badge-success'
                              }`}>
                                {u.role === 'ADMIN' ? '👑 Админ' :
                                 u.role === 'TEACHER' ? '👨‍🏫 Препод' : '👨‍🎓 Студент'}
                              </span>
                            </td>
                            <td>{u.studentGroup || u.department || '-'}</td>
                            <td>
                              <button
                                className="btn btn-sm btn-primary"
                                onClick={() => openModal(u)}
                                style={{ marginRight: '5px' }}
                              >
                                ✏️ Изменить
                              </button>
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => handleDelete(u.id)}
                              >
                                🗑️ Удалить
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Subjects Table */}
                {activeTab === 'subjects' && (
                  <div className="table-container" style={{ marginTop: '20px' }}>
                    <table>
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Название</th>
                          <th>Описание</th>
                          <th>Действия</th>
                        </tr>
                      </thead>
                      <tbody>
                        {subjects.map((s) => (
                          <tr key={s.id}>
                            <td>{s.id}</td>
                            <td>{s.name}</td>
                            <td>{s.description || '-'}</td>
                            <td>
                              <button
                                className="btn btn-sm btn-primary"
                                onClick={() => openModal(s)}
                                style={{ marginRight: '5px' }}
                              >
                                ✏️ Изменить
                              </button>
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => handleDelete(s.id)}
                              >
                                🗑️ Удалить
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Grades Table */}
                {activeTab === 'grades' && (
                  <div className="table-container" style={{ marginTop: '20px' }}>
                    <table>
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Студент</th>
                          <th>Предмет</th>
                          <th>Оценка</th>
                          <th>Описание</th>
                          <th>Дата</th>
                          <th>Действия</th>
                        </tr>
                      </thead>
                      <tbody>
                        {grades.map((g) => (
                          <tr key={g.id}>
                            <td>{g.id}</td>
                            <td>
                              {g.student ? `${g.student.firstName} ${g.student.lastName}` : '-'}
                            </td>
                            <td>{g.subject?.name || '-'}</td>
                            <td><strong style={{ fontSize: '18px', color: 'var(--primary)' }}>{g.value}</strong></td>
                            <td>{g.description || '-'}</td>
                            <td>{g.createdAt ? new Date(g.createdAt).toLocaleDateString() : '-'}</td>
                            <td>
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => handleDelete(g.id)}
                              >
                                🗑️ Удалить
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Lab Templates Table */}
                {activeTab === 'labTemplates' && (
                  <div className="table-container" style={{ marginTop: '20px' }}>
                    <table>
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>№</th>
                          <th>Название</th>
                          <th>Предмет</th>
                          <th>Макс. баллы</th>
                          <th>Дата создания</th>
                          <th>Действия</th>
                        </tr>
                      </thead>
                      <tbody>
                        {labTemplates.map((template) => (
                          <tr key={template.id}>
                            <td>{template.id}</td>
                            <td>{template.orderNumber}</td>
                            <td>{template.title}</td>
                            <td>{template.subject?.name || '-'}</td>
                            <td><span className="badge badge-info">{template.maxPoints}</span></td>
                            <td>{template.createdAt ? new Date(template.createdAt).toLocaleDateString() : '-'}</td>
                            <td>
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => handleDelete(template.id)}
                              >
                                🗑️ Удалить
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Lab Submissions Table */}
                {activeTab === 'labSubmissions' && (
                  <div className="table-container" style={{ marginTop: '20px' }}>
                    <table>
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Студент</th>
                          <th>Лабораторная</th>
                          <th>Предмет</th>
                          <th>Баллы</th>
                          <th>Статус</th>
                          <th>Дата сдачи</th>
                          <th>Действия</th>
                        </tr>
                      </thead>
                      <tbody>
                        {labSubmissions.map((submission) => (
                          <tr key={submission.id}>
                            <td>{submission.id}</td>
                            <td>
                              {submission.student
                                ? `${submission.student.firstName} ${submission.student.lastName}`
                                : '-'}
                            </td>
                            <td>{submission.labTemplate?.title || '-'}</td>
                            <td>{submission.labTemplate?.subject?.name || '-'}</td>
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
                            <td>
                              {submission.submittedAt
                                ? new Date(submission.submittedAt).toLocaleDateString()
                                : '-'}
                            </td>
                            <td>
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => handleDelete(submission.id)}
                              >
                                🗑️ Удалить
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Attendance Table */}
                {activeTab === 'attendance' && (
                  <div className="table-container" style={{ marginTop: '20px' }}>
                    <table>
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Студент</th>
                          <th>Предмет</th>
                          <th>Дата</th>
                          <th>Статус</th>
                          <th>Примечание</th>
                          <th>Действия</th>
                        </tr>
                      </thead>
                      <tbody>
                        {attendance.map((a) => (
                          <tr key={a.id}>
                            <td>{a.id}</td>
                            <td>
                              {a.student ? `${a.student.firstName} ${a.student.lastName}` : '-'}
                            </td>
                            <td>{a.subject?.name || '-'}</td>
                            <td>{a.date}</td>
                            <td>
                              <span className={`badge ${a.present ? 'badge-success' : 'badge-danger'}`}>
                                {a.present ? 'Присутствовал' : 'Отсутствовал'}
                              </span>
                            </td>
                            <td>{a.note || '-'}</td>
                            <td>
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => handleDelete(a.id)}
                              >
                                🗑️ Удалить
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Attestations Table */}
                {activeTab === 'attestations' && (
                  <div className="table-container" style={{ marginTop: '20px' }}>
                    <table>
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Студент</th>
                          <th>Предмет</th>
                          <th>Тип</th>
                          <th>Статус</th>
                          <th>Комментарий</th>
                          <th>Дата</th>
                          <th>Действия</th>
                        </tr>
                      </thead>
                      <tbody>
                        {attestations.map((a) => (
                          <tr key={a.id}>
                            <td>{a.id}</td>
                            <td>
                              {a.student ? `${a.student.firstName} ${a.student.lastName}` : '-'}
                            </td>
                            <td>{a.subject?.name || '-'}</td>
                            <td>
                              <span className="badge badge-info">
                                {a.type === 'FIRST' ? 'Первая' :
                                 a.type === 'SECOND' ? 'Вторая' : 'Финальная'}
                              </span>
                            </td>
                            <td>
                              <span className={`badge ${a.passed ? 'badge-success' : 'badge-danger'}`}>
                                {a.passed ? 'Зачтено' : 'Не зачтено'}
                              </span>
                            </td>
                            <td>{a.comment || '-'}</td>
                            <td>{a.createdAt ? new Date(a.createdAt).toLocaleDateString() : '-'}</td>
                            <td>
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => handleDelete(a.id)}
                              >
                                🗑️ Удалить
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modal for Users and Subjects */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              {editingItem ? 'Редактировать' : 'Добавить'}{' '}
              {activeTab === 'users' ? 'пользователя' : 'предмет'}
            </div>

            <form onSubmit={handleSubmit}>
              {activeTab === 'users' && (
                <>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      value={formData.email || ''}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  {!editingItem && (
                    <div className="form-group">
                      <label className="form-label">Пароль</label>
                      <input
                        type="password"
                        name="password"
                        className="form-control"
                        onChange={handleChange}
                        required
                      />
                    </div>
                  )}

                  <div className="form-group">
                    <label className="form-label">Имя</label>
                    <input
                      type="text"
                      name="firstName"
                      className="form-control"
                      value={formData.firstName || ''}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Фамилия</label>
                    <input
                      type="text"
                      name="lastName"
                      className="form-control"
                      value={formData.lastName || ''}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Роль</label>
                    <select
                      name="role"
                      className="form-select"
                      value={formData.role || ''}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Выберите роль</option>
                      <option value="STUDENT">Студент</option>
                      <option value="TEACHER">Преподаватель</option>
                      <option value="ADMIN">Администратор</option>
                    </select>
                  </div>

                  {formData.role === 'STUDENT' && (
                    <div className="form-group">
                      <label className="form-label">Группа</label>
                      <input
                        type="text"
                        name="studentGroup"
                        className="form-control"
                        value={formData.studentGroup || ''}
                        onChange={handleChange}
                      />
                    </div>
                  )}

                  {formData.role === 'TEACHER' && (
                    <div className="form-group">
                      <label className="form-label">Кафедра</label>
                      <input
                        type="text"
                        name="department"
                        className="form-control"
                        value={formData.department || ''}
                        onChange={handleChange}
                      />
                    </div>
                  )}
                </>
              )}

              {activeTab === 'subjects' && (
                <>
                  <div className="form-group">
                    <label className="form-label">Название предмета</label>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      value={formData.name || ''}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Описание</label>
                    <input
                      type="text"
                      name="description"
                      className="form-control"
                      value={formData.description || ''}
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

export default AdminDashboard;





