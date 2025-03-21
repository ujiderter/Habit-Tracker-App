import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import Habits from './components/Habits';
import Goals from './components/Goals';
import Stats from './components/Stats';
import { useTranslation } from 'react-i18next';
import './i18n';
import './App.css';

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(false);

  // Хук для перевода
  const { t, i18n } = useTranslation();

  // Состояние для текущего языка
  const [currentLanguage, setCurrentLanguage] = useState('ru');

  // Переключение языка
  const toggleLanguage = () => {
    const newLanguage = currentLanguage === 'ru' ? 'en' : 'ru';
    setCurrentLanguage(newLanguage);
    i18n.changeLanguage(newLanguage);
  };

  return (
    <div className={darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}>
      <header className="header">
        <h1>{t('title')}</h1>
        {/* Контейнер для переключателей */}
        <div
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            display: 'flex',
            gap: '10px',
            alignItems: 'center',
          }}
        >
          {/* Переключатель темы */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            style={{
              padding: '5px 10px',
              fontSize: '12px',
              border: '1px solid #ccc',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>

          {/* Переключатель языка */}
          <button
            onClick={toggleLanguage}
            style={{
              padding: '5px 10px',
              fontSize: '12px',
              border: '1px solid #ccc',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            {currentLanguage === 'ru' ? 'RU' : 'EN'}
          </button>
        </div>
      </header>
      <nav className="nav">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`nav-button ${activeTab === 'dashboard' ? 'active' : ''}`}
        >
          {t('dashboard')}
        </button>
        <button
          onClick={() => setActiveTab('habits')}
          className={`nav-button ${activeTab === 'habits' ? 'active' : ''}`}
        >
          {t('habits')}
        </button>
        <button
          onClick={() => setActiveTab('goals')}
          className={`nav-button ${activeTab === 'goals' ? 'active' : ''}`}
        >
          {t('goals')}
        </button>
        <button
          onClick={() => setActiveTab('stats')}
          className={`nav-button ${activeTab === 'stats' ? 'active' : ''}`}
        >
          {t('stats')}
        </button>
      </nav>
      <main className="content">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'habits' && <Habits />}
        {activeTab === 'goals' && <Goals />}
        {activeTab === 'stats' && <Stats />}
      </main>
      <footer className="footer">
        {t('footer')}
      </footer>
    </div>
  );
};

export default App;