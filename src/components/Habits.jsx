import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import HabitAPI from '../services/api';

const Habits = () => {
  const [habits, setHabits] = useState([]);
  const [newHabit, setNewHabit] = useState({ name: '', frequency: 'daily' });
  const [editingHabit, setEditingHabit] = useState(null);
  const [editHabit, setEditHabit] = useState({ name: '', frequency: 'daily' });
  const today = new Date().toISOString().split('T')[0];
  const { t } = useTranslation();

  useEffect(() => {
    const loadHabits = async () => {
      const habitsData = await HabitAPI.getHabits();
      setHabits(habitsData);
    };
    loadHabits();
  }, []);

  // Валидация и добавление новой привычки
  const addHabit = async (e) => {
    e.preventDefault();
    if (newHabit.name.trim() === '') {
      alert(t('invalidHabitInput')); // Можно заменить на уведомления
      return;
    }
    if (habits.some(habit => habit.name.toLowerCase() === newHabit.name.toLowerCase())) {
      alert(t('habitExists')); // Проверка на дубликат
      return;
    }

    const habit = {
      id: `habit_${Date.now()}`,
      name: newHabit.name,
      frequency: newHabit.frequency,
      streak: 0,
      completed: [],
    };

    const updatedHabits = [...habits, habit];
    await HabitAPI.saveHabits(updatedHabits);
    setHabits(await HabitAPI.getHabits());
    setNewHabit({ name: '', frequency: 'daily' });
  };

  // Изменение статуса выполнения привычки
  const toggleHabitCompletion = async (id) => {
    const habit = habits.find(h => h.id === id);
    if (!habit) return;

    const isCompletedToday = habit.completed?.includes(today);
    const updatedCompleted = isCompletedToday
      ? habit.completed.filter(date => date !== today)
      : [...(habit.completed || []), today];
    const updatedStreak = isCompletedToday
      ? Math.max(0, habit.streak - 1)
      : habit.streak + 1;

    await HabitAPI.updateHabit(id, {
      completed: updatedCompleted,
      streak: updatedStreak,
    });
    setHabits(await HabitAPI.getHabits());
  };

  // Удаление привычки
  const deleteHabit = async (id) => {
    await HabitAPI.deleteHabit(id);
    setHabits(await HabitAPI.getHabits());
  };

  // Редактирование привычки
  const handleEditHabit = (habit) => {
    setEditingHabit(habit.id);
    setEditHabit({ name: habit.name, frequency: habit.frequency });
  };

  const handleUpdateHabit = async (e, id) => {
    e.preventDefault();
    if (editHabit.name.trim() === '') {
      alert(t('invalidHabitInput'));
      return;
    }
    if (
      habits.some(
        habit => habit.name.toLowerCase() === editHabit.name.toLowerCase() && habit.id !== id
      )
    ) {
      alert(t('habitExists'));
      return;
    }

    await HabitAPI.updateHabit(id, {
      name: editHabit.name,
      frequency: editHabit.frequency,
    });
    setHabits(await HabitAPI.getHabits());
    setEditingHabit(null);
    setEditHabit({ name: '', frequency: 'daily' });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">{t('habits')}</h2>
      <form onSubmit={addHabit} className="mb-6 flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={newHabit.name}
          onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
          placeholder={t('habitNamePlaceholder')}
          className="p-2 border rounded-md text-gray-900 flex-grow"
        />
        <select
          value={newHabit.frequency}
          onChange={(e) => setNewHabit({ ...newHabit, frequency: e.target.value })}
          className="p-2 border rounded-md text-gray-900"
        >
          <option value="daily">{t('daily')}</option>
          <option value="weekly">{t('weekly')}</option>
          <option value="monthly">{t('monthly')}</option>
        </select>
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          {t('add')}
        </button>
      </form>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700">
              <th className="p-2 text-left">{t('name')}</th>
              <th className="p-2 text-left">{t('frequency')}</th>
              <th className="p-2 text-left">{t('streak')}</th>
              <th className="p-2 text-left">{t('status')}</th>
              <th className="p-2 text-left">{t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {habits.map((habit) => (
              <tr
                key={habit.id}
                className="border-b bg-white dark:bg-gray-800 dark:border-gray-700"
              >
                {editingHabit === habit.id ? (
                  <td colSpan="5" className="p-2">
                    <form
                      onSubmit={(e) => handleUpdateHabit(e, habit.id)}
                      className="flex flex-col sm:flex-row gap-2"
                    >
                      <input
                        type="text"
                        value={editHabit.name}
                        onChange={(e) =>
                          setEditHabit({ ...editHabit, name: e.target.value })
                        }
                        placeholder={t('editHabitPlaceholder')}
                        className="p-2 border rounded-md text-gray-900 flex-grow"
                      />
                      <select
                        value={editHabit.frequency}
                        onChange={(e) =>
                          setEditHabit({ ...editHabit, frequency: e.target.value })
                        }
                        className="p-2 border rounded-md text-gray-900"
                      >
                        <option value="daily">{t('daily')}</option>
                        <option value="weekly">{t('weekly')}</option>
                        <option value="monthly">{t('monthly')}</option>
                      </select>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                      >
                        {t('save')}
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingHabit(null)}
                        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                      >
                        {t('cancel')}
                      </button>
                    </form>
                  </td>
                ) : (
                  <>
                    <td className="p-2">{habit.name}</td>
                    <td className="p-2">{t(habit.frequency)}</td>
                    <td className="p-2">{habit.streak || 0}</td>
                    <td className="p-2">
                      <input
                        type="checkbox"
                        checked={habit.completed?.includes(today) || false}
                        onChange={() => toggleHabitCompletion(habit.id)}
                        className="h-5 w-5 text-indigo-600"
                      />
                    </td>
                    <td className="p-2 flex gap-2">
                      <button
                        onClick={() => handleEditHabit(habit)}
                        className="px-2 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700"
                      >
                        {t('edit')}
                      </button>
                      <button
                        onClick={() => deleteHabit(habit.id)}
                        className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        {t('delete')}
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default Habits;