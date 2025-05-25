import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TicketFormTab.css';

const TicketFormTab = ({ userId, onLoginSuccess }) => {
  const [ticket, setTicket] = useState({
    departureCity: '',
    departureId: '',
    destinationCity: '',
    destinationId: ''
  });

  const [loginData, setLoginData] = useState({ login: '', password: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const [currentLocations, setCurrentLocations] = useState([]);
  const [destinations, setDestinations] = useState([]);

  useEffect(() => {
    axios.get('/api/current-locations')
      .then(res => setCurrentLocations(res.data))
      .catch(err => {
        console.error(err);
        setMessage('Не удалось загрузить станции отправления');
      });

    axios.get('/api/destinations')
      .then(res => setDestinations(res.data))
      .catch(err => {
        console.error(err);
        setMessage('Не удалось загрузить пункты назначения');
      });
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    axios.post('/api/users/login', loginData)
      .then(res => {
        if (res.status === 200 && res.data.userId) {
          onLoginSuccess(res.data.userId);
          setMessage('Вы успешно вошли');
        }
      })
      .catch(err => {
        setMessage(err.response?.status === 401 ? 'Неверный логин или пароль' : 'Ошибка при входе');
      })
      .finally(() => setLoading(false));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { departureId, destinationId } = ticket;
    const dep = currentLocations.find(loc => loc.id === parseInt(departureId));
    const dest = destinations.find(d => d.id === parseInt(destinationId));

    if (!dep || !dest) {
      setMessage('Выбранные локации недействительны');
      return;
    }

    if (dep.city === dest.city && dep.station === dest.station) {
      setMessage('Станции отправления и назначения не могут совпадать');
      return;
    }

    axios.post('/api/tickets', {
      userId: parseInt(userId),
      currentLocationId: dep.id,
      destinationId: dest.id,
      fromCity: dep.city,
      fromStation: dep.station,
      toCity: dest.city,
      toStation: dest.station
    })
      .then(res => {
        setMessage(`Билет успешно создан с ID: ${res.data.id}`);
        setTicket({ departureCity: '', departureId: '', destinationCity: '', destinationId: '' });
      })
      .catch(err => {
        setMessage(err.response?.data ? 'Ошибка: ' + JSON.stringify(err.response.data) : 'Ошибка при создании билета');
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTicket({ ...ticket, [name]: value, ...(name.includes('City') ? { [`${name.replace('City', '')}Id`]: '' } : {}) });
  };

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const getFilteredStations = (list, city) => list.filter(item => item.city === city);

  return (
    <div className="form-card">
      <h2>Создание билета</h2>

      {!userId ? (
        <form onSubmit={handleLogin} className="login-form">
          <h3>Войти в систему</h3>
          <div className="form-group">
            <label>
              Логин<span className="required">*</span>:
              <input type="text" name="login" value={loginData.login} onChange={handleLoginChange} required />
            </label>
          </div>
          <div className="form-group">
            <label>
              Пароль<span className="required">*</span>:
              <input type="password" name="password" value={loginData.password} onChange={handleLoginChange} required />
            </label>
          </div>
          <button type="submit" disabled={loading} className="submit-button">{loading ? 'Вход...' : 'Войти'}</button>
          {message && <p className="form-message">{message}</p>}
        </form>
      ) : (
        <form onSubmit={handleSubmit} className="ticket-form">
          <p><strong>ID пользователя:</strong> {userId}</p>

          <div className="form-group">
            <label>
              Город отправления<span className="required">*</span>:
              <select name="departureCity" value={ticket.departureCity} onChange={handleInputChange} required>
                <option value="">Выберите город</option>
                {[...new Set(currentLocations.map(loc => loc.city))].map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </label>
          </div>

          {ticket.departureCity && (
            <div className="form-group">
              <label>
                Станция отправления<span className="required">*</span>:
                <select name="departureId" value={ticket.departureId} onChange={handleInputChange} required>
                  <option value="">Выберите станцию</option>
                  {getFilteredStations(currentLocations, ticket.departureCity).map(loc => (
                    <option key={loc.id} value={loc.id}>{loc.station} ({loc.city})</option>
                  ))}
                </select>
              </label>
            </div>
          )}

          <div className="form-group">
            <label>
              Город назначения<span className="required">*</span>:
              <select name="destinationCity" value={ticket.destinationCity} onChange={handleInputChange} required>
                <option value="">Выберите город</option>
                {[...new Set(destinations.map(dest => dest.city))].map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </label>
          </div>

          {ticket.destinationCity && (
            <div className="form-group">
              <label>
                Пункт назначения<span className="required">*</span>:
                <select name="destinationId" value={ticket.destinationId} onChange={handleInputChange} required>
                  <option value="">Выберите станцию</option>
                  {getFilteredStations(destinations, ticket.destinationCity).map(dest => (
                    <option key={dest.id} value={dest.id}>{dest.station} ({dest.city})</option>
                  ))}
                </select>
              </label>
            </div>
          )}

          <button type="submit" className="submit-button">Создать билет</button>
          {message && <p className="form-message">{message}</p>}
        </form>
      )}
    </div>
  );
};

export default TicketFormTab;
