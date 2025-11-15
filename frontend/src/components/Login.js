import React, { useState } from 'react';
import { authAPI } from '../services/api';
import './Login.css';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login(email, password);
      onLogin(response.data);
    } catch (err) {
      setError('Неверный email или пароль');
    } finally {
      setLoading(false);
    }
  };

  const copyCredentials = (userEmail, userPassword, type) => {
    setEmail(userEmail);
    setPassword(userPassword);
    setCopied(type);
    setTimeout(() => setCopied(''), 2000);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>🎓 Student Portal</h1>
          <p>Личный кабинет студента</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="alert alert-error">{error}</div>}
          {copied && <div className="alert alert-success">✓ Данные {copied} скопированы!</div>}

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Пароль</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>

        <div className="login-info">
          <p><strong>Тестовые аккаунты:</strong></p>
          <div className="test-accounts">
            <div className="test-account">
              <div className="account-info">
                <span className="account-role">👨‍🎓 Студент</span>
                <span className="account-creds">student@example.com / student123</span>
              </div>
              <button
                type="button"
                className="btn-copy"
                onClick={() => copyCredentials('student@example.com', 'student123', 'студента')}
              >
                📋 Копировать
              </button>
            </div>
            
            <div className="test-account">
              <div className="account-info">
                <span className="account-role">👨‍🏫 Преподаватель</span>
                <span className="account-creds">teacher@example.com / teacher123</span>
              </div>
              <button
                type="button"
                className="btn-copy"
                onClick={() => copyCredentials('teacher@example.com', 'teacher123', 'преподавателя')}
              >
                📋 Копировать
              </button>
            </div>

            <div className="test-account">
              <div className="account-info">
                <span className="account-role">👑 Администратор</span>
                <span className="account-creds">admin@example.com / admin123</span>
              </div>
              <button
                type="button"
                className="btn-copy"
                onClick={() => copyCredentials('admin@example.com', 'admin123', 'администратора')}
              >
                📋 Копировать
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;


