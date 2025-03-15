import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import Habits from './components/Habits';
import Goals from './components/Goals';
import Stats from './components/Stats';
import './App.css';

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}>
      <header className="header">
        <h1>Трекер привычек и целей</h1>
        <button onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? '☀️' : '🌙'}
        </button>
      </header>
      <nav className="nav">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`nav-button ${activeTab === 'dashboard' ? 'active' : ''}`}
        >
          Дашборд
        </button>
        <button
          onClick={() => setActiveTab('habits')}
          className={`nav-button ${activeTab === 'habits' ? 'active' : ''}`}
        >
          Привычки
        </button>
        <button
          onClick={() => setActiveTab('goals')}
          className={`nav-button ${activeTab === 'goals' ? 'active' : ''}`}
        >
          Цели
        </button>
        <button
          onClick={() => setActiveTab('stats')}
          className={`nav-button ${activeTab === 'stats' ? 'active' : ''}`}
        >
          Статистика
        </button>
      </nav>
      <main className="content">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'habits' && <Habits />}
        {activeTab === 'goals' && <Goals />}
        {activeTab === 'stats' && <Stats />}
      </main>
      <footer className="footer">
        Трекер привычек и целей © 2025
      </footer>
    </div>
  );
};

export default App;