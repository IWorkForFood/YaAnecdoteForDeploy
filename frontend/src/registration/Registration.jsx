import './registration.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { getCookie } from 'react-use-cookie';

export default function Registration() {
  const [username, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hasError, setHasError] = useState({
    username: [],
    email: [],
    password: [],
  });
  const [message, setMessage] = useState(''); // Для сообщений об успехе/ошибке

  // Валидация username
  const validateUsername = (username) => {
    const errors = [];
    if (username.trim().length === 0) {
      errors.push('Имя пользователя не может быть пустым.');
    }
    if (username.length < 3) {
      errors.push('Имя пользователя должно содержать минимум 3 символа.');
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      errors.push('Имя пользователя может содержать только буквы, цифры и подчеркивания.');
    }
    return errors;
  };

  // Валидация email
  const validateEmail = (email) => {
    const errors = [];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.trim().length === 0) {
      errors.push('Email не может быть пустым.');
    }
    if (!emailRegex.test(email)) {
      errors.push('Введите корректный email.');
    }
    return errors;
  };

  // Валидация пароля
  const validatePassword = (password, email, username) => {
    const errors = [];

    // 1. Проверка минимальной длины (8 символов)
    if (password.length < 8) {
      errors.push('Пароль должен содержать минимум 8 символов.');
    }

    // 4. Проверка на только цифры
    if (/^\d+$/.test(password)) {
      errors.push('Пароль не должен состоять только из цифр.');
    }

    return errors;
  };

  // Обработчики изменений
  const handleNameChange = (event) => {
    const newUsername = event.target.value;
    setName(newUsername);
    setHasError((prev) => ({
      ...prev,
      username: validateUsername(newUsername),
    }));
  };

  const handleEmailChange = (event) => {
    const newEmail = event.target.value;
    setEmail(newEmail);
    setHasError((prev) => ({
      ...prev,
      email: validateEmail(newEmail),
    }));
  };

  const handlePasswordChange = (event) => {
    const newPassword = event.target.value;
    setPassword(newPassword);
    setHasError((prev) => ({
      ...prev,
      password: validatePassword(newPassword, email, username),
    }));
  };

  // Инициализация hasError
  
  useEffect(() => {
    setHasError({
      username: [],
      email: [],
      password: [],
    });
  }, []);



  // Проверка, есть ли ошибки
  const hasErrors =
    hasError.username.length > 0 ||
    hasError.email.length > 0 ||
    hasError.password.length > 0;

  // Отправка запроса на регистрацию
  async function sendRegRequest(e) {
    e.preventDefault(); // Предотвращаем стандартную отправку формы
    if (hasErrors) return; // Не отправляем запрос, если есть ошибки

    try {
      // 1. Отправляем данные на сервер для регистрации
      const regResponse = await axios.post('http://89.111.137.192/api/api/auth/v1/users/', {
        email: email,
        username: username,
        password: password,
      },
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken'),
        },
      }
    );

      console.log('Успешная регистрация:', regResponse.data);

      setMessage('Регистрация успешна! Подтвердите email по ссылке в письме.');
      // Очищаем форму
      setName('');
      setEmail('');
      setPassword('');
      setHasError({
        username: [],
        email: [],
        password: [],
      });
    } catch (error) {
      console.error('Ошибка при регистрации:', error);
      setMessage('Ошибка при регистрации. Попробуйте снова.');
    }
  }

  return (
    <div className='reg-enter-wrapper'>
      <div className="reg-enter-block">
        <h2 id="reg-title">Регистрация</h2>
        <p className="form-left-line">Добро пожаловать! Мы рады видеть вас снова!</p>
        <form className="reg-enter-form">
          <div>
            <input
              name="username"
              className="form-control"
              placeholder="Полное имя (псевдоним, кличка, прозвище, погоняло)"
              value={username}
              onChange={handleNameChange}
              style={{
                border: hasError.username.length > 0 ? '1px solid red' : null,
              }}
              required
            />
            {hasError.username.length > 0 && (
              <div style={{ color: 'red', fontSize: '0.9em', marginTop: '5px' }}>
                {hasError.username.join(' ')}
              </div>
            )}
          </div>

          <div>
            <input
              type="text"
              className="form-control"
              name="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="email"
              style={{
                border: hasError.email.length > 0 ? '1px solid red' : null,
                color: 'red'
              }}
              required
            />
            {hasError.email.length > 0 && (
              <div style={{ color: 'red', fontSize: '0.9em', marginTop: '5px' }}>
                {hasError.email.join(' ')}
              </div>
            )}
          </div>

          <div>
            <input
              type="password"
              className="form-control"
              name="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Пароль"
              style={{
                border: hasError.password.length > 0 ? '1px solid red' : null,
                color: 'red'
              }}
              required
            />
            {hasError.password.length > 0 && (
              <div style={{ color: 'red', fontSize: '0.9em', marginTop: '5px' }}>
                {hasError.password.join(' ')}
              </div>
            )}
          </div>

          <button onClick={sendRegRequest} disabled={ !email || !password || !username}>
            Зарегистрироваться
          </button>
        </form>
        
      </div>
      {message && (
        <p style={{ color: message.includes('успешна') ? 'green' : 'red', marginTop: '10px' }}>
          {message}
        </p>
      )}
      <p>
        Already a member? <span><Link to="/login">Sign In</Link></span>
      </p>
      
    </div>
  );
}