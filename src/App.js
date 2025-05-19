import React from 'react';
import MultiStepForm from './components/MultiStepForm';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Создание пользователя и билета</h1>
        <MultiStepForm />
      </header>
    </div>
  );
}

export default App;