import React, { useState } from 'react';
import axios from 'axios';
import './TicketForm.css';

const TicketForm = ({ userId: propUserId }) => {
  const [ticket, setTicket] = useState({
    userId: propUserId || '',
    passportId: '',
    departure: '',      // место отправления
    destination: ''     // пункт назначения
  });

  const [message, setMessage] = useState('');

  // Синхронизируем пропс userId при его изменении извне
  useEffect(() => {
    if (propUserId) {
      setTicket(prev => ({ ...prev, userId: propUserId }));
    }
  }, [propUserId]);

  const handleChange = (e) => {
    setTicket({
      ...ticket,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!ticket.userId || !ticket.passportId || !ticket.departure || !ticket.destination) {
      setMessage('Заполните все обязательные поля');
      return;
    }

    const data = {
      user: { id: parseInt(ticket.userId) },
      passport: { id: parseInt(ticket.passportId) },
      departureLocation: { id: parseInt(ticket.departure) },
      destination: { id: parseInt(ticket.destination) }
    };

    console.log('Отправляемые данные:', data);

    axios.post('/api/tickets', data)
      .then(response => {
        setMessage(`Билет успешно создан с ID: ${response.data.id}`);
        setTicket({
          userId: propUserId || '',
          passportId: '',
          departure: '',
          destination: ''
        });
      })
      .catch(error => {
        console.error('Ошибка:', error.response ? error.response.data : error.message);
        setMessage('Ошибка при создании билета');
      });
  };

  return (
    <div className="form-card">
      <h2>Создание билета</h2>

      {/* Предупреждение, если пользователь не выбран */}
      {!ticket.userId && (
        <div className="warning-box">
          <p>
            Билет можно оформить только после регистрации пользователя.
          </p>
        </div>
      )}

      {/* Форма создания билета */}
      {ticket.userId && (
        <form onSubmit={handleSubmit} className="ticket-form">

          {/* Имя пользователя (скрытое поле или только текст) */}
          <div className="form-group">
            <label>
              Имя пользователя<span className="required">*</span>:
              <input
                type="text"
                name="userId"
                value={ticket.userId}
                readOnly
                placeholder="ID пользователя"
              />
            </label>
          </div>

          {/* Номер паспорта */}
          <div className="form-group">
            <label>
              Номер паспорта<span className="required">*</span>:
              <input
                type="text"
                name="passportId"
                value={ticket.passportId}
                onChange={handleChange}
                placeholder="Введите ID паспорта"
              />
            </label>
          </div>

          {/* Место отправления */}
          <div className="form-group">
            <label>
              Станция отправления<span className="required">*</span>:
              <input
                type="text"
                name="departure"
                value={ticket.departure}
                onChange={handleChange}
                placeholder="Например: Москва, Курский вокзал"
              />
            </label>
          </div>

          {/* Пункт назначения */}
          <div className="form-group">
            <label>
              Пункт назначения<span className="required">*</span>:
              <input
                type="text"
                name="destination"
                value={ticket.destination}
                onChange={handleChange}
                placeholder="Например: Санкт-Петербург, Московский вокзал"
              />
            </label>
          </div>

          <button type="submit" className="submit-button">Создать билет</button>

          {message && <p className="form-message">{message}</p>}
        </form>
      )}
    </div>
  );
};

export default TicketForm;