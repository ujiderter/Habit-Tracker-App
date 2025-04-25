import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import HabitAPI from '../services/api';

const Dashboard = () => {
  const [habits, setHabits] = useState([]);
  const today = new Date().toISOString().split('T')[0];
  const { t } = useTranslation();

  useEffect(() => {
    const loadHabits = async () => {
      const habitsData = await HabitAPI.getHabits();
      setHabits(habitsData);
    };
    loadHabits();
  }, []);

  const toggleHabitCompletion = async (habitId) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;

    const isCompletedToday = habit.completed?.includes(today);
    let updatedCompleted = habit.completed ? [...habit.completed] : [];
    let updatedStreak = habit.streak || 0;

    if (isCompletedToday) {
      // Удаляем отметку о выполнении
      updatedCompleted = updatedCompleted.filter(date => date !== today);
      updatedStreak = Math.max(0, updatedStreak - 1);
    } else {
      // Добавляем отметку о выполнении
      updatedCompleted.push(today);
      updatedStreak += 1;
    }

    const updatedData = {
      ...habit,
      completed: updatedCompleted,
      streak: updatedStreak,
    };

    await HabitAPI.updateHabit(habitId, updatedData);
    setHabits(await HabitAPI.getHabits());
  };

  // Вычисление статистики
  const completedHabits = habits.filter(h => h.completed?.includes(today)).length;
  const totalHabits = habits.length;
  const completionRate = totalHabits > 0 ? Math.round((completedHabits / totalHabits) * 100) : 0;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">{t('todayHabits')}</h2>
      {habits.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">{t('noActiveHabits')}</p>
      ) : (
        <ul className="space-y-4">
          {habits.map(habit => (
            <li
              key={habit.id}
              className="flex justify-between items-center p-4 bg-white dark:bg-gray-800 rounded-md shadow"
            >
              <div className="flex items-center gap-4">
                <input
                  type="checkbox"
                  checked={habit.completed?.includes(today) || false}
                  onChange={() => toggleHabitCompletion(habit.id)}
                  className="h-5 w-5 text-indigo-600"
                />
                <span className="text-lg">{habit.name}</span>
              </div>
              <span className="text-gray-600 dark:text-gray-400">
                {t('streak')}: {habit.streak || 0}
              </span>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-6 p-4 bg-indigo-100 dark:bg-indigo-900 rounded-md">
        <p className="text-lg font-medium">
          {t('completedToday')}: {completedHabits}/{totalHabits} ({completionRate}%)
        </p>
      </div>
    </div>
  );
};


export default Dashboard;