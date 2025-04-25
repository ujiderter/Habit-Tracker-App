import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import HabitAPI from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const Stats = () => {
  const [habits, setHabits] = useState([]);
  const [goals, setGoals] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    const loadStats = async () => {
      const habitsData = await HabitAPI.getHabits();
      const goalsData = await HabitAPI.getGoals();
      setHabits(habitsData);
      setGoals(goalsData);
    };
    loadStats();
  }, []);

  // Текущая дата
  const today = new Date().toISOString().split('T')[0];

  // Статистика по привычкам
  const completedHabitsToday = habits.filter(h => h.completed?.includes(today)).length;
  const totalHabits = habits.length;
  const completionRate = totalHabits > 0 ? Math.round((completedHabitsToday / totalHabits) * 100) : 0;
  const maxStreak = Math.max(...habits.map(h => h.streak || 0), 0);

  // Статистика по привычкам за последние 7 дней
  const getPastDates = (days) => {
    const dates = [];
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates.reverse();
  };

  const habitCompletionData = getPastDates(7).map(date => ({
    date: new Date(date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }),
    completed: habits.filter(h => h.completed?.includes(date)).length,
  }));

  // Статистика по целям
  const completedGoals = goals.filter(g => g.current >= g.target).length;
  const totalGoals = goals.length;
  const goalCompletionRate = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;
  const averageGoalProgress = totalGoals > 0
    ? Math.round(goals.reduce((sum, g) => sum + (g.current / g.target) * 100, 0) / totalGoals)
    : 0;

  // Данные для круговой диаграммы целей
  const goalPieData = [
    { name: t('achieved'), value: completedGoals },
    { name: t('inProgress'), value: totalGoals - completedGoals },
  ];

  const COLORS = ['#4CAF50', '#2196F3'];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">{t('myStats')}</h2>

      {/* Карточки статистики */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <div className="p-4 bg-white dark:bg-gray-800 rounded-md shadow">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{t('totalHabits')}</h3>
          <p className="text-2xl text-indigo-600 dark:text-indigo-400">{totalHabits}</p>
        </div>
        <div className="p-4 bg-white dark:bg-gray-800 rounded-md shadow">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{t('completedToday')}</h3>
          <p className="text-2xl text-indigo-600 dark:text-indigo-400">{completedHabitsToday}</p>
        </div>
        <div className="p-4 bg-white dark:bg-gray-800 rounded-md shadow">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{t('habitCompletionRate')}</h3>
          <p className="text-2xl text-indigo-600 dark:text-indigo-400">{completionRate}%</p>
        </div>
        <div className="p-4 bg-white dark:bg-gray-800 rounded-md shadow">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{t('maxStreak')}</h3>
          <p className="text-2xl text-indigo-600 dark:text-indigo-400">{maxStreak}</p>
        </div>
        <div className="p-4 bg-white dark:bg-gray-800 rounded-md shadow">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{t('totalGoals')}</h3>
          <p className="text-2xl text-indigo-600 dark:text-indigo-400">{totalGoals}</p>
        </div>
        <div className="p-4 bg-white dark:bg-gray-800 rounded-md shadow">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{t('averageGoalProgress')}</h3>
          <p className="text-2xl text-indigo-600 dark:text-indigo-400">{averageGoalProgress}%</p>
        </div>
      </div>

      {/* Графики */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Линейный график: Завершённые привычки за неделю */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-md shadow">
          <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-gray-100">{t('habitsLast7Days')}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={habitCompletionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="completed" name={t('completed')} stroke="#4CAF50" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Круговая диаграмма: Прогресс целей */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-md shadow">
          <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-gray-100">{t('goalProgress')}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={goalPieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {goalPieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Stats;