import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import HabitAPI from '../services/api';

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

  const today = new Date().toISOString().split('T')[0];
  const completedHabits = habits.filter((h) => h.completed.includes(today)).length;
  const totalHabits = habits.length;
  const completionRate = totalHabits > 0 ? Math.round((completedHabits / totalHabits) * 100) : 0;

  const completedGoals = goals.filter((g) => g.current >= g.target).length;
  const totalGoals = goals.length;
  const goalCompletionRate = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

  return (
    <div>
      <h2>{t('myStats')}</h2>

      {/* Статистика по привычкам */}
      <h3>{t('habits')}</h3>
      <p>{t('totalHabits')}: {totalHabits}</p>
      <p>{t('completedToday')}: {completedHabits}</p>
      <p>{t('completionRate')}: {completionRate}%</p>

      {/* Статистика по целям */}
      <h3>{t('goals')}</h3>
      <p>{t('totalGoals')}: {totalGoals}</p>
      <p>{t('achieved')}: {completedGoals}</p>
      <p>{t('progress')}: {goalCompletionRate}%</p>
    </div>
  );
};

export default Stats;