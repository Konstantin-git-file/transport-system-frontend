import React, { useState } from 'react';
import axios from 'axios';
import './UserForm.css';

const UserForm = () => {
  const [user, setUser] = useState({
    firstname: '',
    lastname: '',
    serial: '',
    number: '',
    gender: '',
    ticketId: ''
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

    const data = {
      firstname: user.firstname,
      lastname: user.lastname,
      passport: user.serial || user.number ? {
        serial: user.serial,
        number: user.number,
        gender: user.gender || null
      } : null,
      ticketId: user.ticketId ? parseInt(user.ticketId) : null
    };

    console.log('Отправляемые данные:', data);

    axios.post('/api/users', data)
      .then(response => {
        setMessage(`Пользователь создан с ID: ${response.data.id}`);
        setUser({
          firstname: '',
          lastname: '',
          serial: '',
          number: '',
          gender: '',
          ticketId: ''
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
            Серия паспорта:
            <input
              type="text"
              name="serial"
              value={user.serial}
              onChange={handleChange}
              placeholder="Например: 1234"
            />
          </label>
        </div>

        {/* Номер паспорта */}
        <div className="form-group">
          <label>
            Номер паспорта:
            <input
              type="text"
              name="number"
              value={user.number}
              onChange={handleChange}
              placeholder="Например: 123456"
            />
          </label>
        </div>

        {/* Пол */}
        <div className="form-group">
          <label>
            Пол:
            <select
              name="gender"
              value={user.gender}
              onChange={handleChange}
            >
              <option value="">Выберите пол</option>
              <option value="MALE">Мужской</option>
              <option value="FEMALE">Женский</option>
            </select>
          </label>
        </div>

        {/* ID билета */}
        <div className="form-group">
          <label>
            ID билета:
            <input
              type="text"
              name="ticketId"
              value={user.ticketId}
              onChange={handleChange}
              placeholder="Например: 789012"
            />
          </label>
        </div>

        <button type="submit" className="submit-button">Создать пользователя</button>

        {message && <p className="form-message">{message}</p>}
      </form>
    </div>
  );
};

export default UserForm;