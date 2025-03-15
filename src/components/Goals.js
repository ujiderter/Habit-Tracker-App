import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import HabitAPI from '../services/api';

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState({ name: '', target: 1, current: 0, deadline: '' });
  const { t } = useTranslation();

  useEffect(() => {
    const loadGoals = async () => {
      const goalsData = await HabitAPI.getGoals();
      setGoals(goalsData);
    };

    loadGoals();
  }, []);

  // Добавление новой цели
  const addGoal = () => {
    if (newGoal.name.trim() === '') return;

    const goal = {
      id: Date.now(),
      name: newGoal.name,
      target: parseInt(newGoal.target),
      current: parseInt(newGoal.current),
      deadline: newGoal.deadline,
    };

    const updatedGoals = [...goals, goal];
    HabitAPI.saveGoals(updatedGoals); // Сохраняем в API
    setGoals(updatedGoals); // Обновляем состояние
    setNewGoal({ name: '', target: 1, current: 0, deadline: '' }); // Сбрасываем форму
  };

  // Изменение прогресса цели
  const updateGoalProgress = (id, increment) => {
    const updatedGoals = goals.map((goal) =>
      goal.id === id
        ? {
            ...goal,
            current: Math.max(0, Math.min(goal.current + increment, goal.target)),
          }
        : goal
    );

    HabitAPI.saveGoals(updatedGoals); // Сохраняем в API
    setGoals(updatedGoals); // Обновляем состояние
  };

  // Удаление цели
  const deleteGoal = (id) => {
    const updatedGoals = goals.filter((goal) => goal.id !== id);
    HabitAPI.saveGoals(updatedGoals); // Сохраняем в API
    setGoals(updatedGoals); // Обновляем состояние
  };

  return (
    <div>
      <h2>{t('goals')}</h2>
      <div>
        <input
          type="text"
          value={newGoal.name}
          onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
          placeholder={t('goalNamePlaceholder')}
        />
        <input
          type="number"
          value={newGoal.target}
          onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
          placeholder={t('targetValuePlaceholder')}
        />
        <input
          type="number"
          value={newGoal.current}
          onChange={(e) => setNewGoal({ ...newGoal, current: e.target.value })}
          placeholder={t('currentProgressPlaceholder')}
        />
        <input
          type="date"
          value={newGoal.deadline}
          onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
          placeholder={t('deadlinePlaceholder')}
        />
        <button onClick={addGoal}>{t('addGoal')}</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>{t('name')}</th>
            <th>{t('progress')}</th>
            <th>{t('deadline')}</th>
            <th>{t('actions')}</th>
          </tr>
        </thead>
        <tbody>
          {goals.map((goal) => (
            <tr key={goal.id}>
              <td>{goal.name}</td>
              <td>{goal.current}/{goal.target}</td>
              <td>{goal.deadline && new Date(goal.deadline).toLocaleDateString()}</td>
              <td>
                <button onClick={() => updateGoalProgress(goal.id, -1)} disabled={goal.current <= 0}>
                  -1
                </button>
                <button onClick={() => updateGoalProgress(goal.id, 1)} disabled={goal.current >= goal.target}>
                  +1
                </button>
                <button onClick={() => deleteGoal(goal.id)}>{t('delete')}</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Goals;