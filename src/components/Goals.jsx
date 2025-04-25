import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import HabitAPI from '../services/api';

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState({ name: '', target: 1, current: 0, deadline: '' });
  const [editingGoal, setEditingGoal] = useState(null);
  const [editGoal, setEditGoal] = useState({ name: '', target: 1, deadline: '' });
  const { t } = useTranslation();

  useEffect(() => {
    const loadGoals = async () => {
      const goalsData = await HabitAPI.getGoals();
      setGoals(goalsData);
    };
    loadGoals();
  }, []);

  // Валидация и добавление новой цели
  const addGoal = async (e) => {
    e.preventDefault();
    if (newGoal.name.trim() === '' || newGoal.target <= 0 || !newGoal.deadline) {
      alert(t('invalidGoalInput')); // Можно заменить на более красивую валидацию
      return;
    }

    const goal = {
      id: `goal_${Date.now()}`,
      name: newGoal.name,
      target: parseInt(newGoal.target),
      current: parseInt(newGoal.current),
      deadline: newGoal.deadline,
    };

    const updatedGoals = [...goals, goal];
    await HabitAPI.saveGoals(updatedGoals);
    setGoals(await HabitAPI.getGoals());
    setNewGoal({ name: '', target: 1, current: 0, deadline: '' });
  };

  // Изменение прогресса цели
  const updateGoalProgress = async (id, increment) => {
    const updatedGoals = goals.map((goal) =>
      goal.id === id
        ? {
            ...goal,
            current: Math.max(0, Math.min(goal.current + increment, goal.target)),
          }
        : goal
    );

    await HabitAPI.saveGoals(updatedGoals);
    setGoals(await HabitAPI.getGoals());
  };

  // Удаление цели
  const deleteGoal = async (id) => {
    await HabitAPI.deleteGoal(id);
    setGoals(await HabitAPI.getGoals());
  };

  // Редактирование цели
  const handleEditGoal = (goal) => {
    setEditingGoal(goal.id);
    setEditGoal({ name: goal.name, target: goal.target, deadline: goal.deadline });
  };

  const handleUpdateGoal = async (e, id) => {
    e.preventDefault();
    if (editGoal.name.trim() === '' || editGoal.target <= 0 || !editGoal.deadline) {
      alert(t('invalidGoalInput'));
      return;
    }

    await HabitAPI.updateGoal(id, {
      name: editGoal.name,
      target: parseInt(editGoal.target),
      deadline: editGoal.deadline,
    });
    setGoals(await HabitAPI.getGoals());
    setEditingGoal(null);
    setEditGoal({ name: '', target: 1, deadline: '' });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">{t('goals')}</h2>
      <form onSubmit={addGoal} className="mb-6 flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={newGoal.name}
          onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
          placeholder={t('goalNamePlaceholder')}
          className="p-2 border rounded-md text-gray-900 flex-grow"
        />
        <input
          type="number"
          value={newGoal.target}
          onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
          placeholder={t('targetValuePlaceholder')}
          min="1"
          className="p-2 border rounded-md text-gray-900 w-full sm:w-24"
        />
        <input
          type="date"
          value={newGoal.deadline}
          onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
          className="p-2 border rounded-md text-gray-900 w-full sm:w-48"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          {t('addGoal')}
        </button>
      </form>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700">
              <th className="p-2 text-left">{t('name')}</th>
              <th className="p-2 text-left">{t('progress')}</th>
              <th className="p-2 text-left">{t('deadline')}</th>
              <th className="p-2 text-left">{t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {goals.map((goal) => (
              <tr
                key={goal.id}
                className="border-b bg-white dark:bg-gray-800 dark:border-gray-700"
              >
                {editingGoal === goal.id ? (
                  <td colSpan="4" className="p-2">
                    <form
                      onSubmit={(e) => handleUpdateGoal(e, goal.id)}
                      className="flex flex-col sm:flex-row gap-2"
                    >
                      <input
                        type="text"
                        value={editGoal.name}
                        onChange={(e) => setEditGoal({ ...editGoal, name: e.target.value })}
                        placeholder={t('goalNamePlaceholder')}
                        className="p-2 border rounded-md text-gray-900 flex-grow"
                      />
                      <input
                        type="number"
                        value={editGoal.target}
                        onChange={(e) => setEditGoal({ ...editGoal, target: e.target.value })}
                        placeholder={t('targetValuePlaceholder')}
                        min="1"
                        className="p-2 border rounded-md text-gray-900 w-full sm:w-24"
                      />
                      <input
                        type="date"
                        value={editGoal.deadline}
                        onChange={(e) => setEditGoal({ ...editGoal, deadline: e.target.value })}
                        className="p-2 border rounded-md text-gray-900 w-full sm:w-48"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                      >
                        {t('save')}
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingGoal(null)}
                        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                      >
                        {t('cancel')}
                      </button>
                    </form>
                  </td>
                ) : (
                  <>
                    <td className="p-2">{goal.name}</td>
                    <td className="p-2">
                      {goal.current}/{goal.target} (
                      {Math.round((goal.current / goal.target) * 100)}%)
                    </td>
                    <td className="p-2">
                      {goal.deadline
                        ? new Date(goal.deadline).toLocaleDateString()
                        : t('noDeadline')}
                    </td>
                    <td className="p-2 flex gap-2">
                      <button
                        onClick={() => updateGoalProgress(goal.id, -1)}
                        disabled={goal.current <= 0}
                        className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
                      >
                        -1
                      </button>
                      <button
                        onClick={() => updateGoalProgress(goal.id, 1)}
                        disabled={goal.current >= goal.target}
                        className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
                      >
                        +1
                      </button>
                      <button
                        onClick={() => handleEditGoal(goal)}
                        className="px-2 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700"
                      >
                        {t('edit')}
                      </button>
                      <button
                        onClick={() => deleteGoal(goal.id)}
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

export default Goals;