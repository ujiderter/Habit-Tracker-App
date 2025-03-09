import React, { useState, useEffect } from 'react';
import HabitAPI from '../services/api';

const Dashboard = () => {
  const [habits, setHabits] = useState([]);
  const today = new Date().toISOString().split('T')[0];

  // Загрузка данных при монтировании компонента
  useEffect(() => {
    const loadHabits = async () => {
      const habitsData = await HabitAPI.getHabits();
      setHabits(habitsData);
    };

    loadHabits();
  }, []);

  // Вычисление статистики
  const completedHabits = habits.filter((h) => h.completed.includes(today)).length;
  const totalHabits = habits.length;
  const completionRate = totalHabits > 0 ? Math.round((completedHabits / totalHabits) * 100) : 0;

  return (
    <div>
      <h2>Сегодняшние привычки</h2>
      {habits.length === 0 ? (
        <p>Нет активных привычек. Добавьте новую привычку!</p>
      ) : (
        <ul>
          {habits.map((habit) => (
            <li key={habit.id}>
              {habit.name} | Серия: {habit.streak}
            </li>
          ))}
        </ul>
      )}
      <p>
        Привычек выполнено: {completedHabits}/{totalHabits} ({completionRate}%)
      </p>
    </div>
  );
};

export default Dashboard;