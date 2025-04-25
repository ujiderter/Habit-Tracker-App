import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import db from './firebaseConfig';

const USE_LOCAL_STORAGE = true;

class StorageBackend {
  async getItems(collectionName) {
    throw new Error('getItems not implemented');
  }
  async saveItems(collectionName, items) {
    throw new Error('saveItems not implemented');
  }
  async deleteItem(collectionName, id) {
    throw new Error('deleteItem not implemented');
  }
  async updateItem(collectionName, id, updatedData) {
    throw new Error('updateItem not implemented');
  }
}

class FirebaseBackend extends StorageBackend {
  async getItems(collectionName) {
    const itemsCollection = collection(db, collectionName);
    const snapshot = await getDocs(itemsCollection);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async saveItems(collectionName, items) {
    const itemsCollection = collection(db, collectionName);
    const snapshot = await getDocs(itemsCollection);
    const batch = [];
    snapshot.forEach(doc => batch.push(deleteDoc(doc.ref)));
    await Promise.all(batch);

    for (const item of items) {
      await addDoc(itemsCollection, item);
    }
  }

  async deleteItem(collectionName, id) {
    const itemDoc = doc(db, collectionName, id);
    await deleteDoc(itemDoc);
  }

  async updateItem(collectionName, id, updatedData) {
    const itemDoc = doc(db, collectionName, id);
    await updateDoc(itemDoc, updatedData);
  }
}

class LocalStorageBackend extends StorageBackend {
  getStorageKey(collectionName) {
    return `productivity_app_${collectionName}`;
  }

  async getItems(collectionName) {
    const key = this.getStorageKey(collectionName);
    const items = JSON.parse(localStorage.getItem(key) || '[]');
    return items.map((item, index) => ({
      id: item.id || `local_${index}_${Date.now()}`,
      ...item,
    }));
  }

  async saveItems(collectionName, items) {
    const key = this.getStorageKey(collectionName);
    const itemsWithIds = items.map((item, index) => ({
      ...item,
      id: item.id || `local_${index}_${Date.now()}`,
    }));
    localStorage.setItem(key, JSON.stringify(itemsWithIds));
  }

  async deleteItem(collectionName, id) {
    const key = this.getStorageKey(collectionName);
    const items = JSON.parse(localStorage.getItem(key) || '[]');
    const updatedItems = items.filter(item => item.id !== id);
    localStorage.setItem(key, JSON.stringify(updatedItems));
  }

  async updateItem(collectionName, id, updatedData) {
    const key = this.getStorageKey(collectionName);
    const items = JSON.parse(localStorage.getItem(key) || '[]');
    const updatedItems = items.map(item =>
      item.id === id ? { ...item, ...updatedData, id } : item
    );
    localStorage.setItem(key, JSON.stringify(updatedItems));
  }
}


const backend = USE_LOCAL_STORAGE ? new LocalStorageBackend() : new FirebaseBackend();

class HabitAPI {
  static async getHabits() {
    return backend.getItems('habits');
  }

  static async saveHabits(habits) {
    await backend.saveItems('habits', habits);
  }

  static async getGoals() {
    return backend.getItems('goals');
  }

  static async saveGoals(goals) {
    await backend.saveItems('goals', goals);
  }

  static async deleteHabit(id) {
    await backend.deleteItem('habits', id);
  }

  static async deleteGoal(id) {
    await backend.deleteItem('goals', id);
  }

  static async updateHabit(id, updatedData) {
    await backend.updateItem('habits', id, updatedData);
  }

  static async updateGoal(id, updatedData) {
    await backend.updateItem('goals', id, updatedData);
  }
}

export default HabitAPI;