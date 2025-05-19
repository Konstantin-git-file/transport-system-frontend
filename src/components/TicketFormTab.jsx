import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TicketFormTab.css';

const TicketFormTab = ({ userId, onLoginSuccess }) => {
  const [ticket, setTicket] = useState({
    departureId: '',
    destinationId: ''
  });

  const [loginData, setLoginData] = useState({
    login: '',
    password: ''
  });

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentLocations, setCurrentLocations] = useState([]);
  const [destinations, setDestinations] = useState([]);

  useEffect(() => {
    axios.get('/api/current-locations')
      .then(response => {
        setCurrentLocations(response.data);
      })
      .catch(error => {
        console.error('Ошибка при загрузке станций отправления:', error);
        setMessage('Не удалось загрузить станции отправления');
      });

    axios.get('/api/destinations')
      .then(response => {
        setDestinations(response.data);
      })
      .catch(error => {
        console.error('Ошибка при загрузке пунктов назначения:', error);
        setMessage('Не удалось загрузить пункты назначения');
      });
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    axios.post('/api/users/login', loginData)
      .then(response => {
        if (response.status === 200 && response.data.userId) {
          onLoginSuccess(response.data.userId);
          setMessage('Вы успешно вошли');
        }
      })
      .catch(error => {
        if (error.response?.status === 401) {
          setMessage('Неверный логин или пароль');
        } else {
          setMessage('Ошибка при входе в систему');
        }
        console.error('Ошибка входа:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!ticket.departureId || !ticket.destinationId) {
      setMessage('Выберите станцию отправления и пункт назначения');
      return;
    }

    const data = {
      userId: parseInt(userId),
      locationId: parseInt(ticket.departureId), // Изменили на locationId
      destinationId: parseInt(ticket.destinationId) // Оставили destinationId
    };

    axios.post('/api/tickets', data)
      .then(response => {
        setMessage(`Билет успешно создан с ID: ${response.data.id}`);
        setTicket({ departureId: '', destinationId: '' });
      })
      .catch(error => {
        console.error('Ошибка при создании билета:', error);
        if (error.response?.data) {
          setMessage('Ошибка: ' + JSON.stringify(error.response.data));
        } else {
          setMessage('Ошибка при создании билета');
        }
      });
  };

  const handleInputChange = (e) => {
    setTicket({
      ...ticket,
      [e.target.name]: e.target.value
    });
  };

  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="form-card">
      <h2>Создание билета</h2>

      {!userId && (
        <div className="auth-section">
          <p className="warning-box">
            Билет можно оформить только после регистрации пользователя или войдите в систему
          </p>

          <form onSubmit={handleLogin} className="login-form">
            <h3>Войти в систему</h3>

            <div className="form-group">
              <label>
                Логин<span className="required">*</span>:
                <input
                  type="text"
                  name="login"
                  value={loginData.login}
                  onChange={handleLoginChange}
                  placeholder="Введите логин"
                  required
                />
              </label>
            </div>

            <div className="form-group">
              <label>
                Пароль<span className="required">*</span>:
                <input
                  type="password"
                  name="password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  placeholder="Введите пароль"
                  required
                />
              </label>
            </div>

            <button type="submit" disabled={loading} className="submit-button">
              {loading ? 'Вход...' : 'Войти'}
            </button>

            {message && <p className="form-message">{message}</p>}
          </form>
        </div>
      )}

      {userId && (
        <form onSubmit={handleSubmit} className="ticket-form">
          <p><strong>ID пользователя:</strong> {userId}</p>

          <div className="form-group">
            <label>
              Станция отправления<span className="required">*</span>:
              <select
                name="departureId"
                value={ticket.departureId}
                onChange={handleInputChange}
                required
              >
                <option value="">Выберите станцию отправления</option>
                {currentLocations.map(location => (
                  <option key={location.id} value={location.id}>
                    {location.stationName} ({location.city})
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="form-group">
            <label>
              Пункт назначения<span className="required">*</span>:
              <select
                name="destinationId"
                value={ticket.destinationId}
                onChange={handleInputChange}
                required
              >
                <option value="">Выберите пункт назначения</option>
                {destinations.map(destination => (
                  <option key={destination.id} value={destination.id}>
                    {destination.stationName} ({destination.city})
                  </option>
                ))}
              </select>
            </label>
          </div>

          <button type="submit" className="submit-button">Создать билет</button>
          {message && <p className="form-message">{message}</p>}
        </form>
      )}
    </div>
  );
};

export default TicketFormTab;