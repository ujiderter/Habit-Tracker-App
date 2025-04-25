import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import Habits from './components/Habits';
import Goals from './components/Goals';
import Stats from './components/Stats';
import { useTranslation } from 'react-i18next';
import './i18n';

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme === 'dark' : false;
  });
  const { t, i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState('ru');

  useEffect(() => {
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const toggleLanguage = () => {
    const newLanguage = currentLanguage === 'ru' ? 'en' : 'ru';
    setCurrentLanguage(newLanguage);
    i18n.changeLanguage(newLanguage);
  };

  return (
    <div className={`flex flex-col min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <header className="bg-indigo-600 dark:bg-indigo-800 text-white p-4 sticky top-0 z-10 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">{t('title')}</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full hover:bg-indigo-700 dark:hover:bg-indigo-900 transition-colors"
              title={t('toggle_theme')}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
            <button
              onClick={toggleLanguage}
              className="p-2 rounded-full hover:bg-indigo-700 dark:hover:bg-indigo-900 transition-colors"
              title={t('toggle_language')}
            >
              {currentLanguage === 'ru' ? 'RU' : 'EN'}
            </button>
          </div>
        </div>
      </header>
      <nav className="bg-gray-800 dark:bg-gray-950 p-4">
        <div className="container mx-auto flex justify-center gap-4">
          {['dashboard', 'habits', 'goals', 'stats'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              {t(tab)}
            </button>
          ))}
        </div>
      </nav>
      <main className="container mx-auto p-6 flex-grow">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'habits' && <Habits />}
        {activeTab === 'goals' && <Goals />}
        {activeTab === 'stats' && <Stats />}
      </main>
      <footer className="bg-gray-800 dark:bg-gray-950 text-white p-4">
        <div className="container mx-auto text-center">{t('footer')}</div>
      </footer>
    </div>
  );
};

export default App;