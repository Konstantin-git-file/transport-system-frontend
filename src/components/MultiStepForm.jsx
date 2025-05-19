import React, { useState } from 'react';
import UserFormTab from './UserFormTab';
import TicketFormTab from './TicketFormTab';
import './MultiStepForm.css';

const MultiStepForm = () => {
  const [activeTab, setActiveTab] = useState('user');
  const [userId, setUserId] = useState(null);

  const handleLoginSuccess = (id) => {
    setUserId(id);
    setActiveTab('ticket'); // автоматически переключаемся на билет
  };

  return (
    <div className="multi-step-form">
      <div className="tab-header">
        <button
          className={activeTab === 'user' ? 'active' : ''}
          onClick={() => setActiveTab('user')}
        >
          Создать пользователя
        </button>

        <button
          className={activeTab === 'ticket' ? 'active' : ''}
          onClick={() => setActiveTab('ticket')}
        >
          Создать билет
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'user' && <UserFormTab setUserId={setUserId} />}
        {activeTab === 'ticket' && (
          <TicketFormTab
            userId={userId}
            onLoginSuccess={handleLoginSuccess}
          />
        )}
      </div>
    </div>
  );
};

export default MultiStepForm;