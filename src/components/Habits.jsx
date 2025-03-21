import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import HabitAPI from '../services/api';

const Habits = () => {
  const [habits, setHabits] = useState([]);
  const [newHabit, setNewHabit] = useState({ name: '', frequency: 'daily' });
  const today = new Date().toISOString().split('T')[0];
  const { t } = useTranslation();

  useEffect(() => {
    const loadHabits = async () => {
      const habitsData = await HabitAPI.getHabits();
      setHabits(habitsData);
    };

    loadHabits();
  }, []);

  // Добавление новой привычки
  const addHabit = () => {
    if (newHabit.name.trim() === '') return;

    const habit = {
      id: Date.now(),
      name: newHabit.name,
      frequency: newHabit.frequency,
      streak: 0,
      completed: [],
    };

    const updatedHabits = [...habits, habit];
    HabitAPI.saveHabits(updatedHabits); // Сохраняем в API
    setHabits(updatedHabits); // Обновляем состояние
    setNewHabit({ name: '', frequency: 'daily' }); // Сбрасываем форму
  };

  // Изменение статуса выполнения привычки
  const toggleHabitCompletion = (id) => {
    const updatedHabits = habits.map((habit) =>
      habit.id === id
        ? {
            ...habit,
            completed: habit.completed.includes(today)
              ? habit.completed.filter((date) => date !== today)
              : [...habit.completed, today],
            streak: habit.completed.includes(today)
              ? Math.max(0, habit.streak - 1)
              : habit.streak + 1,
          }
        : habit
    );

    HabitAPI.saveHabits(updatedHabits); // Сохраняем в API
    setHabits(updatedHabits); // Обновляем состояние
  };

  // Удаление привычки
  const deleteHabit = (id) => {
    const updatedHabits = habits.filter((habit) => habit.id !== id);
    HabitAPI.saveHabits(updatedHabits); // Сохраняем в API
    setHabits(updatedHabits); // Обновляем состояние
  };

  return (
    <div>
      <h2>{t('habits')}</h2>
      <div>
        <input
          type="text"
          value={newHabit.name}
          onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
          placeholder={t('habitNamePlaceholder')}
        />
        <select
          value={newHabit.frequency}
          onChange={(e) => setNewHabit({ ...newHabit, frequency: e.target.value })}
        >
          <option value="daily">{t('daily')}</option>
          <option value="weekly">{t('weekly')}</option>
          <option value="monthly">{t('monthly')}</option>
        </select>
        <button onClick={addHabit}>{t('add')}</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>{t('name')}</th>
            <th>{t('frequency')}</th>
            <th>{t('streak')}</th>
            <th>{t('status')}</th>
            <th>{t('actions')}</th>
          </tr>
        </thead>
        <tbody>
          {habits.map((habit) => (
            <tr key={habit.id}>
              <td>{habit.name}</td>
              <td>{t(habit.frequency)}</td>
              <td>{habit.streak}</td>
              <td>
                <button onClick={() => toggleHabitCompletion(habit.id)}>
                  {habit.completed.includes(today) ? t('completed') : t('notCompleted')}
                </button>
              </td>
              <td>
                <button onClick={() => deleteHabit(habit.id)}>{t('delete')}</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Habits;