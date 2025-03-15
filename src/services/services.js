import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import db from './firebaseConfig';

class HabitAPI {
  static async getHabits() {
    const habitsCollection = collection(db, 'habits');
    const snapshot = await getDocs(habitsCollection);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  static async saveHabits(habits) {
    const habitsCollection = collection(db, 'habits');
 
    const snapshot = await getDocs(habitsCollection);
    const batch = [];
    snapshot.forEach(doc => batch.push(deleteDoc(doc.ref)));
    await Promise.all(batch);

    for (const habit of habits) {
      await addDoc(habitsCollection, habit);
    }
  }

  static async getGoals() {
    const goalsCollection = collection(db, 'goals');
    const snapshot = await getDocs(goalsCollection);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  static async saveGoals(goals) {
    const goalsCollection = collection(db, 'goals');

    const snapshot = await getDocs(goalsCollection);
    const batch = [];
    snapshot.forEach(doc => batch.push(deleteDoc(doc.ref)));
    await Promise.all(batch);

    for (const goal of goals) {
      await addDoc(goalsCollection, goal);
    }
  }

  static async deleteHabit(id) {
    const habitDoc = doc(db, 'habits', id);
    await deleteDoc(habitDoc);
  }

  static async deleteGoal(id) {
    const goalDoc = doc(db, 'goals', id);
    await deleteDoc(goalDoc);
  }

  static async updateHabit(id, updatedData) {
    const habitDoc = doc(db, 'habits', id);
    await updateDoc(habitDoc, updatedData);
  }

  static async updateGoal(id, updatedData) {
    const goalDoc = doc(db, 'goals', id);
    await updateDoc(goalDoc, updatedData);
  }
}

export default HabitAPI;