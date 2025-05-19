import React, { useState } from 'react';
import axios from 'axios';
import './UserFormTab.css';

const UserFormTab = ({ setUserId }) => {
  const [user, setUser] = useState({
    firstname: '',
    lastname: '',
    serial: '',
    number: '',
    gender: '',
    login: '',        // Новое поле
    password: ''      // Новое поле
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!user.firstname || !user.lastname || !user.serial || !user.number || !user.gender || !user.login || !user.password) {
      setMessage('Заполните все обязательные поля');
      return;
    }

    const data = {
      firstname: user.firstname,
      lastname: user.lastname,
      passport: {
        serial: user.serial,
        number: user.number,
        gender: user.gender
      },
      login: user.login,
      password: user.password
    };

    console.log('Отправляемые данные:', data);

    axios.post('/api/users', data)
      .then(response => {
        const userId = response.data.id;
        setUserId(userId);
        setMessage(`Пользователь создан с ID: ${userId}`);
        setUser({
          firstname: '',
          lastname: '',
          serial: '',
          number: '',
          gender: '',
          login: '',
          password: ''
        });
      })
      .catch(error => {
        console.error('Ошибка:', error.response ? error.response.data : error.message);
        setMessage('Ошибка при создании пользователя');
      });
  };

  return (
    <div className="form-card">
      <h2>Создание пользователя</h2>
      <form onSubmit={handleSubmit} className="user-form">

        {/* Имя */}
        <div className="form-group">
          <label>
            Имя<span className="required">*</span>:
            <input
              type="text"
              name="firstname"
              value={user.firstname}
              onChange={handleChange}
              placeholder="Введите имя"
              required
            />
          </label>
        </div>

        {/* Фамилия */}
        <div className="form-group">
          <label>
            Фамилия<span className="required">*</span>:
            <input
              type="text"
              name="lastname"
              value={user.lastname}
              onChange={handleChange}
              placeholder="Введите фамилию"
              required
            />
          </label>
        </div>

        {/* Серия паспорта */}
        <div className="form-group">
          <label>
            Серия паспорта<span className="required">*</span>:
            <input
              type="text"
              name="serial"
              value={user.serial}
              onChange={handleChange}
              placeholder="Например: 1234"
              required
            />
          </label>
        </div>

        {/* Номер паспорта */}
        <div className="form-group">
          <label>
            Номер паспорта<span className="required">*</span>:
            <input
              type="text"
              name="number"
              value={user.number}
              onChange={handleChange}
              placeholder="Например: 123456"
              required
            />
          </label>
        </div>

        {/* Пол */}
        <div className="form-group">
          <label>
            Пол<span className="required">*</span>:
            <select
              name="gender"
              value={user.gender}
              onChange={handleChange}
              required
            >
              <option value="">Выберите пол</option>
              <option value="MALE">Мужской</option>
              <option value="FEMALE">Женский</option>
            </select>
          </label>
        </div>

        {/* Логин */}
        <div className="form-group">
          <label>
            Логин<span className="required">*</span>:
            <input
              type="text"
              name="login"
              value={user.login}
              onChange={handleChange}
              placeholder="Введите логин"
              required
            />
          </label>
        </div>

        {/* Пароль */}
        <div className="form-group">
          <label>
            Пароль<span className="required">*</span>:
            <input
              type="password"
              name="password"
              value={user.password}
              onChange={handleChange}
              placeholder="Введите пароль"
              required
            />
          </label>
        </div>

        <button type="submit" className="submit-button">Создать пользователя</button>
        {message && <p className="form-message">{message}</p>}
      </form>
    </div>
  );
};

export default UserFormTab;